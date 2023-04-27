import NextLink from 'next/link';
import { useContext, useId, useRef } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { Text } from '@visx/text';

import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';
import { BinPackItem } from './lib';
import { PanContext } from './contexts';
import styles from '../roadmap-grid/Roadmap.module.css';
import { paramsFromUrl } from '../../lib/paramsFromUrl';


// D3 milestone item
function BinPackedMilestoneItem({
  item,
}: {
  item: BinPackItem;
}) {
  const itemRef = useRef<SVGGElement>(null);
  const panX = useContext(PanContext)
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

  const clickable = item.data.children.length > 0;

  let className = '';
  try {
    const { owner, repo, issue_number } = paramsFromUrl(item.data.html_url);
    className = `js-milestoneCard-${owner}-${repo}-${issue_number}`
  } catch {}

  return (
    <NextLink key={uniqId} href={getLinkForRoadmapChild({ issueData: item.data, query: useRouter().query })} passHref>
      {/* <g cursor={'pointer'} ref={itemRef} transform={`translate(${panX}, 0)`}> */}
      <g cursor={'pointer'} ref={itemRef} transform={`translate(${panX}, 0)`} className={`${styles.item} ${styles.issueItem} ${clickable && styles.wrapperLink} js-milestoneCard ${clickable && className}`}>
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
          dy={'-.6em'}
          dx={textPadding}
          width={itemWidth * .80}
          fontSize={18}
          fill={'#4987bd'}
          // strokeWidth={1}
          // textAnchor='end'
          verticalAnchor='start'
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
