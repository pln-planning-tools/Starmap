import NextLink from 'next/link';
import { Tooltip, Flex, Spacer, Text } from '@chakra-ui/react';

import { dayjs } from '../../lib/client/dayjs';
import { getClosest } from '../../lib/client/getClosest';
import { IssueData } from '../../lib/types';
import { paramsFromUrl } from '../../utils/general';
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
  const closest = getClosest({
    currentDate: dayjs.utc(milestone.due_date).toDate(),
    dates: timelineTicks,
    totalTimelineTicks: timelineTicks.length,
  });
  const span = 4;

  const urlParams = paramsFromUrl(milestone.html_url)
  const childLink = `/roadmap/github.com/${urlParams.owner}/${urlParams.repo}/issues/${urlParams.issue_number}`

  return (
    <NextLink key={index} href={childLink} passHref>
      <div
        style={{
          gridColumnStart: `span ${span}`,
          gridColumnEnd: `${closest === span ? closest + 1 : closest}`,
          background: `linear-gradient(90deg, rgba(166, 178, 255, 0.4) ${parseInt(
            milestone.completion_rate.toString(2),
          )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString(2))}%)`,
        }}
        className={`${styles.item} ${styles.issueItem} ${styles.wrapperLink}`}
      >
        <Flex direction="row" position="relative">
          <Tooltip hasArrow label='Open in StarMaps'>
            <Flex direction="column">
              <Text as="b" className={styles.milestoneTitleWrapper}>{milestone.title}</Text>
              <div className={styles.milestoneDate}>{getDateAsQuarter(milestone.due_date)}</div>
            </Flex>
          </Tooltip>
          <Spacer />
          <SvgGitHubLogoWithTooltip githubUrl={milestone.html_url}/>
          {/* <Tooltip label="Hey, I'm here!" aria-label='A tooltip'>
            <SvgGitHubLogo alt="GitHub Logo" color={themes.light.text.color} width='24px' height='24px' />
          </Tooltip> */}
        </Flex>
      </div>
    </NextLink>
  );
}
