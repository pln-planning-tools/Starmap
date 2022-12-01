import { Box } from '@chakra-ui/react';
import { none, State, useHookstate } from '@hookstate/core';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { StarmapsBreadcrumb } from '../../components/breadcrumb';

import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';
import PageHeader from '../../components/layout/PageHeader';
import { RoadmapTabbedView } from '../../components/roadmap-grid/RoadmapTabbedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { BASE_PROTOCOL } from '../../config/constants';
import { setDateGranularity } from '../../hooks/useDateGranularity';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { setViewMode } from '../../hooks/useViewMode';
import { DateGranularityState, ViewMode } from '../../lib/enums';
import { findIssueDataByUrl } from '../../lib/findIssueDataByUrl';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import {
  IssueData,
  PendingChildren,
  QueryParameters,
  RoadmapApiResponse,
  RoadmapApiResponseFailure,
  RoadmapApiResponseSuccess,
  RoadmapServerSidePropsResult,
  StarMapsIssueErrorsGrouped
} from '../../lib/types';

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
  const pendingChildrenState = useHookstate<PendingChildren[]>([])
  const asyncIssueDataState = useHookstate<IssueData[]>([])
  const globalLoadingState = useGlobalLoadingState();
  const [isRootIssueLoading, setIsRootIssueLoading] = useState(false);
  const [isPendingChildrenLoading, setIsPendingChildrenLoading] = useState(false);

  const errors = starMapsErrorsState.get({ noproxy: true });
  const roadmapLoadError = roadmapLoadErrorState.get({ noproxy: true });

  useEffect(() => {
    if (isRootIssueLoading) return;
    setIsRootIssueLoading(true);
    const fetchRoadMap = async () => {
      // globalLoadingState.start();
      const roadmapApiUrl = `${window.location.origin}/api/roadmap?owner=${owner}&repo=${repo}&issue_number=${issue_number}`
      try {
        const apiResult = await fetch(new URL(roadmapApiUrl))
        const roadmapResponse: RoadmapApiResponse = await apiResult.json();

        const roadmapResponseSuccess = roadmapResponse as RoadmapApiResponseSuccess;
        const roadmapResponseFailure = roadmapResponse as RoadmapApiResponseFailure;
        if (roadmapResponse.errors) {
          starMapsErrorsState.set(roadmapResponse.errors);
        }
        if (roadmapResponseSuccess.pendingChildren.length > 0) {
          pendingChildrenState.set(roadmapResponseSuccess.pendingChildren)
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
      setIsRootIssueLoading(false);
    };

    fetchRoadMap();

  }, [issue_number, repo, owner]);

  useEffect(() => {
    if (isPendingChildrenLoading) return;
    const typedPendingChild = pendingChildrenState[0];
    if (typedPendingChild == null || typedPendingChild.html_url?.value == null) {
      pendingChildrenState[0].set(none);
      return
    }
    const fetchPendingChildren = async () => {
      setIsPendingChildrenLoading(true);

      const { issue_number, owner, repo } = paramsFromUrl(typedPendingChild.html_url.value)
      const requestBody = {
        issue_number,
        owner,
        repo,
        parent: findIssueDataByUrl(issueDataState.get() as IssueData, typedPendingChild.parentHtmlUrl.value)
      };
      const pendingChildApiUrl = new URL(`${window.location.origin}/api/pendingChild`);

      try {
        const apiResult = await fetch(pendingChildApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        const pendingChildResponse: IssueData | {error: Error} = await apiResult.json();
        const pendingChildFailure = pendingChildResponse as {error: Error};
        const pendingChildSuccess = pendingChildResponse as IssueData;
        if (pendingChildFailure.error != null) {
          roadmapLoadErrorState.set({ code: pendingChildFailure.error.name, message: pendingChildFailure.error.message });
        } else {
          asyncIssueDataState.merge([pendingChildSuccess]);
        }
      } catch (err) {
        console.error(`err: `, err);
        roadmapLoadErrorState.set({ code: `Error fetching ${pendingChildApiUrl}`, message: `Error fetching ${pendingChildApiUrl}: ${(err as Error).toString()}` })
      }
      pendingChildrenState[0].set(none);

      setIsPendingChildrenLoading(false);
    };
    fetchPendingChildren();
  }, [issue_number, repo, owner, isRootIssueLoading, pendingChildrenState.value]);

  /**
   * Add asyncIssueData items to issueDataState
   */
  useEffect(() => {
    const issueData = issueDataState.get({ noproxy: true }) as IssueData;
    const asyncIssues = asyncIssueDataState.get();
    if (asyncIssues.length === 0) {
      return
    }
    const newIssueData = asyncIssueDataState[0];
    if (newIssueData !== undefined) {
      try {
        const parentIndex = issueData.children.findIndex((potentialParent) => potentialParent.html_url === newIssueData.parent.html_url.value);
        if (parentIndex > -1) {
          (issueDataState as State<IssueData>).children[parentIndex].children.merge([newIssueData.get({ noproxy: true })]);
        } else {
          throw new Error('Could not find parentIndex');
        }

      } catch (err) {
        console.log('getting parent - error', err);
        console.log('getting parent - error - issueData', issueData);
      }
      asyncIssueDataState[0].set(none)
    }

  }, [asyncIssueDataState.value]);

  /**
   * Resolve global loading after root issue and pending issues are done.
   */
  useEffect(() => {
    if (!isRootIssueLoading && pendingChildrenState.length === 0 && asyncIssueDataState.length === 0) {
      globalLoadingState.stop();
    } else {
      globalLoadingState.start();
    }
  }, [isRootIssueLoading, pendingChildrenState.length, asyncIssueDataState.length])

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
      <div style={{ overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
        {!!issueDataState.ornull && <StarmapsBreadcrumb currentTitle={issueDataState.ornull.title.value} />}
        <ErrorNotificationDisplay errors={errors ?? []} issueDataState={issueDataState}/>
        <Box pr="120px" pl="120px" mt="2rem">
          {!!serverError && <Box color='red.500'>{serverError.message}</Box>}
          {!!roadmapLoadError && <Box color='red.500'>{roadmapLoadError.message}</Box>}
          {!!issueDataState.ornull && mode === 'd3' && <NewRoadmap issueData={issueDataState.get({ noproxy: true }) as IssueData} isLocal={isLocal} />}
          {!!issueDataState.ornull && mode === 'grid' && (
            <RoadmapTabbedView issueDataState={issueDataState as State<IssueData>} />
          )}
        </Box>
      </div>
    </>
  );
}
