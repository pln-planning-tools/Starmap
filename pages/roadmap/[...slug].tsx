import type { InferGetServerSidePropsType } from 'next';
import { Roadmap } from '../../components/Roadmap';
import { Box, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { RoadmapForm } from '../../components/RoadmapForm';
import { addHttpsIfNotLocal } from '../../utils/general';
import NewRoadmap from '../../components/roadmap/NewRoadmap';
import { GithubIssueApiResponse, IssueData } from '../../lib/types';
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
  const res = await fetch(
    new URL(
      `/api/github-issue?depth=1&url=${new URL(`${owner}/${repo}/issues/${issue_number}`, 'https://github.com')}`,
      BASE_URL,
    ),
  );
  const {error, issueData} = await res.json() as GithubIssueApiResponse;
  // console.log(`props: `, props);
  // console.dir(issueData, { depth: Infinity, maxArrayLength: Infinity });

  return {
    props: {
      error,
      issueData
    }
  };
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('inside /roadmap/[...slug].tsx | props');
  const { issueData, error } = props;

  return (
    <>
      <PageHeader />
      <Box p={5}>
        {!!error && <Box color='red.500'>{error}</Box>}
        {!!issueData && <NewRoadmap issueData={issueData} />}
        {!!issueData && <Roadmap issueData={issueData} />}
      </Box>
    </>
  );
}
