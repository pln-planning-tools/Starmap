import type { InferGetServerSidePropsType } from 'next';
import { Roadmap } from '../../components/Roadmap';
import { Box, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { RoadmapForm } from '../../components/RoadmapForm';

// const BASE_URL = 'https://staging.pln-roadmap.nikas.page';
// const BASE_URL = 'http://localhost:3000';
const BASE_URL = process.env.BASE_URL || 'https://staging.pln-roadmap.nikas.page';

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
      <FormControl p={2} textAlign='right'>
        <FormLabel htmlFor='isDetailedView' display='inline' textAlign='right'>
          Detailed view:
        </FormLabel>
        <Switch id='isDetailedView' textAlign='right' />
      </FormControl>
      <Box p={5}>
        <RoadmapForm />
        {!!issueData && <Roadmap issueData={issueData} />}
      </Box>
    </>
  );
}
