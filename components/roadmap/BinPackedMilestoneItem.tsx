import NextLink from 'next/link';

import { ScaleTime } from 'd3';
import dayjs from 'dayjs';

import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';
// import { IssueData } from '../../lib/types';
import { useMaxHeight, setMaxHeight } from '../../hooks/useMaxHeight';
import { useEffect, useId, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { useMilestoneBoundingRects, setMilestoneBoundingRects } from '../../hooks/useMilestoneBoundingRects';
import { Text } from '@visx/text';
import { BinPackItem } from './lib';

// interface MilestoneRect extends DOMRect {
//   id: string
//   title: string
// }

// function isIntersect(rect1: MilestoneRect, rect2: MilestoneRect) {
//   // if (rect1.top < rect2.top) {
//   //   return false // don't intersect if rect1 is above rect2
//   // }
//   return rect1.top <= rect2.bottom && rect1.bottom >= rect2.top && rect1.left <= rect2.right && rect1.right >= rect2.left
// }

// function sortRectsByTop(rect1: MilestoneRect, rect2: MilestoneRect) {
//   return rect1.top - rect2.top
// }

// /**
//  * Given a list of rects, return the top-most yLocation within the x1 and x2 range
//  * @param param0
//  * @returns
//  */
// function getYLocation (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
//   const rects = boundingRects.filter((rect) => isIntersect(rect, givenRect)).sort(sortRectsByTop)
//   const yLocation = rects.length > 0 ? rects[0].top : givenRect.top
//   return yLocation
// }

// // return all rects within given x range (all returned rects are in the same, or a colliding, column)
// function getIntersectingRectsColumn (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
//   return boundingRects.filter((rect) => givenRect.left <= rect.right && givenRect.right >= rect.left)
// }

// // return all rects within a given y range (all returned rects are in the same, or a colliding, row)
// function getIntersectingRectsRow (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
//   return boundingRects.filter((rect) => givenRect.top <= rect.bottom && givenRect.bottom >= rect.top)
// }

// return whether there is space within a given row (y1-y2) for a given rect (x1-x2)
// function isSpaceInRow (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
//   const rects = getIntersectingRectsColumn(boundingRects, givenRect)
// }

// D3 milestone item
function BinPackedMilestoneItem({
  item,
  // index,
}: {
  item: BinPackItem;
  // index?: number;
}) {
  const itemRef = useRef<SVGGElement>(null);
  // const allBoundingRects = useMilestoneBoundingRects();
  const uniqId = useId();

  const yPadding = 5;

  const rectConfig = {
    width: 300,
    height: 80,
    strokeWidth: 2,
  };
  const textPadding = 10;
  const rxSize = 10;

  const itemHeight = item.bottom - item.top
  const itemWidth = item.right - item.left
  return (
    <NextLink key={uniqId} href={getLinkForRoadmapChild({ issueData: item.data, query: useRouter().query })} passHref>
      <g cursor={'pointer'} ref={itemRef}>
        <rect
          x={item.left}
          y={item.top}
          width={itemWidth}
          height={itemHeight}
          fill='white'
          opacity={0.5}
          rx={rxSize}
          strokeWidth={rectConfig.strokeWidth}
          stroke='darkblue'
        />
        {/* <rect
          x={etaX - calculatedWidth}
          y={yLocation}
          // width={calculatedWidth * (randomIntFromInterval(0, 100) / 100)}
          width={calculatedWidth * (childIssue.completion_rate / 100)}
          height={rectConfig.height}
          fill='#93DEFF'
          // fill={'lightgreen'}
          opacity={0.95}
          rx={rxSize}
          ry={rxSize}
          // strokeWidth={rectConfig.strokeWidth}
          // stroke="black"
        /> */}
        {/* <text dominantBaseline="text-before-edge" x={etaX-rectConfig.strokeWidth-textPadding} y={yLocation+yPadding} dy={'.05em'} fontSize={12} textAnchor="end">{childIssue.completion_rate}% complete</text> */}
        {/* <text dominantBaseline="text-before-edge" x={etaX-calculatedWidth + calculatedWidth * (childIssue.completion_rate / 100)+ 15} y={yLocation+yPadding+30} dy={'.05em'} fontSize={12} textAnchor="end">{childIssue.completion_rate}%</text> */}
        <Text
          dominantBaseline='text-before-edge'
          x={item.left - rectConfig.strokeWidth*2}
          y={item.top}
          dy={'.05em'}
          dx={textPadding}
          width={itemWidth * .80}
          fontSize={18}
          // textAnchor='end'
          verticalAnchor='middle'
        >
          {item.data.title}
        </Text>
        {/* <text dominantBaseline="text-before-edge" x={etaX-calculatedWidth+rectConfig.strokeWidth+textPadding} y={yLocation+yPadding*6} dy={'.05em'} fontSize={16} textAnchor="start">state: {childIssue.state}</text> */}

        <Text
          dominantBaseline='text-before-edge'
          x={item.left - rectConfig.strokeWidth*2 + textPadding}
          y={item.bottom - yPadding - textPadding * 1.8}
          dy={'.05em'}
          fontSize={14}
          textAnchor='start'
        >
          {item.data.due_date}
        </Text>
      </g>
    </NextLink>
  );
}

export default BinPackedMilestoneItem;
