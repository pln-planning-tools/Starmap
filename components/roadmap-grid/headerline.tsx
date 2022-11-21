import { GridItem } from '@chakra-ui/react';

import styles from './Roadmap.module.css';
import { GroupWrapper } from './group-wrapper';

interface HeaderlineProps {
  numGridCols: number;
  ticksRatio?: number
}
export function Headerline({ numGridCols, ticksRatio = 1 }: HeaderlineProps) {
  const numberOfHeaderItems = 5;
  const headerItems = Array.from({ length: numberOfHeaderItems * ticksRatio }, (_, i) => {
    console.log(`Header tick ${i}: numGridCols(${numGridCols}), numberOfHeaderItems(${numberOfHeaderItems}) = `, numGridCols / numberOfHeaderItems);
    return (
      <div key={i} className={styles.timelineTick} style={{
        gridColumnEnd: `span ${numGridCols / numberOfHeaderItems / ticksRatio}`,
      }}/>
    )
  });

  return (
    <GroupWrapper cssName='timelineHeaderLineWrapper'>
      <GridItem style={{ gridRowStart: '2', gridRowEnd: 'span 1' }} className={styles.timelineHeaderLine} />
      {headerItems}
    </GroupWrapper>
  );
}
