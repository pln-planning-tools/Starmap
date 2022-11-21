import { GridItem } from '@chakra-ui/react';

import styles from './Roadmap.module.css';
import { GroupWrapper } from './group-wrapper';

export function Headerline({ numGridCols }) {
  const numberOfHeaderItems = 5;
  const headerItems = Array.from({ length: numberOfHeaderItems }, (_, i) => (
    <div key={i} className={styles.timelineTick} style={{
      gridColumnEnd: `span ${numGridCols / numberOfHeaderItems}`,
    }}/>
  ));

  return (
    <GroupWrapper cssName='timelineHeaderLineWrapper'>
      <GridItem style={{ gridRowStart: '2', gridRowEnd: 'span 1' }} className={styles.timelineHeaderLine} />
      {headerItems}
    </GroupWrapper>
  );
}
