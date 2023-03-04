import { Grid, GridItem, Center, Link, HStack, Text, Skeleton } from '@chakra-ui/react';
import { LinkIcon } from '@chakra-ui/icons';
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
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { ImmutableObject } from '@hookstate/core';

type ListIssueViewModel = Pick<ImmutableObject<IssueData>, 'html_url' | 'due_date' | 'title' | 'completion_rate' | 'description' | 'children'>
// eslint-disable-next-line import/no-unused-modules
export default function RoadmapListItemDefault ({ issue, index, issues }: {issue: ListIssueViewModel, index: number, issues: ListIssueViewModel[]}) {
  const { owner, repo, issue_number } = paramsFromUrl(issue.html_url)
  const childLink = getLinkForRoadmapChild({ issueData: issue, query: useRouter().query, viewMode: ViewMode.List })
  const globalLoadingState = useGlobalLoadingState();
  const hasChildren = childLink !== '#'

  let titleTextOrLink = <Text fontWeight="semibold" color="linkBlue" fontSize={"xl"} lineHeight="32px">{hasChildren ? <LinkIcon lineHeight="32px" boxSize="10px" /> : null} {issue.title}</Text>
  if (hasChildren) {
    titleTextOrLink = (
      <NextLink key={`roadmapItem-${index}`} href={childLink} passHref>
        <Link cursor="pointer" _hover={{ textDecoration: 'none' }}>
          {titleTextOrLink}
        </Link>
      </NextLink>
    )
  }

  return (
    <Grid width="100%" key={issue.html_url}
      templateAreas={`"date icon title"
                      "empty line description"`}
      gridTemplateRows={'1fr auto'}
      gridTemplateColumns={'1fr 1fr 8fr'}
      columnGap={0}
      rowGap={0}>
      <GridItem area="date" lineHeight="32px">
        <Center>
          <Skeleton isLoaded={!globalLoadingState.get()}>
            <Text size="l" color="spotLightBlue" lineHeight="32px">{issue.due_date ? dayjs(issue.due_date).format('MMM D, YYYY') : 'unknown'}</Text>
          </Skeleton>
        </Center>
      </GridItem>
      <GridItem area="icon" lineHeight="32px">
        <Center>
          <Skeleton isLoaded={!globalLoadingState.get()}>
            <BulletIcon completion_rate={issue.completion_rate} />
          </Skeleton>
        </Center>
      </GridItem>
      <GridItem area="title">
        <HStack gap={0} alignItems="flex-start">
          <Link href={issue.html_url} lineHeight="32px" isExternal>
            <Skeleton isLoaded={!globalLoadingState.get()}>
              <HStack gap={0} alignItems="center" wrap={"nowrap"}>
                <SvgGitHubLogo color="text" style={{ display:'inline', color: '#313239' }} fill="#313239" />
                <Text color="text" style={{ whiteSpace: 'nowrap' }} fontSize="large">{owner}/{repo}#{issue_number}</Text>
              </HStack>
            </Skeleton>
          </Link>
          <Skeleton isLoaded={!globalLoadingState.get()}>
            {titleTextOrLink}
          </Skeleton>
        </HStack>
      </GridItem>
      <GridItem gridRow="1/-1" area="line" pos="relative">
        <Center height="100%">
          <BulletConnector isLast={index === issues.length - 1}>&nbsp;</BulletConnector>
        </Center>
      </GridItem>
      <GridItem area="description" pb="2rem">
          <Skeleton isLoaded={!globalLoadingState.get()}>
            <Text fontSize="medium">{issue.description}</Text>
          </Skeleton>
      </GridItem>
    </Grid>
  )
}
