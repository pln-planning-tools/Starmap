import NextLink from 'next/link';

import { Link } from '@chakra-ui/react';

import { getClosest } from '../../lib/client/dateUtils';
import { IssueData } from '../../lib/types';
import { paramsFromUrl, slugsFromUrl } from '../../utils/general';
import styles from './Roadmap.module.css';

export function GridRow({
  milestone,
  index,
  timelineQuantiles,
}: {
  milestone: IssueData;
  index: number;
  timelineQuantiles: Date[];
}) {
  // console.log('milestone:', milestone);
  return (
    <div
      key={index}
      style={{
        gridColumn: `${getClosest(milestone.due_date, timelineQuantiles)} / span 1`,
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
