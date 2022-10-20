import { ScaleTime } from 'd3'
import NextLink from 'next/link';
import dayjs from 'dayjs'

import { getLinkForRoadmapChild } from '../../lib/client/linkUtils';
import { IssueData } from '../../lib/types'

function RoadmapItem({childIssue, scale, index}: {childIssue: IssueData, scale: ScaleTime<number, number>, index: number}) {

  const x = 50
  const y = 50
  const xPadding = 5
  const yPadding = 5
  const etaX = scale(dayjs(childIssue.dueDate).toDate())
  console.log(`childIssue: `, childIssue);
  console.log('childIssue.title', childIssue.title)
  console.log('childIssue.dueDate', childIssue.dueDate)
  console.log(`childIssue.etaX: `, etaX);
  const ySpacingBetweenItems = 50
  const rectangleHeight = 50
  const yLocation = y + yPadding + ((rectangleHeight + ySpacingBetweenItems) * index)
  const rectConfig = {
    width: 200,
    height: 50,
    strokeWidth: 2
  }

  return (
    <NextLink key={`roadmapItem-${index}`} href={getLinkForRoadmapChild(childIssue)} passHref>
      <g cursor={'pointer'}>
        <rect
          x={etaX-rectConfig.width}
          y={yLocation}
          width={rectConfig.width}
          height={rectConfig.height}
          fill="white"
          opacity={0.5}
          strokeWidth={rectConfig.strokeWidth}
          stroke="black"
        />
        <rect
          x={etaX-rectConfig.width}
          y={yLocation}
          width={rectConfig.width * (childIssue.percent_done / 100)}
          height={rectConfig.height}
          fill="green"
          opacity={0.5}
          strokeWidth={rectConfig.strokeWidth}
          stroke="black"
        />
        <text dominantBaseline="text-before-edge" x={etaX-rectConfig.width+rectConfig.strokeWidth} y={yLocation+yPadding} dy={'.05em'} fontSize={10} textAnchor="start">{childIssue.title}</text>
        <text dominantBaseline="text-before-edge" x={etaX-rectConfig.strokeWidth} y={yLocation+rectConfig.height-yPadding-10} dy={'.05em'} fontSize={10} textAnchor="end">{childIssue.dueDate}</text>
      </g>
    </NextLink>
  )
}

export default RoadmapItem
