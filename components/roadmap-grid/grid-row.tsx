import NextLink from 'next/link';

import { Link } from '@chakra-ui/react';

import { dayjs } from '../../lib/client/dayjs';
import { getClosest } from '../../lib/client/getClosest';
import { IssueData } from '../../lib/types';
import { formatDateDayJs, paramsFromUrl } from '../../utils/general';
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
  console.log('milestone.due_date:', milestone.due_date);
  console.log('closest:', closest);
  console.log('timelineTicks:', timelineTicks);
  console.log();

  return (
    <div
      key={index}
      style={{
        gridColumnStart: `span ${span}`,
        gridColumnEnd: `${closest === span ? closest + 1 : closest}`,
        // background: `linear-gradient(to right, #e9c8ff ${Number(milestone.completion_rate.toString()).toFixed(
        //   0,
        // )}%, white ${100 - milestone.completion_rate}%)`,
        background: `linear-gradient(90deg, rgba(166, 255, 168, 0.4) ${parseInt(
          milestone.completion_rate.toString(2),
        )}%, white 0%, white ${100 - parseInt(milestone.completion_rate.toString(2))}%)`,
      }}
      className={`${styles.item} ${styles.issueItem}`}
    >
      <div className={styles.milestoneTitleWrapper}>
        <NextLink
          href={`/roadmap/github.com/${paramsFromUrl(milestone.html_url).owner}/${
            paramsFromUrl(milestone.html_url).repo
          }/issues/${paramsFromUrl(milestone.html_url).issue_number}`}
          passHref
        >
          <Link color='blue.500' className={styles.milestoneTitle}>
            {milestone.title}
          </Link>
        </NextLink>
      </div>
      <div className={styles.milestoneDate}>{milestone.due_date}</div>
      {/* <Progress colorScheme='green' height='26px' value={milestone.completion_rate} /> */}
      {/* <progress value='70' max='100'></progress> */}
      {/* <span className={styles.progress} /> */}
    </div>
  );
}
