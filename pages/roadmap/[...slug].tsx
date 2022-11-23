import { Box } from '@chakra-ui/react';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import { RoadmapTabbedView } from '../../components/roadmap-grid/RoadmapTabbedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { BASE_PROTOCOL, BASE_URL } from '../../config/constants';
import { IssueData, QueryParameters, RoadmapApiResponse, RoadmapApiResponseFailure, RoadmapApiResponseSuccess, RoadmapServerSidePropsResult } from '../../lib/types';
import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';
import { ViewMode } from '../../lib/enums';
import { setViewMode } from '../../hooks/useViewMode';
import { DateGranularityState } from '../../lib/enums';
import { setDateGranularity } from '../../hooks/useDateGranularity';
import { useAsync } from '../../hooks/useAsync';
import { setIsLoading } from '../../hooks/useIsLoading';
import { paramsFromUrl } from '../../lib/paramsFromUrl';

export async function getServerSideProps(context): Promise<RoadmapServerSidePropsResult> {
  const [hostname, owner, repo, _, issue_number] = context.query.slug;
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
      baseUrl: `${BASE_PROTOCOL}://${BASE_URL}`,
    }
  }
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let { error: serverError, baseUrl, isLocal, mode, dateGranularity, issue_number, repo, owner } = props;

  const {execute, status, value: roadmapApiResult, error: asyncError} = useAsync(async () => {

    const urlString = `${baseUrl}/api/roadmap?owner=${owner}&repo=${repo}&issue_number=${issue_number}`
    try {
      const res = await fetch(new URL(urlString));

      return await res.json();
    } catch (err: any) {
      return {
        props: {
          // ...serverSideProps,
          error: {code: '500', message: err.toString()} as { code: string; message: string }
        }
      }
    }
  }, false);

  useEffect(() => {
    switch(status) {
      case 'idle':
        setIsLoading(true);
        execute();
        break;
      case 'error':
        setIsLoading(false);
        console.log('error roadmapApiResult:', asyncError);
        break;
      case 'pending':
        setIsLoading(true);
        break;
      case 'success':
        setIsLoading(false);
        console.log('success roadmapApiResult:', roadmapApiResult);

        break;
    }
  }, [status, roadmapApiResult, execute, asyncError])

  const errors = roadmapApiResult?.errors ?? [];
  const error = (roadmapApiResult as RoadmapApiResponseFailure)?.error || null;
  const issueData = ((roadmapApiResult as RoadmapApiResponseSuccess)?.data as IssueData) || null;
  const pendingChildren = (roadmapApiResult as RoadmapApiResponseSuccess)?.pendingChildren ?? [];


  // const [issueDataState, setIssueDataState] = useState(issueData);
  // const [errorState, setErrorState] = useState(error);
  // const [errorsState, setErrorsState] = useState(errors);
  const pendingChild = pendingChildren[0]
  const {
    error: pendingChildrenAsyncError,
    execute: pendingChildrenAsyncExecute,
    status: pendingChildrenAsyncStatus,
    value: pendingChildrenAsyncValue
  } = useAsync(async () => {
  //   for await (const pendingChild of pendingChildren) {

      console.log(`pendingChild: `, pendingChild);
      const { issue_number, owner, repo } = paramsFromUrl(pendingChild.html_url)
      const params = new URLSearchParams()
      params.append('issue_number', issue_number);
      params.append('repo', repo);
      params.append('owner', owner);
      const url = new URL(`${baseUrl}/api/pendingChild?${params}`)
      try {
        const res = await fetch(url);
        return await res.json();
        // console.log(`response: `, response);
      } catch (err) {
        console.error('error getting pending child', err);
        // break;
        throw err
      }

  //   }
  }, false);

  useEffect(() => {
    switch(pendingChildrenAsyncStatus) {
      case 'idle':
        pendingChildrenAsyncExecute();
        break;
      case 'error':
        console.log('pendingChildrenAsyncError', pendingChildrenAsyncError);
        break;
      case 'pending':
        break;
      case 'success':
        console.log('pendingChildrenAsyncValue', pendingChildrenAsyncValue);

        break;
    }
  }, [pendingChildrenAsyncError, pendingChildrenAsyncExecute, pendingChildrenAsyncStatus, pendingChildrenAsyncValue])


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
      <ErrorNotificationDisplay errors={errors ?? []} />
      <Box pt={5} pr="120px" pl="120px">
        {!!error && <Box color='red.500'>{error.message}</Box>}
        {!!issueData && mode === 'd3' && <NewRoadmap issueData={issueData} isLocal={isLocal} />}
        {issueData != null && mode === 'grid' && (
          <RoadmapTabbedView issueData={issueData} />
        )}
      </Box>
    </>
  );
}
