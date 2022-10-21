import type { InferGetServerSidePropsType } from 'next';
import { Box } from '@chakra-ui/react';

import { addHttpsIfNotLocal } from '../../utils/general';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import PageHeader from '../../components/layout/PageHeader';

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = addHttpsIfNotLocal(process.env.NEXT_PUBLIC_VERCEL_URL);
console.log('NEXT_PUBLIC_VERCEL_URL:', process.env.NEXT_PUBLIC_VERCEL_URL);
console.log('BASE_URL:', BASE_URL);
// console.log('BASE_URL:', process.env.BASE_URL);

export async function getServerSideProps(context) {
  console.log('inside roadmap page | getServerSideProps()');
  // console.dir(context, { depth: Infinity, maxArrayLength: Infinity });
  const [hostname, owner, repo, issues_placeholder, issue_number] = context.query.slug;
  const res = await fetch(new URL(`/api/roadmap?owner=${owner}&repo=${repo}&issue_number=${issue_number}`, BASE_URL));
  const response = await res.json();
  // console.log('response:', response);

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
