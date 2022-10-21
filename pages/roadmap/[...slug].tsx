import type { InferGetServerSidePropsType } from 'next';

import { Box } from '@chakra-ui/react';

import PageHeader from '../../components/layout/PageHeader';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { API_URL } from '../../config/constants';

export async function getServerSideProps(context) {
  console.log('inside roadmap page | getServerSideProps()');
  const [hostname, owner, repo, issues_placeholder, issue_number] = context.query.slug;
  console.log('API_URL:', API_URL);
  const res = await fetch(new URL(`${API_URL}?owner=${owner}&repo=${repo}&issue_number=${issue_number}`));
  const response = await res.json();

  return {
    props: {
      error: response.error || null,
      issueData: response.data || null,
      isLocal: process.env.IS_LOCAL === 'true',
    },
  };
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('inside /roadmap/[...slug].tsx | props');
  const { issueData, error, isLocal } = props;

  return (
    <>
      <PageHeader />
      <Box p={5}>
        {!!error && <Box color='red.500'>{error.message}</Box>}
        {!!issueData && <NewRoadmap issueData={issueData} isLocal={isLocal} />}
        {/* {!!issueData && <Roadmap issueData={issueData} />} */}
      </Box>
    </>
  );
}
