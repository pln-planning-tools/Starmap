import type { InferGetServerSidePropsType } from 'next';
import { Roadmap } from '../../components/Roadmap';
import { Box } from '@chakra-ui/react';
import { RoadmapForm } from '../../components/RoadmapForm';

// const BASE_URL = 'https://staging.pln-roadmap.nikas.page';
const BASE_URL = 'http://localhost:3000';

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
  const issueData = await res.json();
  // console.log('issueData', issueData);

  return {
    props: {
      issueData,
    },
  };
}

export default function RoadmapPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('inside /roadmap/[...slug].tsx | props');
  const { issueData } = props;

  return (
    <>
      <Box p={5}>
        <RoadmapForm />
        {!!issueData && <Roadmap issueData={issueData} />}
      </Box>
    </>
  );
}
