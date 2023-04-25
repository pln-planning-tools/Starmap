import NextLink from 'next/link';

import { ScaleTime } from 'd3';
import dayjs from 'dayjs';

import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';
import { IssueData } from '../../lib/types';
import { useMaxHeight, setMaxHeight } from '../../hooks/useMaxHeight';
import { useEffect, useId, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { useMilestoneBoundingRects, setMilestoneBoundingRects } from '../../hooks/useMilestoneBoundingRects';
import { Text } from '@visx/text';

interface MilestoneRect extends DOMRect {
  id: string
  title: string
}

function isIntersect(rect1: MilestoneRect, rect2: MilestoneRect) {
  // if (rect1.top < rect2.top) {
  //   return false // don't intersect if rect1 is above rect2
  // }
  return rect1.top <= rect2.bottom && rect1.bottom >= rect2.top && rect1.left <= rect2.right && rect1.right >= rect2.left
}

function sortRectsByTop(rect1: MilestoneRect, rect2: MilestoneRect) {
  return rect1.top - rect2.top
}

/**
 * Given a list of rects, return the top-most yLocation within the x1 and x2 range
 * @param param0
 * @returns
 */
function getYLocation (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
  const rects = boundingRects.filter((rect) => isIntersect(rect, givenRect)).sort(sortRectsByTop)
  const yLocation = rects.length > 0 ? rects[0].top : givenRect.top
  return yLocation
}

// return all rects within given x range (all returned rects are in the same, or a colliding, column)
function getIntersectingRectsColumn (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
  return boundingRects.filter((rect) => givenRect.left <= rect.right && givenRect.right >= rect.left)
}

// return all rects within a given y range (all returned rects are in the same, or a colliding, row)
function getIntersectingRectsRow (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
  return boundingRects.filter((rect) => givenRect.top <= rect.bottom && givenRect.bottom >= rect.top)
}

// return whether there is space within a given row (y1-y2) for a given rect (x1-x2)
// function isSpaceInRow (boundingRects: MilestoneRect[], givenRect: MilestoneRect) {
//   const rects = getIntersectingRectsColumn(boundingRects, givenRect)
// }

// D3 milestone item
function RoadmapItem({
  childIssue,
  scale,
  index,
}: {
  childIssue: IssueData;
  scale: ScaleTime<number, number>;
  index: number;
}) {
  const itemRef = useRef<SVGGElement>(null);
  const allBoundingRects = useMilestoneBoundingRects();
  const uniqId = useId();
  // console.log(`allBoundingRects: `, allBoundingRects);
  // console.log(`itemRef.current: `, itemRef.current);
  // console.log(`itemRef.current?.getBoundingClientRect?.(): `, itemRef.current?.getBoundingClientRect?.());
  const boundingRect = itemRef.current?.getBoundingClientRect()
  console.log(`boundingRect: `, boundingRect);
  useEffect(() => {
    // const boundingRect = itemRef.current?.getBoundingClientRect()
    if (boundingRect) {
      const existingRect = allBoundingRects.find((rect) => rect.id === uniqId)
      console.log(`existingRect: `, existingRect);
      const newRect = boundingRect as MilestoneRect
      newRect.id = uniqId
      newRect.title = childIssue.title
      if (!existingRect) {
        // bounding rect not added yet; add it (it will update the array and trigger a re-render)
        setMilestoneBoundingRects([...allBoundingRects, newRect])
        // getIntersectingRectsRow(allBoundingRects, newRect)
        console.log(`${childIssue.title} getIntersectingRectsRow(allBoundingRects, newRect): `, getIntersectingRectsRow(allBoundingRects, newRect));
      } else if (JSON.stringify(existingRect) !== JSON.stringify(newRect)) {
        // bounding rect has been added, but is different; update it (it will update the array and trigger a re-render)
        // setMilestoneBoundingRects([...allBoundingRects.map((rect) => {
        //   if (rect.id === uniqId) {
        //     return newRect
        //   }
        //   return rect
        // })])
      }
    }
  }, [allBoundingRects, uniqId, childIssue.title, boundingRect]);

  const maxSvgHeight = useMaxHeight();
  const y = 0;
  const yPadding = 5;
  const etaX = scale(dayjs(childIssue.due_date).toDate());
  const ySpacingBetweenItems = 10;
  const rectConfig = {
    width: 300,
    height: 80,
    strokeWidth: 2,
  };
  const minimumY = 60;
  // TODO: sgtpooki: increase distance of first item from top axis
  const yLocation = useMemo(() => {
    // let yLocation = Math.max(y + yPadding + ((rectConfig.height + ySpacingBetweenItems) * index + 1), minimumY);
    let yLocation = minimumY
    // useEffect(() => {

    if (boundingRect) {
      console.log(`intersection getYLocation: `, getYLocation(allBoundingRects, boundingRect as MilestoneRect));
      const rects = allBoundingRects.sort(sortRectsByTop)
      let collision = false
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i]
        if (rect.title === childIssue.title) {
          continue
        }
        if (isIntersect(boundingRect as MilestoneRect, rect)) {
          console.log(`${childIssue.title} intersecting with: ${rect.title}`, rect);
          console.log(`intersecting yLocation before ${childIssue.title}: `, yLocation);
          yLocation = rect.bottom+ySpacingBetweenItems
          console.log(`intersecting yLocation after ${childIssue.title}: `, yLocation);
          collision = true
          break;
        } else {
          // console.log(`not intersecting with: `, rect);
        }
      }

      if (!collision) {
        // yLocation = Math.max(minimumY, yLocation - rectConfig.height)
        yLocation = minimumY
      }
    }
    return yLocation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBoundingRects, boundingRect?.top, boundingRect, childIssue.title, index, rectConfig.height])
  // }, [allBoundingRects, boundingRect, childIssue.title, rectConfig.height, yLocation])
  // const yLocation = Math.max(y + yPadding + ((rectConfig.height + ySpacingBetweenItems)), minimumY);
  const textPadding = 10;
  const rxSize = 10;

  // const randomIntFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  useEffect(() => {
    const mH = Math.max(rectConfig.height + yLocation + 50, maxSvgHeight)
    setMaxHeight(mH)
  }, [maxSvgHeight, rectConfig.height, yLocation])

  const calculatedWidth = Math.max(rectConfig.width, boundingRect?.width || rectConfig.width)

  // TODO: Add on hover to show clickability
  // console.log(`etaX: `, etaX);
  // console.log(`calculatedWidth: `, calculatedWidth);
  return (
    <NextLink key={`roadmapItem-${index}`} href={getLinkForRoadmapChild({ issueData: childIssue, query: useRouter().query })} passHref>
      <g cursor={'pointer'} ref={itemRef}>
        <rect
          x={etaX - calculatedWidth}
          y={yLocation}
          width={calculatedWidth}
          height={rectConfig.height}
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
          x={etaX - calculatedWidth + rectConfig.strokeWidth + textPadding}
          y={yLocation}
          // dy={'.05em'}
          width={rectConfig.width - rectConfig.strokeWidth - textPadding * 2}
          fontSize={20}
          // textAnchor='end'
          verticalAnchor='middle'
        >
          {childIssue.title}
        </Text>
        {/* <text dominantBaseline="text-before-edge" x={etaX-calculatedWidth+rectConfig.strokeWidth+textPadding} y={yLocation+yPadding*6} dy={'.05em'} fontSize={16} textAnchor="start">state: {childIssue.state}</text> */}

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
