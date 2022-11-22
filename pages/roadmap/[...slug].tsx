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
import { useAsync } from '../../hooks/useAsync';
import { paramsFromUrl } from '../../lib/paramsFromUrl';

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
    pendingChildren: [],
  };

  try {
    const res = await fetch(
      new URL(`${API_URL}?owner=${owner}&repo=${repo}&issue_number=${issue_number}&filter_group=${filter_group}`),
    );
    const response: RoadmapApiResponse = await res.json();
    // console.log(`(response as RoadmapApiResponseSuccess)?.pendingChildren: `, (response as RoadmapApiResponseSuccess)?.pendingChildren);
    return {
      props: {
        ...serverSideProps,
        errors: response.errors ?? [],
        error: (response as RoadmapApiResponseFailure).error || null,
        issueData: ((response as RoadmapApiResponseSuccess).data as IssueData) || null,
        pendingChildren: (response as RoadmapApiResponseSuccess)?.pendingChildren ?? [],
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

let done = false;
export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { issueData, error, errors, isLocal, mode, dateGranularity, pendingChildren } = props;
  const pendingChild = pendingChildren[0]
  const {execute, status, value, error: asyncError} = useAsync(async () => {
  //   for await (const pendingChild of pendingChildren) {
    if (done) {
      return;
    }
      done = true
      console.log(`pendingChild: `, pendingChild);
      const { issue_number, owner, repo } = paramsFromUrl(pendingChild.html_url)
      const params = new URLSearchParams()
      params.append('issue_number', issue_number);
      params.append('repo', repo);
      params.append('owner', owner);
      params.append('group', pendingChild.group);
      const url = new URL(`${window.location.origin}/api/pendingChild?${params}`)
      console.log(`url: `, url);
      try {
        const res = await fetch(url);
        const response: RoadmapApiResponse = await res.json();
        console.log(`response: `, response);
      } catch (err) {
        console.error('error getting pending child', err);
        // break;
        throw err
      }

  //   }
  }, false);
  // console.log(`asyncError: `, asyncError);
  // console.log(`value: `, value);
  // console.log(`status: `, status);
  // console.log(`execute: `, execute);

  useEffect(() => {
    switch(status) {
      case 'idle':
        execute();
        break;
      case 'error':
        console.log('error', asyncError);
        break;
      case 'pending':
        break;
      case 'success':
        console.log('success', value);

        break;
    }
  }, [status, value, execute, asyncError])


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
