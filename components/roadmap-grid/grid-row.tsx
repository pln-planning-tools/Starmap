import NextLink from 'next/link';
import { Flex, Text, Box, Center } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import type { State } from '@hookstate/core'

import { dayjs } from '../../lib/client/dayjs';
import { IssueData, IssueDataViewInput } from '../../lib/types';
import styles from './Roadmap.module.css';
import { SvgGitHubLogoWithTooltip } from '../icons/svgr/SvgGitHubLogoWithTooltip';
import { globalTimeScaler } from '../../lib/client/TimeScaler';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';
import { useRouter } from 'next/router';
import { useViewMode } from '../../hooks/useViewMode';
import { paramsFromUrl } from '../../lib/paramsFromUrl';

interface GridRowProps extends IssueDataViewInput {
  milestone: State<IssueData>;
  index: number;
  timelineTicks: Date[];
  numGridCols: number;
  numHeaderItems: number;
}

export function GridRow({
  milestone,
  index,
  timelineTicks,
  numGridCols,
  numHeaderItems,
  issueDataState
}: GridRowProps): ReactElement | null {
  const viewMode = useViewMode();
  const routerQuery = useRouter().query;
  const [closestDateIdx, setClosestDateIdx] = useState(Math.round(globalTimeScaler.getColumn(dayjs.utc(milestone.due_date.get()).toDate())));
  useEffect(() => {
    setClosestDateIdx(Math.round(globalTimeScaler.getColumn(dayjs.utc(milestone.due_date.get()).toDate())));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestone.due_date, globalTimeScaler.getDomain()]);
  const span = Math.max(4, numGridCols / timelineTicks.length);
  const closest = span * (closestDateIdx - 1);
  const childLink = useMemo(() => getLinkForRoadmapChild({ viewMode, issueData: milestone.get(), query: routerQuery, currentRoadmapRoot: issueDataState.value }), [issueDataState.value, milestone, routerQuery, viewMode]);
  const clickable = milestone.children.length > 0;

  if (milestone == null || milestone.ornull == null) {
    return null;
  }
  /**
   * Do not render milestone items if their ETAs are invalid.
   */
  if (milestone.root_issue.value !== true) {
    if (!dayjs(milestone.due_date.value).isValid()) {
      return null;
    }

    if (milestone.labels.ornull == null) {
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

  let className = '';
  try {
    const { owner, repo, issue_number } = paramsFromUrl(milestone.html_url.value);
    className = `js-milestoneCard-${owner}-${repo}-${issue_number}`
  } catch {}

  const rowItem = (
    <div
      key={index}
      style={{
        gridColumnStart: `span ${numGridCols / numHeaderItems}`,
        gridColumnEnd: `${closestDateIdx}`,
        background: '#ffffff',
      }}
      className={`${styles.item} ${styles.issueItem} ${clickable && styles.wrapperLink} js-milestoneCard ${clickable && className}`}
    >
      <Flex direction={{ base:"column", md:"column", lg:"column" }} justify="space-between" position="relative" w="100%">
        <Flex direction="column" w="100%">
          <Text as="b" className={`${styles.milestoneTitleWrapper} ${clickable && styles.milestoneTitleWrapperLink}`}>{milestone.title.value}</Text>
          <Flex h='8px' w="100%" borderRadius="20px" bgColor="#F1F4F8">
            <Box w={`${parseInt(milestone.completion_rate.value.toString())}%`} h="100%" borderRadius="20px" bg="#7DE087" />
          </Flex>
        </Flex>
        <Flex flexDirection="row" align="flex-end" justify="space-between" pt={{ base: "8px" }} m={{ base: "0", sm: "8px 0", md: "8px 0", lg: "0" }}>
          <p className={styles.milestoneDate}>{dayjs(milestone.due_date.value).format('DD-MMM-YY')}</p>
          <Center>
            <SvgGitHubLogoWithTooltip githuburl={milestone.html_url.value} />
          </Center>
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
