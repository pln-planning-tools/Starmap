import { Box } from '@chakra-ui/react';
import type { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import { RoadmapTabbedView } from '../../components/roadmap-grid/RoadmapTabbedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { BASE_PROTOCOL, BASE_URL } from '../../config/constants';
import { IssueData, ParserGetChildrenResponse, QueryParameters, RoadmapApiResponse, RoadmapApiResponseFailure, RoadmapApiResponseSuccess, RoadmapServerSidePropsResult, StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';
import { ViewMode } from '../../lib/enums';
import { setViewMode } from '../../hooks/useViewMode';
import { DateGranularityState } from '../../lib/enums';
import { setDateGranularity } from '../../hooks/useDateGranularity';
import { useAsync } from '../../hooks/useAsync';
import { setIsLoading } from '../../hooks/useIsLoading';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import { addStarMapsErrorsToStarMapsErrorGroups } from '../../lib/addStarMapsErrorsToStarMapsErrorGroups';
import { mergeStarMapsErrorGroups } from '../../lib/mergeStarMapsErrorGroups';

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

  const [pendingInitialApiCall, setPendingInitialApiCall] = useState(true);
  const [pendingChildren, setPendingChildren] = useState<ParserGetChildrenResponse[]>([]);
  const [errors, setErrors] = useState<StarMapsIssueErrorsGrouped[]>([]);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [issueData, setIssueData] = useState<IssueData | null>(null);

  const {execute, status, value: roadmapApiResult, error: asyncError} = useAsync<RoadmapApiResponseSuccess, RoadmapApiResponseFailure>(async () => {

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
    let newStarMapsErrors: StarMapsIssueErrorsGrouped[] = []
    switch(status) {
      case 'idle':
        setIsLoading(true);
        execute();
        break;
      case 'error':
        if (!pendingInitialApiCall) {
          return
        }
        setIsLoading(false);
        setPendingInitialApiCall(false);
        const typedAsyncError = asyncError as RoadmapApiResponseFailure;
        if (typedAsyncError.error != null) {
          setError(typedAsyncError.error ?? null);
        }
        newStarMapsErrors = typedAsyncError.errors ?? []
        if (newStarMapsErrors.length > 0) {
          setErrors(mergeStarMapsErrorGroups(errors, newStarMapsErrors))
        }
        break;
      case 'pending':
        setIsLoading(true);
        break;
      case 'success':
        if (!pendingInitialApiCall) {
          return
        }
        setPendingInitialApiCall(false);
        const typedRoadmapApiResult = roadmapApiResult as RoadmapApiResponseSuccess;
        setIsLoading(false);
        console.log('success roadmapApiResult:', roadmapApiResult);

        setPendingChildren(typedRoadmapApiResult.pendingChildren)
        newStarMapsErrors = typedRoadmapApiResult.errors ?? []
        if (newStarMapsErrors.length > 0) {
          setErrors(mergeStarMapsErrorGroups(errors, newStarMapsErrors))
        }
        setIssueData(typedRoadmapApiResult.data)

        break;
    }
  }, [status, roadmapApiResult, execute, asyncError, pendingInitialApiCall])

  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
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
        if (pendingChild != null) {
          setIsLoadingChildren(true);
          pendingChildrenAsyncExecute();
        }
        break;
      case 'error':
        setIsLoadingChildren(false);
        console.log('pendingChildrenAsyncError', pendingChildrenAsyncError);
        break;
      case 'pending':
        setIsLoadingChildren(true);
        break;
      case 'success':
        setIsLoadingChildren(false);
        console.log('pendingChildrenAsyncValue', pendingChildrenAsyncValue);

        break;
    }
  }, [pendingChild, pendingChildrenAsyncError, pendingChildrenAsyncExecute, pendingChildrenAsyncStatus, pendingChildrenAsyncValue])


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
          <RoadmapTabbedView issueData={issueData} isLoadingChildren={isLoadingChildren}/>
        )}
      </Box>
    </>
  );
}
