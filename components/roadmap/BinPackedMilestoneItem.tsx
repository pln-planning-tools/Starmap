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
import { Box, Flex } from '@chakra-ui/react';

const MAX_TITLE_LENGTH = 80;

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

  const boundaryLeft = item.left + rectConfig.strokeWidth + textPadding;
  const boundaryRight = item.right - rectConfig.strokeWidth - textPadding;
  const boundaryTop = item.top + rectConfig.strokeWidth + yPadding;
  const boundaryBottom = item.bottom - rectConfig.strokeWidth - yPadding;

  const itemHeight = item.bottom - item.top
  const itemWidth = item.right - item.left
  const contentWidth = boundaryRight - boundaryLeft

  const classNames = [
    'js-milestoneCard',
  ];

  if (item.data.children.length > 0) {
    classNames.push(styles['d3__milestoneItem-clickable']);
  };

  try {
    const { owner, repo, issue_number } = paramsFromUrl(item.data.html_url);
    classNames.push(`js-milestoneCard-${owner}-${repo}-${issue_number}`);
  } catch {}

  const truncatedTitle = item.data.title.length > MAX_TITLE_LENGTH ? `${item.data.title.slice(0, MAX_TITLE_LENGTH-3)}...` : item.data.title;

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
          x={boundaryLeft}
          y={boundaryTop - textPadding}
          width={contentWidth}
          verticalAnchor='start'
        >
          {truncatedTitle}
        </Text>
        <foreignObject height="6" width={contentWidth} x={boundaryLeft} y={item.bottom - textPadding*3.5}>
          {/** @ts-expect-error - JSX error with xmnls */}
          <body xmnls="http://www.w3.org/1999/xhtml">
          <Box h='100%' w="100%" borderRadius="20px" bgColor="#F1F4F8">
            <Box w={`${item.data.completion_rate}%`} h="100%" borderRadius="20px" bg="#7DE087" />
          </Box>
          </body>
        </foreignObject>
        <Text
          className={styles.d3__milestoneItem__eta}
          dominantBaseline='text-after-edge'
          x={boundaryLeft}
          y={boundaryBottom}
        >
          {dayjs(item.data.due_date).format('DD-MMM-YY')}
        </Text>
        <foreignObject height="18" width="18" x={boundaryRight - 18} y={boundaryBottom - 18}>
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
