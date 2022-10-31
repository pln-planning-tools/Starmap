import { Text } from '@chakra-ui/react';

import styles from './Roadmap.module.css';

export function GroupItem({ showGroupRowTitle, issueData, group }) {
  let detailedViewClass = 'detailedView';
  if (!showGroupRowTitle) {
    detailedViewClass = '';
  }
  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>{!!showGroupRowTitle && <Text>{group.groupName}</Text>}</div>
    </div>
  );
}
