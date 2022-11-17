import type { InferGetServerSidePropsType } from 'next';

import { Box } from '@chakra-ui/react';

import PageHeader from '../../components/layout/PageHeader';
import { RoadmapDetailed } from '../../components/roadmap-grid/RoadmapDetailedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { API_URL } from '../../config/constants';
import { IssueData, RoadmapApiResponse, ServerSidePropsResult } from '../../lib/types';
import { ErrorNotificationDisplay } from '../../components/errors/ErrorNotificationDisplay';

export async function getServerSideProps(context): Promise<ServerSidePropsResult> {
  const [hostname, owner, repo, issues_placeholder, issue_number] = context.query.slug;
  const { filter_group, mode } = context.query;
  const res = await fetch(
    new URL(`${API_URL}?owner=${owner}&repo=${repo}&issue_number=${issue_number}&filter_group=${filter_group}`),
  );
  const response: RoadmapApiResponse = await res.json();

  return {
    props: {
      errors: response.errors ?? [],
      error: response.error || null,
      issueData: (response.data as IssueData) || null,
      isLocal: process.env.IS_LOCAL === 'true',
      groupBy: filter_group || null,
      mode: mode || 'grid',
    },
  };
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { issueData, error, errors, isLocal, mode } = props;

  return (
    <>
      <PageHeader />
      <ErrorNotificationDisplay errors={errors} />

      <Box pt={5} pr="120px" pl="120px">
        {!!error && <Box color='red.500'>{error.message}</Box>}
        {!!issueData && mode === 'd3' && <NewRoadmap issueData={issueData} isLocal={isLocal} />}
        {!!issueData && mode === 'grid' && (
          <RoadmapDetailed issueData={issueData} />
        )}
      </Box>
    </>
  );
}
