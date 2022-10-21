import { Box, Text, Link, Progress } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { getLinkForRoadmapChild } from '../../lib/client/linkUtils';
import { IssueData } from '../../lib/types';

interface RoadmapHeaderProps {
  issueData: IssueData;
}

function RoadmapHeader({ issueData }: RoadmapHeaderProps) {
  // console.log(`issueData: `, issueData);
  const router = useRouter();

  return (
    <>
      {/* TODO: */}
      <Text onClick={() => router.back()}>
        <Link color='blue.500'>{'<'} Back to parent roadmap</Link>
      </Text>
      {/* TODO: add github icon */}
      <Text as='span' mb='8px' fontSize={40} fontWeight={600}>
        {/* <NextLink href={getLinkForRoadmapChild(issueData)} passHref> */}
        {/* <Link color='black.500' > */}
        {issueData.title}
        {/* </Link> */}
        {/* </NextLink> */}
      </Text>
      {/* <Text as="span" mb='8px' fontSize={10} fontWeight={600}>
        <NextLink href={issueData.html_url} passHref>
          <Link color='blue.500'>(github)</Link>
        </NextLink>
      </Text> */}
    </>
  );
}

export default RoadmapHeader;
export type { RoadmapHeaderProps };
