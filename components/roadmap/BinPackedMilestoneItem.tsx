import NextLink from 'next/link';
import { useId, useRef } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { Text } from '@visx/text';

import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';
import styles from './Roadmap.module.css';
import { paramsFromUrl } from '../../lib/paramsFromUrl';
import { dayjs } from '../../lib/client/dayjs';
import { SvgGitHubLogoWithTooltip } from '../icons/svgr/SvgGitHubLogoWithTooltip';
import { Box } from '@chakra-ui/react';
import { useViewMode } from '../../hooks/useViewMode';
import { ItemContainerSvg } from './svg/ItemContainerSvg';

const MAX_TITLE_LENGTH = 80;

// D3 milestone item
export default function BinPackedMilestoneItem({
  item,
}: {
  item: ItemContainerSvg;
}) {
  const itemRef = useRef<SVGGElement>(null);
  const uniqId = useId();
  const viewMode = useViewMode();

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
    <NextLink key={uniqId} href={getLinkForRoadmapChild({ issueData: item.data, query: useRouter().query, viewMode })} passHref>
      <g className={`${styles.d3__milestoneItem} ${classNames.join(' ')}`} cursor={'pointer'} ref={itemRef}>
        <rect
          x={item.left}
          y={item.top}
          width={item.width}
          height={item.height}
          className={`${styles['d3__milestoneItem__rect']}`}
        />
        <Text
          className={styles.d3__milestoneItem__title}
          dominantBaseline='text-before-edge'
          x={item.boundaryLeft}
          y={item.boundaryTop - ItemContainerSvg.defaultYPadding*2}
          width={item.contentWidth}
          verticalAnchor='start'
        >
          {truncatedTitle}
        </Text>
        <foreignObject height="5" width={item.contentWidth} x={item.boundaryLeft} y={item.bottom - ItemContainerSvg.defaultYPadding*7}>
          <Box h='100%' w="100%" borderRadius="20px" bgColor="#F1F4F8">
            <Box w={`${item.data.completion_rate}%`} h="100%" borderRadius="20px" bg="#7DE087" />
          </Box>
        </foreignObject>
        <Text
          className={styles.d3__milestoneItem__eta}
          dominantBaseline='text-after-edge'
          x={item.boundaryLeft}
          y={item.boundaryBottom}
        >
          {dayjs(item.data.due_date).format('MMM DD, YYYY')}
        </Text>
        <foreignObject height="18" width="18" x={item.boundaryRight - 18} y={item.boundaryBottom - 18}>
          <SvgGitHubLogoWithTooltip githuburl={item.data.html_url}/>
        </foreignObject>
      </g>
    </NextLink>
  );
}
