import NextLink from 'next/link';

import { Link } from '@chakra-ui/react';

import { dayjs } from '../../lib/client/dayjs';
import { getClosest } from '../../lib/client/getClosest';
import { IssueData } from '../../lib/types';
import { paramsFromUrl } from '../../utils/general';
import styles from './Roadmap.module.css';

type MilestoneUrlParams = {
  owner: string;
  repo: string;
  issue_number: number;
};

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
  const urlParams = paramsFromUrl(milestone.html_url);
  const { owner, repo, issue_number } = urlParams as MilestoneUrlParams;
  const allParamsValid = !!owner && !!repo && !!issue_number;

  return (
    <div
      key={index}
      style={{
        gridColumnStart: `span ${span}`,
        gridColumnEnd: `${closest === span ? closest + 1 : closest}`,
        background: `linear-gradient(90deg, rgba(166, 178, 255, 0.4) ${parseInt(
          milestone.completion_rate.toString(2),
        )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString(2))}%)`,
      }}
      className={`${styles.item} ${styles.issueItem}`}
    >
      <div className={styles.milestoneTitleWrapper}>
        {(!allParamsValid && milestone.title) || (
          <NextLink href={`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}`} passHref>
            <Link color='blue.500' className={styles.milestoneTitle}>
              {milestone.title}
            </Link>
          </NextLink>
        )}
      </div>
      <div className={styles.milestoneDate}>{milestone.due_date}</div>
    </div>
  );
}
