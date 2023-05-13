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
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import SvgDetailViewIcon from '../icons/svgr/SvgDetailViewIcon'
import SvgOverviewIcon from '../icons/svgr/SvgOverviewIcon'

import { TodayMarkerToggle } from './today-marker-toggle'
import { setViewMode, useViewMode } from '../../hooks/useViewMode'
import { DEFAULT_INITIAL_VIEW_MODE } from '../../lib/defaults'
import { RoadmapMode, ViewMode } from '../../lib/enums'
import Header from './header'
import styles from './Roadmap.module.css'
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState'
import SvgListViewIcon from '../icons/svgr/SvgListViewIcon'
import RoadmapList from '../RoadmapList'
import NewRoadmap from './NewRoadmap'
import { State, useHookstateMemo } from '@hookstate/core'
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup'
import { IssueDataStateContext, IssuesGroupedContext } from './contexts'
import { IssueData } from '../../lib/types'

export function RoadmapTabbedView ({
  mode
}: {mode: RoadmapMode}) {
  console.log('mode: ', mode)
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

  const handleTabChange = (index: number) => {
    setViewMode(tabViewMap[tabs[index]])
    const currentHashString = router.asPath.split('#')[1]
    const currentHashParams = new URLSearchParams(currentHashString)
    currentHashParams.set('view', tabViewMap[tabs[index]])
    router.push({
      hash: currentHashParams.toString()
    }, undefined, { shallow: true })
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
            <Link href={'#' + tabViewMap[title]} className={styles.noDecoration}>{title}</Link>
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
