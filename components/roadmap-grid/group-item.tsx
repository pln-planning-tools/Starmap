import { Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { GroupItemProps } from '../../lib/types';
import styles from './Roadmap.module.css';



/**
 * This is the component for the Group header (themes)
 * @returns {JSX.Element}
 */
export function GroupItem({ showGroupRowTitle, issueData, group }: GroupItemProps) {
  console.log(`issueData: `, issueData);
  console.log(`group: `, group);
  let detailedViewClass = 'detailedView';
  if (!showGroupRowTitle) {
    detailedViewClass = '';
  }
  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>{!!showGroupRowTitle && <NextLink href={group.url}>{group.groupName}</NextLink>}</div>
    </div>
  );
}
