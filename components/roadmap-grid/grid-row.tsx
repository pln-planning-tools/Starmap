import NextLink from 'next/link';
import { Flex, Spacer, Text } from '@chakra-ui/react';

import { dayjs } from '../../lib/client/dayjs';
import { getClosest } from '../../lib/client/getClosest';
import { IssueData } from '../../lib/types';
import { getInternalLinkForIssue } from '../../lib/general';
import styles from './Roadmap.module.css';
import { SvgGitHubLogoWithTooltip } from '../icons/svgr/SvgGitHubLogoWithTooltip';

export function GridRow({
  milestone,
  index,
  timelineTicks,
  numGridCols,
  numHeaderItems,
}: {
  milestone: IssueData;
  index: number;
  timelineTicks: Date[];
  numGridCols: number;
  numHeaderItems: number;
}) {
  const closestDateIdx = getClosest({
    currentDate: dayjs.utc(milestone.due_date).toDate(),
    dates: timelineTicks,
    totalTimelineTicks: numGridCols,
  });
  const span = Math.max(4, numGridCols / timelineTicks.length);
  const closest = span * (closestDateIdx - 1);

  const childLink = getInternalLinkForIssue(milestone);
  const clickable = milestone.children.length > 0;

  /**
   * Do not render milestone items if their ETAs are invalid.
   */
  if (milestone.root_issue !== true) {
    if (!dayjs(milestone.due_date).isValid()) {
      return null;
    }

    if (!milestone.labels.includes('starmaps')) {
      return null;
    }
  }
  const gridColumnEnd = closest === span ? closest : closest - 1

  if (span > gridColumnEnd) {
    // TODO: Handle this error
    console.error('Span size is greater than gridColumnEnd', milestone)
  }
  if (closestDateIdx > numGridCols) {
    // TODO: Handle this error
    console.error('closestDateIdx is greater than numGridCols', milestone)
  }

  const rowItem = (
    <div
      key={index}
      style={{
        gridColumnStart: `span ${numGridCols / numHeaderItems}`,
        gridColumnEnd: `${closestDateIdx}`,
        background: `linear-gradient(90deg, rgba(125, 224, 135, 0.6) ${parseInt(
          milestone.completion_rate.toString(2),
        )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString(2))}%)`,
      }}
      className={`${styles.item} ${styles.issueItem} ${clickable && styles.wrapperLink}`}

    >
      <Flex direction="row" position="relative">
        <Flex direction="column">
          <Text as="b" className={styles.milestoneTitleWrapper}>{milestone.title}</Text>
          <div className={styles.milestoneDate}>{milestone.due_date}</div>
        </Flex>
        <Spacer />
        <SvgGitHubLogoWithTooltip githuburl={milestone.html_url}/>
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
