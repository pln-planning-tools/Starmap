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
import { dayjs } from '../../lib/client/dayjs';
import { SvgGitHubLogoWithTooltip } from '../icons/svgr/SvgGitHubLogoWithTooltip';

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

  const itemHeight = item.bottom - item.top
  const itemWidth = item.right - item.left

  const classNames = [
    'js-milestoneCard',
  ];

  if (item.data.children.length > 0) {
    classNames.push(styles['d3__milestoneItem-clickable']);
    console.log(`clickable: `, item.data.children.length);
  };

  try {
    const { owner, repo, issue_number } = paramsFromUrl(item.data.html_url);
    classNames.push(`js-milestoneCard-${owner}-${repo}-${issue_number}`);
  } catch {}

  return (
    <NextLink key={uniqId} href={getLinkForRoadmapChild({ issueData: item.data, query: useRouter().query })} passHref>
      <g className={`${styles.d3__milestoneItem} ${classNames.join(' ')}`} cursor={'pointer'} ref={itemRef} transform={`translate(${panX}, 0)`}>
        <rect
          x={item.left}
          y={item.top}
          width={itemWidth}
          height={itemHeight}
          className={`${styles['d3__milestoneItem__rect']}`}
        />
        <Text
          className={styles.d3__milestoneItem__title}
          dominantBaseline='text-before-edge'
          x={item.left - rectConfig.strokeWidth*2}
          y={item.top}
          dy={'-.6em'}
          dx={textPadding}
          width={itemWidth * .80}
          verticalAnchor='start'
        >
          {item.data.title}
        </Text>
        <Text
          className={styles.d3__milestoneItem__eta}
          dominantBaseline='text-before-edge'
          x={item.left - rectConfig.strokeWidth*2 + textPadding}
          y={item.bottom - yPadding - textPadding * 1.8}
          dy={'.05em'}
          fontSize={14}
          textAnchor='start'
        >
          {dayjs(item.data.due_date).format('DD-MMM-YY')}
        </Text>
        <foreignObject height="18" width="18" x={item.right - 18 - textPadding/2} y={item.bottom - 18 - textPadding/2}>
          {/** @ts-expect-error - JSX error with xmnls */}
          <body xmnls="http://www.w3.org/1999/xhtml">
            <SvgGitHubLogoWithTooltip githuburl={item.data.html_url}/>
          </body>
        </foreignObject>
      </g>
    </NextLink>
  );
}

export default BinPackedMilestoneItem;
