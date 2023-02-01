import NextLink from 'next/link';

import { ScaleTime } from 'd3';
import dayjs from 'dayjs';

import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';
import { IssueData } from '../../lib/types';
import { useMaxHeight, setMaxHeight } from '../../hooks/useMaxHeight';
import { useEffect, useId, useRef } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { useMilestoneBoundingRects, setMilestoneBoundingRects } from '../../hooks/useMilestoneBoundingRects';

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
  useEffect(() => {
    if (boundingRect) {
      const existingRect = allBoundingRects.find((rect) => rect.id === uniqId)
      const newRect = boundingRect as DOMRect & {id: string}
      newRect.id = uniqId
      if (!existingRect) {
        // bounding rect not added yet; add it (it will update the array and trigger a re-render)
        setMilestoneBoundingRects([...allBoundingRects, newRect])
      } else if (JSON.stringify(existingRect) !== JSON.stringify(newRect)) {
        // bounding rect has been added, but is different; update it (it will update the array and trigger a re-render)
        setMilestoneBoundingRects([...allBoundingRects.map((rect) => {
          if (rect.id === uniqId) {
            return newRect
          }
          return rect
        })])
      }
    }
  }, [allBoundingRects, uniqId, boundingRect]);

  const maxSvgHeight = useMaxHeight();
  const y = -20;
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
        <text
          dominantBaseline='text-before-edge'
          x={etaX - calculatedWidth + rectConfig.strokeWidth + textPadding}
          y={yLocation + yPadding}
          dy={'.05em'}
          fontSize={20}
          textAnchor='start'
        >
          {childIssue.title}
        </text>
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
