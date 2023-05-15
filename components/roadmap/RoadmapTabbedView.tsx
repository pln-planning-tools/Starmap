import {
  Box,
  Center,
  Flex,
  Link,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Spacer
} from '@chakra-ui/react'
import { State, useHookstateMemo } from '@hookstate/core'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState'
import { setViewMode, useViewMode } from '../../hooks/useViewMode'
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup'
import { DEFAULT_INITIAL_VIEW_MODE } from '../../lib/defaults'
import { ViewMode } from '../../lib/enums'
import { IssueData } from '../../lib/types'
import SvgDetailViewIcon from '../icons/svgr/SvgDetailViewIcon'
import SvgListViewIcon from '../icons/svgr/SvgListViewIcon'
import SvgOverviewIcon from '../icons/svgr/SvgOverviewIcon'
import RoadmapList from '../RoadmapList'
import { IssueDataStateContext, IssuesGroupedContext } from './contexts'
import Header from './header'
import NewRoadmap from './NewRoadmap'
import styles from './Roadmap.module.css'
import { TodayMarkerToggle } from './today-marker-toggle'

export function RoadmapTabbedView () {
  const globalLoadingState = useGlobalLoadingState()
  const viewMode = useViewMode() || DEFAULT_INITIAL_VIEW_MODE
  const router = useRouter()
  const issueDataState = useContext(IssueDataStateContext)
  // Defining what tabs to show and in what order
  const tabs = ['Detailed View', 'Overview', 'List'] as const

  // Mapping the views to the tabs
  const tabViewMap: Record<typeof tabs[number], ViewMode> = {
    'Detailed View': ViewMode.Detail,
    Overview: ViewMode.Simple,
    List: ViewMode.List
  }

  // Mapping the tabs to the views
  const tabViewMapInverse: Record<ViewMode, number> = tabs.reduce((acc, tab, index) => {
    acc[tabViewMap[tab]] = index
    return acc
  }, {} as Record<ViewMode, number>)

  const tabIndexFromViewMode = tabViewMapInverse[viewMode]

  const handleTabChange = async (index: number) => {
    setViewMode(tabViewMap[tabs[index]])
    const currentHashString = router.asPath.split('#')[1]
    const currentHashParams = new URLSearchParams(currentHashString)
    currentHashParams.set('view', tabViewMap[tabs[index]])
    try {
      await router.push({
        hash: currentHashParams.toString()
      }, undefined, { shallow: true })
    } catch {
      // catch, but ignore cancelled route errors.
    }
  }

  const renderTab = (title: typeof tabs[number], index: number) => {
    let TabIcon = SvgDetailViewIcon

    if (title === 'Overview') {
      TabIcon = SvgOverviewIcon
    } else if (title === 'List') {
      TabIcon = SvgListViewIcon
    }

    return (
      <Skeleton isLoaded={!globalLoadingState.get()} key={index}>
        <Tab
          className={styles.gridViewTab}
        >
          <Center>
            <TabIcon />
            <Link href={`#view=${tabViewMap[title]}`} className={styles.noDecoration}>{title}</Link>
          </Center>
        </Tab>
      </Skeleton>
    )
  }
  // const ref = useRef<SVGSVGElement>(null);

  const renderTabPanel = (title: typeof tabs[number], index: number) => {
    let component = <NewRoadmap />

    if (title === 'List') {
      component = <RoadmapList />
    }
    return (
      <TabPanel p={0} key={index}>
        {component}
      </TabPanel>
    )
  }

  const query = router.query

  // const groupedIssuesIdPrev = usePrevious('');

  // const groupedIssuesId = getUniqIdForGroupedIssues(issuesGrouped) + viewMode;
  const issuesGrouped = useHookstateMemo(() => {
    if (issueDataState.ornull === null) {
      return []
    }
    const newIssuesGrouped = convertIssueDataStateToDetailedViewGroupOld(issueDataState as State<IssueData>, viewMode, query)
    // const newIssuesGrouped2 = convertIssueDataToDetailedViewGroup(issueDataState.ornull.get({ noproxy: true }) as IssueData)
    // console.log(`newIssuesGrouped2: `, newIssuesGrouped2);
    // console.log(`newIssuesGrouped: `, newIssuesGrouped);
    // if (viewMode === ViewMode.Detail) {
    //   return newIssuesGrouped2
    // }
    return newIssuesGrouped
  }, [viewMode, query, issueDataState])

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header />
        <Flex align="center" justify="space-between" grow={'1'}>
          <Tabs variant='unstyled' onChange={handleTabChange} index={tabIndexFromViewMode} pt='20px' flexGrow={'1'}
            isLazy>
            <Flex direction={'row'} grow={'1'}>
              <TabList display="flex" alignItems="center" justifyContent="space-between">
                {tabs.map(renderTab)}
              </TabList>
              <Spacer />
              <TodayMarkerToggle />
            </Flex>
            <IssuesGroupedContext.Provider value={issuesGrouped}>
              <TabPanels className={styles.tabPanels}>
              {tabs.map(renderTabPanel)}
              </TabPanels>
            </IssuesGroupedContext.Provider>
          </Tabs>
        </Flex>
      </Box>
    </>
  )
}
