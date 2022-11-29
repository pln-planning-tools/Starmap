import { Box } from '@chakra-ui/react';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';

import PageHeader from '../../components/layout/PageHeader';
import { RoadmapTabbedView } from '../../components/roadmap-grid/RoadmapTabbedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { BASE_PROTOCOL } from '../../config/constants';
import { IssueData, QueryParameters, RoadmapApiResponse, RoadmapApiResponseFailure, RoadmapApiResponseSuccess, RoadmapServerSidePropsResult, StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';
import { ViewMode , DateGranularityState } from '../../lib/enums';
import { setViewMode } from '../../hooks/useViewMode';
import { setDateGranularity } from '../../hooks/useDateGranularity';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';

export async function getServerSideProps(context): Promise<RoadmapServerSidePropsResult> {
  const [_hostname, owner, repo, _, issue_number] = context.query.slug;
  const { filter_group, mode, timeUnit }: QueryParameters = context.query;

  return {
    props: {
      owner,
      repo,
      issue_number,
      isLocal: process.env.IS_LOCAL === 'true',
      groupBy: filter_group || null,
      mode: mode || 'grid',
      dateGranularity: timeUnit || DateGranularityState.Months,
      baseUrl: `${BASE_PROTOCOL}://${process.env.VERCEL_URL}`,
    }
  }
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { error: serverError, isLocal, mode, dateGranularity, issue_number, repo, owner } = props;

  const starMapsErrorsState = useHookstate<StarMapsIssueErrorsGrouped[]>([]);
  const roadmapLoadErrorState = useHookstate<{ code: string; message: string } | null>(null)
  const issueDataState = useHookstate<IssueData | null>(null);
  const globalLoadingState = useGlobalLoadingState();

  useEffect(() => {
    if (globalLoadingState.get()) return;
    const fetchRoadMapResponse = async () => {
      globalLoadingState.start();
      const roadmapApiUrl = `${window.location.origin}/api/roadmap?owner=${owner}&repo=${repo}&issue_number=${issue_number}`
      try {
        const apiResult = await fetch(new URL(roadmapApiUrl))
        const roadmapResponse: RoadmapApiResponse = await apiResult.json();

        const roadmapResponseSuccess = roadmapResponse as RoadmapApiResponseSuccess;
        const roadmapResponseFailure = roadmapResponse as RoadmapApiResponseFailure;
        if (roadmapResponse.errors) {
          starMapsErrorsState.set(roadmapResponse.errors);
        }

        if (roadmapResponseFailure.error != null) {
          roadmapLoadErrorState.set(roadmapResponseFailure.error);
        } else {
          issueDataState.set(roadmapResponseSuccess.data);
        }

      } catch (err) {
        console.log(`Error fetching ${roadmapApiUrl}`, err);
        roadmapLoadErrorState.set({ code: `Error fetching ${roadmapApiUrl}`, message: `Error fetching ${roadmapApiUrl}: ${(err as Error).toString()}` })
      }
      globalLoadingState.stop()
    };

    fetchRoadMapResponse();

  }, [issue_number, repo, owner]);

  useEffect(() => {
    setDateGranularity(dateGranularity);
  }, [dateGranularity, setDateGranularity]);

  const router = useRouter();
  const urlPath = router.asPath
  useEffect(() => {
    const hashString = urlPath.split('#')[1] as ViewMode ?? ViewMode.Simple;
    setViewMode(hashString);
  }, [urlPath])

  const issueData = issueDataState.get({ noproxy: true }) as IssueData
  const errors = starMapsErrorsState.get({ noproxy: true });
  const roadmapLoadError = roadmapLoadErrorState.get({ noproxy: true });

  return (
    <>
      <PageHeader />
      <ErrorNotificationDisplay errors={errors ?? []} />
      <Box pt={5} pr="120px" pl="120px">
        {!!serverError && <Box color='red.500'>{serverError.message}</Box>}
        {!!roadmapLoadError && <Box color='red.500'>{roadmapLoadError.message}</Box>}
        {!!issueData && mode === 'd3' && <NewRoadmap issueData={issueData} isLocal={isLocal} />}
        {!!issueData && mode === 'grid' && (
          <RoadmapTabbedView issueData={issueData} />
        )}
      </Box>
    </>
  );
}
