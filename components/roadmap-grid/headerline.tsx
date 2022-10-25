import { GridItem } from '@chakra-ui/react';

import styles from './Roadmap.module.css';
import { GroupWrapper } from './group-wrapper';

export function Headerline() {
  return (
    <GroupWrapper cssName='timelineHeaderLineWrapper'>
      <GridItem style={{ gridRow: '2/span 1' }} className={styles.timelineHeaderLine} />
      {/* <div></div> */}
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
    </GroupWrapper>
  );
}
