import React from 'react';
import { Flex, Center, Box, Spacer, Icon, Stack, Grid } from '@chakra-ui/react'

import { IssueData } from '../../lib/types';

interface SortedIssuesWithDueDatesProps {
  issuesWithDueDates: IssueData[]
}

const OpenCircleIcon = (props) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fillOpacity={0}
      stroke='currentColor'
      strokeWidth={2}
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
    // Do a new path around the outside of the existing circle in a dark gray
    <path
      fillOpacity={1}
      stroke='gray'
      strokeWidth={2}
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

const ClosedCircleIcon = (props) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
    <path
      fill='gray'
      fillOpacity={1}
      stroke='gray'
      strokeWidth={2}
      d='M 110, 110 m -75, 0 a 70,70 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

export default function SortedIssuesWithDueDates({ issuesWithDueDates }: SortedIssuesWithDueDatesProps): JSX.Element {
  return (
    <Stack width="100%" direction={"column"} spacing="10" alignItems="center">
      {issuesWithDueDates.map((issue) => (
        <>
        <Stack width="100%" key={issue.html_url} direction="row" spacing="5" alignItems="center" justifyContent="flex-start">
          {/* <article> */}
            <Box>{issue.due_date}</Box>
            {/* <Spacer/> */}
            <Box>{ issue.completion_rate === 100 ? <ClosedCircleIcon/> : <OpenCircleIcon />}</Box>
            {/* <Spacer/> */}
            <Box>{issue.title}</Box>
          {/* </article> */}
        </Stack>
        <Stack width="100%" key={issue.html_url} direction="row" spacing="5">
          <Spacer/>
          <Spacer/>
          <Box>{issue.description}</Box>
        </Stack>
        </>
      ))}
    </Stack>
  )
}
