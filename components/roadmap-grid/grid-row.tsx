import NextLink from 'next/link';

import { dayjs } from '../../lib/client/dayjs';
import { getClosest } from '../../lib/client/getClosest';
import { IssueData } from '../../lib/types';
import { paramsFromUrl } from '../../utils/general';
import styles from './Roadmap.module.css';

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
  const clickable = milestone.children.length > 0;

  const rowItem = (
    <div
        style={{
          gridColumnStart: `span ${span}`,
          gridColumnEnd: `${closest === span ? closest + 1 : closest}`,
          background: `linear-gradient(90deg, rgba(166, 178, 255, 0.4) ${parseInt(
            milestone.completion_rate.toString(2),
          )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString(2))}%)`,
        }}
        className={`${styles.item} ${styles.issueItem} ${clickable && styles.wrapperLink}`}
      >
        <div className={styles.milestoneTitleWrapper}>{milestone.title}</div>
        <div className={styles.milestoneDate}>{milestone.due_date}</div>
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
