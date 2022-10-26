import type { InferGetServerSidePropsType } from 'next';

import { Box } from '@chakra-ui/react';

import PageHeader from '../../components/layout/PageHeader';
import { Roadmap } from '../../components/roadmap-grid/Roadmap';
import { RoadmapDetailed } from '../../components/roadmap-grid/RoadmapDetailedView';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { API_URL } from '../../config/constants';
import { IssueData, RoadmapApiResponse } from '../../lib/types';

export async function getServerSideProps(context) {
  console.log('inside roadmap page | getServerSideProps()');
  const [hostname, owner, repo, issues_placeholder, issue_number] = context.query.slug;
  const { filter_group, mode, view } = context.query;
  const res = await fetch(
    new URL(`${API_URL}?owner=${owner}&repo=${repo}&issue_number=${issue_number}&filter_group=${filter_group}`),
  );
  const response: RoadmapApiResponse = await res.json();

  return {
    props: {
      error: response.error || null,
      issueData: (response.data as IssueData) || null,
      isLocal: process.env.IS_LOCAL === 'true',
      groupBy: filter_group || null,
      mode: mode || 'grid',
      view: (!!view && view) || 'simple',
    },
  };
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('inside /roadmap/[...slug].tsx');
  const { issueData, error, isLocal, view, mode } = props;

  return (
    <>
      <PageHeader />
      <Box p={5}>
        {!!error && <Box color='red.500'>{error.message}</Box>}
        {mode === 'd3' && <NewRoadmap issueData={issueData} isLocal={isLocal} />}
        {mode === 'grid' && view === 'detail' && <RoadmapDetailed viewMode={view} issueData={issueData} />}
        {mode === 'grid' && view === 'simple' && <RoadmapDetailed viewMode={view} issueData={issueData} />}
      </Box>
    </>
  );
}
