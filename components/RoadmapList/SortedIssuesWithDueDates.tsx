import React from 'react';
import { Flex, Center, Box, Spacer, Icon, Stack, Grid, GridItem } from '@chakra-ui/react'

import { IssueData } from '../../lib/types';
import BulletIcon from './BulletIcon';
import BulletConnector from './BulletConnector';
import RoadmapListItem from './RoadmapListItem';

interface SortedIssuesWithDueDatesProps {
  issuesWithDueDates: IssueData[]
}


export default function SortedIssuesWithDueDates({ issuesWithDueDates }: SortedIssuesWithDueDatesProps): JSX.Element {
  // const totalColumns = 5
  // const dateColumns = totalColumns/5
  // const circleColumns = 1
  // const descriptionColStart = dateColumns + circleColumns + 1

  return (
    // <Grid width="100%"
    //   // templateAreas={`"date icon title"
    //   //                 "empty empty description"`}
    //   // gridTemplateRows={'1fr 1fr 1fr'}
    //   // gridTemplateColumns={'1fr 0.5fr 4fr'}
    //   templateRows={`repeat(${issuesWithDueDates.length}, 1fr)`}
    //   templateColumns={`repeat(1, 1fr)`}
    //   alignItems="center"
    //   rowGap={0}
    //   gridRow={2}
    //   columnGap={0}>
    <>
      {issuesWithDueDates.map((issue, index) => (
        <RoadmapListItem key={index} issue={issue} index={index} issuesWithDueDates={issuesWithDueDates} />
      ))}
    </>

    //   {/* <GridItem rowStart={(index*2)+1} rowEnd={(index*2)+2} area="line" pos="relative">
    //     <Center height="100%">
    //     <BulletConnector isLast={index === issuesWithDueDates.length - 1}>&nbsp;</BulletConnector>
    //     </Center>
    //   </GridItem> */}
    // </Grid>
  )
}
