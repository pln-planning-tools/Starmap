import NextLink from 'next/link';

import { ScaleTime } from 'd3';
import dayjs from 'dayjs';

import { getLinkForRoadmapChild } from '../../lib/client/linkUtils';
import { IssueData } from '../../lib/types';
import { useMaxHeight, setMaxHeight } from '../../hooks/useMaxHeight';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import React from 'react';

function RoadmapItem({
  childIssue,
  scale,
  index,
}: {
  childIssue: IssueData;
  scale: ScaleTime<number, number>;
  index: number;
}) {
  const maxSvgHeight = useMaxHeight();
  console.log('index:', index);
  const y = 50;
  const yPadding = 5;
  const etaX = scale(dayjs(childIssue.due_date).toDate());
  const ySpacingBetweenItems = 20;
  const rectConfig = {
    width: 300,
    height: 80,
    strokeWidth: 2,
  };
  const minimumY = 20;
  // TODO: sgtpooki: increase distance of first item from top axis
  const yLocation = Math.max(y + yPadding + ((rectConfig.height + ySpacingBetweenItems) * index + 1), minimumY);
  const textPadding = 10;
  const rxSize = 10;

  // const randomIntFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  useEffect(() => {
    setMaxHeight(Math.max(rectConfig.height + yLocation, maxSvgHeight))
  }, [maxSvgHeight, rectConfig.height, yLocation])

  // TODO: Add on hover to show clickability
  return (
    <NextLink key={`roadmapItem-${index}`} href={getLinkForRoadmapChild(childIssue, useRouter().query)} passHref>
      <g cursor={'pointer'}>
        <rect
          x={etaX - rectConfig.width}
          y={yLocation}
          width={rectConfig.width}
          height={rectConfig.height}
          fill='white'
          opacity={0.5}
          rx={rxSize}
          strokeWidth={rectConfig.strokeWidth}
          stroke='darkblue'
        />
        <rect
          x={etaX - rectConfig.width}
          y={yLocation}
          // width={rectConfig.width * (randomIntFromInterval(0, 100) / 100)}
          width={rectConfig.width * (childIssue.completion_rate / 100)}
          height={rectConfig.height}
          fill='#93DEFF'
          // fill={'lightgreen'}
          opacity={0.95}
          rx={rxSize}
          ry={rxSize}
          // strokeWidth={rectConfig.strokeWidth}
          // stroke="black"
        />
        {/* <text dominantBaseline="text-before-edge" x={etaX-rectConfig.strokeWidth-textPadding} y={yLocation+yPadding} dy={'.05em'} fontSize={12} textAnchor="end">{childIssue.completion_rate}% complete</text> */}
        {/* <text dominantBaseline="text-before-edge" x={etaX-rectConfig.width + rectConfig.width * (childIssue.completion_rate / 100)+ 15} y={yLocation+yPadding+30} dy={'.05em'} fontSize={12} textAnchor="end">{childIssue.completion_rate}%</text> */}
        <text
          dominantBaseline='text-before-edge'
          x={etaX - rectConfig.width + rectConfig.strokeWidth + textPadding}
          y={yLocation + yPadding}
          dy={'.05em'}
          fontSize={20}
          textAnchor='start'
        >
          {childIssue.title}
        </text>
        {/* <text dominantBaseline="text-before-edge" x={etaX-rectConfig.width+rectConfig.strokeWidth+textPadding} y={yLocation+yPadding*6} dy={'.05em'} fontSize={16} textAnchor="start">state: {childIssue.state}</text> */}

        <text
          dominantBaseline='text-before-edge'
          x={etaX - rectConfig.strokeWidth - textPadding}
          y={yLocation + rectConfig.height - yPadding - textPadding * 1.8}
          dy={'.05em'}
          fontSize={14}
          textAnchor='end'
        >
          {childIssue.due_date}
        </text>
      </g>
    </NextLink>
  );
}

export default RoadmapItem;
