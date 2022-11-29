import { Text } from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import NextLink from 'next/link';
import React from 'react';
import { useViewMode } from '../../hooks/useViewMode';

import { ViewMode } from '../../lib/enums';
import { GroupHeaderProps } from '../../lib/types';
import styles from './Roadmap.module.css';

/**
 * This is the component for the Group header (themes)
 * @returns {JSX.Element}
 */
export function GroupHeader({ group }: GroupHeaderProps) {
  const viewMode = useViewMode();
  let groupNameElement: JSX.Element | null = null;

  if (viewMode === ViewMode.Detail) {
    if (isEmpty(group.url)) {
      groupNameElement = <Text color="black">{group.groupName.value}</Text>
    } else {
      groupNameElement = <NextLink href={group.url.value}>{group.groupName.value}</NextLink>
    }
  }

  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>{groupNameElement}</div>
    </div>
  );
}
