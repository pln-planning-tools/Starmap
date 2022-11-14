import { useRouter } from 'next/router';
import { Link, Text } from '@chakra-ui/react';

import { IssueData } from '../../lib/types';

interface RoadmapHeaderProps {
  issueData: IssueData;
}

function RoadmapHeader({ issueData }: RoadmapHeaderProps) {
  const router = useRouter();

  return (
    <>
      <Text onClick={() => router.back()}>
        <Link color='blue.500'>{'<'} Back to parent roadmap</Link>
      </Text>
      <Text as='span' mb='8px' fontSize={40} fontWeight={600}>
        {issueData.title}
      </Text>
    </>
  );
}

export default RoadmapHeader;
export type { RoadmapHeaderProps };
