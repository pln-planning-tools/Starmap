import { GridItem } from '@chakra-ui/react';

import styles from './Roadmap.module.css';
import { GroupWrapper } from './group-wrapper';

interface HeaderlineProps {
  numGridCols: number;
  ticksRatio?: number
}
export function Headerline({ numGridCols, ticksRatio = 1 }: HeaderlineProps) {
  const numberOfHeaderItems = 5;
  const firstLabeledTick = 2;
  const headerItems = Array.from({ length: numberOfHeaderItems * ticksRatio + 1 }, (_, i) => {
    const gridColumnEnd = numGridCols / numberOfHeaderItems / ticksRatio

    const isTaller = i === firstLabeledTick || i !== 0 && (i-firstLabeledTick) % ticksRatio === 0 ? true : false

    if (i === 0) {
      return null;
    }

    return (
      <div key={i} className={styles.timelineTick} style={{
        gridColumnEnd: `span ${gridColumnEnd}`,
        height: isTaller ? '20px' : '10px',
        width: isTaller ? '2px' : '1px',
      }}></div>
    )
  });

  return (
    <GroupWrapper cssName='timelineHeaderLineWrapper'>
      <GridItem style={{ gridRowStart: '2', gridRowEnd: 'span 1' }} className={styles.timelineHeaderLine} />
      {headerItems}
    </GroupWrapper>
  );
}
