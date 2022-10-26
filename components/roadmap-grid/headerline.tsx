import { GridItem } from '@chakra-ui/react';

import styles from './Roadmap.module.css';
import { GroupWrapper } from './group-wrapper';

export function Headerline() {
  return (
    <GroupWrapper cssName='timelineHeaderLineWrapper'>
      <GridItem style={{ gridRowStart: '2', gridRowEnd: 'span 1' }} className={styles.timelineHeaderLine} />
      {/* <div></div> */}
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
      <div className={styles.timelineTick}></div>
    </GroupWrapper>
  );
}
