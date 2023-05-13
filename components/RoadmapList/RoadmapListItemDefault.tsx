import { LinkIcon } from '@chakra-ui/icons'
import { Grid, GridItem, Center, Link, HStack, Text, Skeleton } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState'
import { dayjs } from '../../lib/client/dayjs'
import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild'
import { ViewMode } from '../../lib/enums'
import { paramsFromUrl } from '../../lib/paramsFromUrl'
import SvgGitHubLogo from '../icons/svgr/SvgGitHubLogo'
import BulletConnector from './BulletConnector'
import BulletIcon from './BulletIcon'
import { ListIssueViewModel } from './types'

interface RoadmapListItemDefaultProps {
  issue: ListIssueViewModel
  index: number
  issues: ListIssueViewModel[]
}

function TitleText ({ hasChildren, issue }: Pick<RoadmapListItemDefaultProps, 'issue'> & {hasChildren: boolean}) {
  return (
    <Text fontWeight="semibold" color="linkBlue" fontSize={'xl'} lineHeight="32px">
      {hasChildren ? <LinkIcon lineHeight="32px" boxSize="10px" /> : null} {issue.title}
    </Text>
  )
}

function TitleTextMaybeLink ({ issue, hasChildren, index, childLink }: Pick<RoadmapListItemDefaultProps, 'issue'> & {hasChildren: boolean, index: number, childLink: string}) {
  const titleText = <TitleText hasChildren={hasChildren} issue={issue} />
  if (!hasChildren) {
    return titleText
  }
  return (
      <NextLink key={`roadmapItem-${index}`} href={childLink} passHref>
        <Link cursor="pointer" _hover={{ textDecoration: 'none' }}>
          {titleText}
        </Link>
      </NextLink>
  )
}

export default function RoadmapListItemDefault ({ issue, index, issues }: RoadmapListItemDefaultProps) {
  const { owner, repo, issue_number } = paramsFromUrl(issue.html_url)
  const childLink = getLinkForRoadmapChild({ issueData: issue, query: useRouter().query, viewMode: ViewMode.List })
  const globalLoadingState = useGlobalLoadingState()
  const hasChildren = childLink !== '#'
  const issueDueDate = issue.due_date ? dayjs(issue.due_date).format('MMM D, YYYY') : 'unknown'

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
            <Text size="l" color="spotLightBlue" lineHeight="32px">{issueDueDate}</Text>
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
              <HStack gap={0} alignItems="center" wrap={'nowrap'}>
                <SvgGitHubLogo color="text" style={{ display: 'inline', color: '#313239' }} fill="#313239" />
                <Text color="text" style={{ whiteSpace: 'nowrap' }} fontSize="large">{owner}/{repo}#{issue_number}</Text>
              </HStack>
            </Skeleton>
          </Link>
          <Skeleton isLoaded={!globalLoadingState.get()}>
            <TitleTextMaybeLink hasChildren={hasChildren} issue={issue} index={index} childLink={childLink} />
          </Skeleton>
        </HStack>
      </GridItem>
      <GridItem gridRow="1/-1" area="line" pos="relative">
        <Center height="100%">
          <BulletConnector isLast={index === issues.length - 1} />
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
