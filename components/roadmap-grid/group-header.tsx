import { Text } from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useViewMode } from '../../hooks/useViewMode';
import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild';

import { ViewMode } from '../../lib/enums';
import { BinPackedGroup, GroupHeaderProps } from '../../lib/types';
import { IssueDataStateContext } from '../roadmap/contexts';
import styles from './Roadmap.module.css';

/**
 * This is the component for the Group header (themes)
 * @returns {JSX.Element}
 */
export function GroupHeader({ group, issueDataState }: GroupHeaderProps) {
  const viewMode = useViewMode();
  const router = useRouter();
  let groupNameElement: JSX.Element | null = null;
  const issueData: Parameters<typeof getLinkForRoadmapChild>[0]['issueData'] = {
    html_url: group.url.value.replace('/roadmap/', ''),
    children: group.items.value,
  };
  if (viewMode === ViewMode.Detail) {
    if (isEmpty(group.url)) {
      groupNameElement = <Text color="black">{group.groupName.value}</Text>
    } else {
      const groupHeaderLink = getLinkForRoadmapChild({
        issueData: issueData,
        currentRoadmapRoot: issueDataState.value,
        viewMode,
        query: router.query,
        replaceOrigin: false,
      });
      groupNameElement = <NextLink href={groupHeaderLink}>{group.groupName.value}</NextLink>
    }
  }

  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>{groupNameElement}</div>
    </div>
  );
}


export function BinPackedGroupHeader({ group }: {group: BinPackedGroup }) {
  const issueDataState = useContext(IssueDataStateContext)
  const viewMode = useViewMode();
  const router = useRouter();
  let groupNameElement: JSX.Element | null = null;
  const issueData: Parameters<typeof getLinkForRoadmapChild>[0]['issueData'] = {
    html_url: group.url.replace('/roadmap/', ''),
    children: group.items,
  };
  if (issueDataState.ornull === null) {
    return null;
  }
  if (viewMode === ViewMode.Detail) {
    if (isEmpty(group.url)) {
      groupNameElement = <Text color="black">{group.groupName}</Text>
    } else {
      const groupHeaderLink = getLinkForRoadmapChild({
        issueData: issueData,
        currentRoadmapRoot: issueDataState.ornull.value,
        viewMode,
        query: router.query,
        replaceOrigin: false,
      });
      groupNameElement = <NextLink href={groupHeaderLink}>{group.groupName}</NextLink>
    }
  }

  return (
    <div className={`${styles.item} ${styles.group} ${styles.d3__groupTitle}`}>
      <div>{groupNameElement}</div>
    </div>
  );
}
