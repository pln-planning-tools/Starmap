import { Text } from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import NextLink from 'next/link';
import { getViewMode } from '../../hooks/useViewMode';

import { ViewMode } from '../../lib/enums';
import { GroupItemProps } from '../../lib/types';
import styles from './Roadmap.module.css';

/**
 * This is the component for the Group header (themes)
 * @returns {JSX.Element}
 */
export function GroupItem({ group }: GroupItemProps) {
  const viewMode = getViewMode();
  let groupNameElement: JSX.Element | null = null;

  if (viewMode === ViewMode.Detail) {
    if (isEmpty(group.url)) {
      groupNameElement = <Text color="black">{group.groupName}</Text>
    } else {
      groupNameElement = <NextLink href={group.url}>{group.groupName}</NextLink>
    }
  }

  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>{groupNameElement}</div>
    </div>
  );
}
