import NextLink from 'next/link';
import { Flex, Spacer, Text } from '@chakra-ui/react';

import { dayjs } from '../../lib/client/dayjs';
import { getClosest } from '../../lib/client/getClosest';
import { IssueData } from '../../lib/types';
import { getInternalLinkForIssue } from '../../utils/general';
import styles from './Roadmap.module.css';
import { SvgGitHubLogoWithTooltip } from '../icons/svgr/SvgGitHubLogoWithTooltip';
import getDateAsQuarter from '../../lib/client/getDateAsQuarter';

export function GridRow({
  milestone,
  index,
  timelineTicks,
}: {
  milestone: IssueData;
  index: number;
  timelineTicks: Date[];
}) {
  const closestDateIdx = getClosest({
    currentDate: dayjs.utc(milestone.due_date).endOf('quarter').toDate(),
    dates: timelineTicks,
    totalTimelineTicks: timelineTicks.length,
  });
  const span = 4;
  const closest = span * (closestDateIdx - 1);

  const childLink = getInternalLinkForIssue(milestone);
  const clickable = milestone.children.length > 0;

  const rowItem = (
    <div
      key={index}
      style={{
        gridColumnStart: `span ${span}`,
        gridColumnEnd: `${closest === span ? closest : closest - 1}`,
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
