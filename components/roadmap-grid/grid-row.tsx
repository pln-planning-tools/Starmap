import NextLink from 'next/link';
import { Flex, Text } from '@chakra-ui/react';
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

    if (milestone.labels.ornull == null || !milestone.labels.ornull.value.includes('starmaps')) {
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
        background: `linear-gradient(90deg, rgba(125, 224, 135, 0.6) ${parseInt(
          milestone.completion_rate.toString(),
        )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString())}%)`,
      }}
      className={`${styles.item} ${styles.issueItem} ${clickable && styles.wrapperLink} js-milestoneCard ${clickable && className}`}

    >
      <Flex direction={{ base:"column", md:"column", lg:"row" }} justify="space-between" position="relative">
        <Flex direction="column" maxW={{ base: "100%", sm: "100%", md:"100%", lg:"85%" }}>
          <Text as="b" className={styles.milestoneTitleWrapper}>{milestone.title.value}</Text>
          <p className={styles.milestoneDate}>{milestone.due_date.value}</p>
        </Flex>
        <Flex m={{ base: "0", sm: "8px 0", md: "8px 0", lg: "0" }}>
          <SvgGitHubLogoWithTooltip githuburl={milestone.html_url.value}/>
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
