import React from 'react';
import { Flex, Center, Box, Spacer, Icon, Stack, Grid, GridItem } from '@chakra-ui/react'

import { IssueData } from '../../lib/types';
import BulletIcon from './BulletIcon';
import BulletConnector from './BulletConnector';

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
    {/* <path
      fillOpacity={1}
      // stroke='gray'
      strokeWidth={2}
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    /> */}
  </Icon>
)


const ClosedCircleIcon = (props) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
    {/* <path
      fill='gray'
      // fillOpacity={1}
      stroke='gray'
      strokeWidth={2}
      d='M 110, 110 m -75, 0 a 70,70 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    /> */}
  </Icon>
)


export default function SortedIssuesWithDueDates({ issuesWithDueDates }: SortedIssuesWithDueDatesProps): JSX.Element {
  const totalColumns = 5
  const dateColumns = totalColumns/5
  const circleColumns = 1
  const descriptionColStart = dateColumns + circleColumns + 1

  return (
    <Grid width="100%"
      // templateAreas={`"date icon title"
      //                 "empty empty description"`}
      // gridTemplateRows={'1fr 1fr 1fr'}
      // gridTemplateColumns={'1fr 0.5fr 4fr'}
      templateRows={`repeat(${issuesWithDueDates.length}, 1fr)`}
      // templateColumns={`repeat(${totalColumns}, 1fr)`}
      alignItems="center">
      {issuesWithDueDates.map((issue, index) => (
        <>
        {/* <Grid width="100%" key={issue.html_url} direction="row" spacing="5" alignItems="center" justifyContent="flex-start"> */}
        <Grid width="100%" key={issue.html_url}
          templateAreas={`"date icon title"
                          "empty line description"`}
          gridTemplateRows={'1fr 1fr'}
          gridTemplateColumns={'1fr 0.5fr 8fr'}
          >
          {/* <article> */}
            <GridItem area="date"><Center>{issue.due_date}</Center></GridItem>
            {/* <Spacer/> */}
            <GridItem area="icon">
              <Center>
                <BulletIcon completion_rate={issue.completion_rate} />
              </Center>
            </GridItem>
            {/* <Spacer/> */}
            <GridItem area="title">{issue.title}</GridItem>
            <GridItem area="line" pos="relative">
              <Center>
              <BulletConnector isLast={index === issuesWithDueDates.length -1}>&nbsp;</BulletConnector>
              </Center>
            </GridItem>

          {/* </article> */}
        {/* </Grid>
        <Grid width="100%" key={issue.html_url} direction="row" spacing="5"> */}
          {/* <Spacer/>
          <Spacer/> */}
          <GridItem area="description">description: {issue.description}</GridItem>
        </Grid>
        </>
      ))}
    </Grid>
  )
}
