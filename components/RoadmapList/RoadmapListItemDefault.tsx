import { Grid, GridItem, Center, Link, Stack,HStack, Text, Flex } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import React from 'react';

import { IssueData } from '../../lib/types';
import SvgGitHubLogo from '../icons/svgr/SvgGitHubLogo';
import BulletConnector from './BulletConnector';
import BulletIcon from './BulletIcon';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import { dayjs } from '../../lib/client/dayjs';

// eslint-disable-next-line import/no-unused-modules
export default function RoadmapListItemDefault ({ issue, index, issuesWithDueDates }: {issue: IssueData, index: number, issuesWithDueDates: IssueData[]}) {
  const { owner, repo, issue_number } = paramsFromUrl(issue.html_url)
  return (
    <Grid width="100%" key={issue.html_url}
      templateAreas={`"date icon title"
                      "empty line description"`}
      gridTemplateRows={'1fr 1fr'}
      gridTemplateColumns={'1fr 1fr 8fr'}
      columnGap={0}
      rowGap={0}>
      {/* <> */}
      <GridItem area="date">
        <Center>
          <Text size="l" color="#1FA5FF">{dayjs(issue.due_date).format('MMM D, YYYY')}</Text>
        </Center>
      </GridItem>
      <GridItem area="icon">
        <Center>
          <BulletIcon completion_rate={issue.completion_rate} />
        </Center>
      </GridItem>
      <GridItem area="title">
        <HStack gap={0} alignItems="flex-start">
          <Link href={issue.html_url} lineHeight="1.5rem" isExternal>
            <HStack gap={0} alignItems="center" wrap={"nowrap"}>
              <SvgGitHubLogo style={{ display:'inline', color: '#313239' }} fill="#313239" />
              <Text color="#313239" style={{ whiteSpace: 'nowrap' }}>{owner}/{repo}#{issue_number}</Text>
              {/* <ExternalLinkIcon mx='2px' color="#313239"/> */}
            </HStack>
          </Link>
          {/* <Flex> margin-top:-0.2rem */}
            <Text color="#4987bd" fontSize={"xl"} lineHeight="1.5rem">{issue.title}</Text>
          {/* </Flex> */}
        </HStack>
      </GridItem>
      <GridItem gridRow="1/-1" area="line" pos="relative">
        <Center height="100%">
          <BulletConnector isLast={index === issuesWithDueDates.length - 1}>&nbsp;</BulletConnector>
        </Center>
      </GridItem>
      <GridItem area="description">description: {issue.description}</GridItem>
      {/* </> */}
    </Grid>
  )
}
