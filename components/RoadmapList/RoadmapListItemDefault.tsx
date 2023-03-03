import { Grid, GridItem, Center, Link, Stack, HStack, Text, Flex } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { IssueData } from '../../lib/types';
import SvgGitHubLogo from '../icons/svgr/SvgGitHubLogo';
import BulletConnector from './BulletConnector';
import BulletIcon from './BulletIcon';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import { dayjs } from '../../lib/client/dayjs';
import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';
import { ViewMode } from '../../lib/enums';

type ListIssueViewModel = Pick<IssueData, 'html_url' | 'due_date' | 'title' | 'completion_rate' | 'description' | 'children'>
// eslint-disable-next-line import/no-unused-modules
export default function RoadmapListItemDefault ({ issue, index, issues }: {issue: ListIssueViewModel, index: number, issues: ListIssueViewModel[]}) {
  const { owner, repo, issue_number } = paramsFromUrl(issue.html_url)
  const childLink = getLinkForRoadmapChild({ issueData: issue, query: useRouter().query, viewMode: ViewMode.List })

  let titleTextOrLink = <Text fontSize={"xl"} lineHeight="32px">{issue.title}</Text>
  if (childLink !== '#') {
    titleTextOrLink = (
      <NextLink key={`roadmapItem-${index}`} href={childLink} passHref>
        <Link color="linkBlue" cursor="pointer" _hover={{ textDecoration: 'none' }}>
          {titleTextOrLink}
        </Link>
      </NextLink>
    )
  }

  return (
    <Grid width="100%" key={issue.html_url}
      templateAreas={`"date icon title"
                      "empty line description"`}
      gridTemplateRows={'1fr 1fr'}
      gridTemplateColumns={'1fr 1fr 8fr'}
      columnGap={0}
      rowGap={0}>
      <GridItem area="date" lineHeight="32px">
        <Center>
          <Text size="l" color="spotLightBlue" lineHeight="32px">{issue.due_date ? dayjs(issue.due_date).format('MMM D, YYYY') : 'unknown'}</Text>
        </Center>
      </GridItem>
      <GridItem area="icon" lineHeight="32px">
        <Center>
          <BulletIcon completion_rate={issue.completion_rate} />
        </Center>
      </GridItem>
      <GridItem area="title" lineHeight="32px">
        <HStack gap={0} alignItems="flex-start">
          <Link href={issue.html_url} lineHeight="32px" isExternal>
            <HStack gap={0} alignItems="center" wrap={"nowrap"}>
              <SvgGitHubLogo style={{ display:'inline', color: '#313239' }} fill="#313239" />
              <Text color="text" style={{ whiteSpace: 'nowrap' }}>{owner}/{repo}#{issue_number}</Text>
            </HStack>
          </Link>
          {titleTextOrLink}
        </HStack>
      </GridItem>
      <GridItem gridRow="1/-1" area="line" pos="relative">
        <Center height="100%">
          <BulletConnector isLast={index === issues.length - 1}>&nbsp;</BulletConnector>
        </Center>
      </GridItem>
      <GridItem area="description">description: {issue.description}</GridItem>
    </Grid>
  )
}
