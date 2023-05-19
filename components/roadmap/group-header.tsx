import { Text } from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useContext } from 'react'

import { useViewMode } from '../../hooks/useViewMode'
import { getLinkForRoadmapChild } from '../../lib/client/getLinkForRoadmapChild'
import { ViewMode } from '../../lib/enums'
import { BinPackedGroup } from '../../lib/types'
import { IssueDataStateContext } from './contexts'
import styles from './Roadmap.module.css'

export function BinPackedGroupHeader ({ group }: {group: BinPackedGroup }) {
  const issueDataState = useContext(IssueDataStateContext)
  const viewMode = useViewMode()
  const router = useRouter()
  let groupNameElement: ReactElement | null = null
  const issueData = {
    html_url: group.url.replace('/roadmap/', ''),
    children: group.items
  }
  if (issueDataState.ornull === null) {
    return null
  }
  if (viewMode === ViewMode.Detail) {
    if (isEmpty(group.url)) {
      groupNameElement = <Text color="black">{group.groupName}</Text>
    } else {
      const groupHeaderLink = getLinkForRoadmapChild({
        issueData: issueData as unknown as Parameters<typeof getLinkForRoadmapChild>[0]['issueData'],
        currentRoadmapRoot: issueDataState.ornull.value,
        viewMode,
        query: router.query,
        replaceOrigin: false
      })
      groupNameElement = <NextLink href={groupHeaderLink}>{group.groupName}</NextLink>
    }
  }

  return (
    <div className={`${styles.item} ${styles.group} ${styles.d3__groupTitle}`}>
      <div>{groupNameElement}</div>
    </div>
  )
}
