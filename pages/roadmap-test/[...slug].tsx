import type { InferGetServerSidePropsType } from 'next';

import { Box } from '@chakra-ui/react';

import PageHeader from '../../components/layout/PageHeader';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { API_URL } from '../../config/constants';
import { RoadmapApiResponse } from '../../lib/types';

export async function getServerSideProps(context) {
  console.log('inside roadmap page | getServerSideProps()');
  const [hostname, owner, repo, issues_placeholder, issue_number] = context.query.slug;
  const { filter_group } = context.query;
  const { mode } = context.query;
  const res = await fetch(
    new URL(`${API_URL}?owner=${owner}&repo=${repo}&issue_number=${issue_number}&filter_group=${filter_group}`),
  );
  const response: RoadmapApiResponse = await res.json();

  return {
    props: {
      error: response.error || null,
      issueData: response.data || null,
      isLocal: process.env.IS_LOCAL === 'true',
      groupBy: filter_group || null,
      mode: mode || null,
    },
  };
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('inside /roadmap/[...slug].tsx');
  const { issueData, error, isLocal } = props;

  return (
    <>
      <PageHeader />
      <Box p={5}>
        {!!error && <Box color='red.500'>{error.message}</Box>}
        {props.mode === 'd3' && issueData !== null && !!issueData && (
          <NewRoadmap issueData={issueData} isLocal={isLocal} />
        )}
        {/* {props.mode === 'grid' ||
          (!props.mode && !!issueData && <Roadmap issueData={issueData} groupBy={props.groupBy} />)} */}
      </Box>
    </>
  );
}
