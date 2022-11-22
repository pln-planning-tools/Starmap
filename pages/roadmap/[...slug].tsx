import { Box } from '@chakra-ui/react';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import { RoadmapTabbedView } from '../../components/roadmap-grid/RoadmapTabbedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { API_URL } from '../../config/constants';
import { IssueData, QueryParameters, RoadmapApiResponse, RoadmapApiResponseFailure, RoadmapApiResponseSuccess, ServerSidePropsResult } from '../../lib/types';
import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';
import { ViewMode } from '../../lib/enums';
import { setViewMode } from '../../hooks/useViewMode';
import { DateGranularityState } from '../../lib/enums';
import { setDateGranularity } from '../../hooks/useDateGranularity';

export async function getServerSideProps(context): Promise<ServerSidePropsResult> {
  const [hostname, owner, repo, issues_placeholder, issue_number] = context.query.slug;
  const { filter_group, mode, timeUnit }: QueryParameters = context.query;

  const serverSideProps: ServerSidePropsResult['props'] = {
    errors: [],
    error: null,
    issueData: null,
    isLocal: process.env.IS_LOCAL === 'true',
    groupBy: filter_group || null,
    mode: mode || 'grid',
    dateGranularity: timeUnit || DateGranularityState.Months,
  };

  try {
    const res = await fetch(
      new URL(`${API_URL}?owner=${owner}&repo=${repo}&issue_number=${issue_number}&filter_group=${filter_group}`),
    );
    const response: RoadmapApiResponse = await res.json();
    return {
      props: {
        ...serverSideProps,
        errors: response.errors ?? [],
        error: (response as RoadmapApiResponseFailure).error || null,
        issueData: ((response as RoadmapApiResponseSuccess).data as IssueData) || null,
      },
    };
  } catch (err) {
    console.error(`err: `, err);
    return {
      props: {
        ...serverSideProps,
        error: err as { code: string; message: string }
      }
    }
  }
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { issueData, error, errors, isLocal, mode, dateGranularity } = props;

  useEffect(() => {
    setDateGranularity(dateGranularity);
  }, [dateGranularity, setDateGranularity]);

  const router = useRouter();
  const urlPath = router.asPath
  useEffect(() => {
    const hashString = urlPath.split('#')[1] as ViewMode ?? ViewMode.Simple;
    setViewMode(hashString);
  }, [urlPath])

  return (
    <>
      <PageHeader />
      <ErrorNotificationDisplay errors={errors} />
      <Box pt={5} pr="120px" pl="120px">
        {!!error && <Box color='red.500'>{error.message}</Box>}
        {!!issueData && mode === 'd3' && <NewRoadmap issueData={issueData} isLocal={isLocal} />}
        {!!issueData && mode === 'grid' && (
          <RoadmapTabbedView issueData={issueData} />
        )}
      </Box>
    </>
  );
}
