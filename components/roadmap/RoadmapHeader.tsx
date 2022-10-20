import { Box, Text, Link, Progress } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router'


import { getLinkForRoadmapChild } from '../../lib/client/linkUtils';
import { IssueData } from '../../lib/types';

interface RoadmapHeaderProps {
  issueData: IssueData
}

function RoadmapHeader({issueData}: RoadmapHeaderProps) {
  console.log(`issueData: `, issueData);
  const router = useRouter();

  return (
    <>
      <Text mb='8px' fontSize={18} fontWeight={600} onClick={() => router.back()}>
        {/* <NextLink href={getLinkForRoadmapChild(issueData)} passHref> */}
          <Link color='blue.500'>{issueData.title}</Link>
        {/* </NextLink> */}
      </Text>
      <Text mb='8px' fontSize={10} fontWeight={600}>
        <NextLink href={issueData.html_url} passHref>
          <Link color='blue.500'>(github)</Link>
        </NextLink>
      </Text>
    </>
  )
}

export default RoadmapHeader
export type { RoadmapHeaderProps }
