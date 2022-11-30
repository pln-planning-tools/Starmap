import NextLink from 'next/link';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import type { State } from '@hookstate/core'

import { dayjs } from '../../lib/client/dayjs';
import { IssueData } from '../../lib/types';
import styles from './Roadmap.module.css';
import { SvgGitHubLogoWithTooltip } from '../icons/svgr/SvgGitHubLogoWithTooltip';
import { TimeScaler } from '../../lib/client/TimeScaler';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { getLinkForRoadmapChild } from '../../lib/client/linkUtils';

export function GridRow({
  milestone,
  index,
  timelineTicks,
  numGridCols,
  numHeaderItems,
  timeScaler
}: {
  milestone: State<IssueData>;
  index: number;
  timelineTicks: Date[];
  numGridCols: number;
  numHeaderItems: number;
  timeScaler: TimeScaler;
}): ReactElement | null {
  const closestDateIdx = Math.round(timeScaler.getColumn(dayjs.utc(milestone.due_date.get()).toDate()));
  const span = Math.max(4, numGridCols / timelineTicks.length);
  const closest = span * (closestDateIdx - 1);

  const childLink = getLinkForRoadmapChild(milestone.get());
  const clickable = milestone.children.length > 0;

  /**
   * Do not render milestone items if their ETAs are invalid.
   */
  if (milestone.root_issue.value !== true) {
    if (!dayjs(milestone.due_date.value).isValid()) {
      return null;
    }

    if (!milestone.labels.get().includes('starmaps')) {
      return null;
    }
  }
  const gridColumnEnd = closest === span ? closest : closest - 1

  if (span > gridColumnEnd) {
    // TODO: Handle this error
    console.error('Span size is greater than gridColumnEnd', milestone.get({ noproxy: true }))
  }
  if (closestDateIdx > numGridCols) {
    /**
     * TODO: Handle this error
     * This error is sometimes happening for milestones that are currently being used as a group item.
     * i.e. we shouldn't be attempting to render those at all.
     */
    console.error('closestDateIdx is greater than numGridCols', milestone.get({ noproxy: true }))
  }

  const rowItem = (
    <div
      key={index}
      style={{
        gridColumnStart: `span ${numGridCols / numHeaderItems}`,
        gridColumnEnd: `${closestDateIdx}`,
        background: `linear-gradient(90deg, rgba(125, 224, 135, 0.6) ${parseInt(
          milestone.completion_rate.toString(),
        )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString())}%)`,
      }}
      className={`${styles.item} ${styles.issueItem} ${clickable && styles.wrapperLink}`}

    >
      <Flex direction={{ base:"column", md:"column", lg:"row" }} justify="space-between" position="relative">
        <Flex direction="column" maxW={{ base: "100%", sm: "100%", md:"100%", lg:"85%" }}>
          <Text as="b" className={styles.milestoneTitleWrapper}>{milestone.title.value}</Text>
          <p className={styles.milestoneDate}>{milestone.due_date.value}</p>
        </Flex>
        <Flex m={{ base: "0", sm: "8px 0", md: "8px 0", lg: "0" }}>
          <SvgGitHubLogoWithTooltip githuburl={milestone.html_url}/>
        </Flex>

      </Flex>
    </div>
  );

  if (clickable) {
    return (
      <NextLink key={index} href={childLink} passHref>
        {rowItem}
      </NextLink>
    );
  }

  return rowItem;
}
