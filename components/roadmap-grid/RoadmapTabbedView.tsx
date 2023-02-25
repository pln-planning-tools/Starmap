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
  Spacer,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import SvgDetailViewIcon from '../icons/svgr/SvgDetailViewIcon';
import SvgOverviewIcon from '../icons/svgr/SvgOverviewIcon';

import { TodayMarkerToggle } from './today-marker-toggle';
import { setViewMode, useViewMode } from '../../hooks/useViewMode';
import { DEFAULT_INITIAL_VIEW_MODE } from '../../lib/defaults';
import { ViewMode } from '../../lib/enums';
import { IssueDataViewInput } from '../../lib/types';
import Header from './header';
import styles from './Roadmap.module.css';
import { RoadmapDetailed } from './RoadmapDetailedView';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import SvgListViewIcon from '../icons/svgr/SvgListViewIcon';
import RoadmapList from '../RoadmapList';

export function RoadmapTabbedView({
  issueDataState,
}: IssueDataViewInput): ReactElement {
  const globalLoadingState = useGlobalLoadingState();
  const viewMode = useViewMode() || DEFAULT_INITIAL_VIEW_MODE;
  const router = useRouter();

  // Defining what tabs to show and in what order
  const tabs = ['Detailed View', 'Overview', 'List'] as const;

  // Mapping the views to the tabs
  const tabViewMap: Record<typeof tabs[number], ViewMode> = {
    'Detailed View': ViewMode.Detail,
    'Overview': ViewMode.Simple,
    'List': ViewMode.List,
  };

  // Mapping the tabs to the views
  const tabViewMapInverse: Record<ViewMode, number> = tabs.reduce((acc, tab, index) => {
    acc[tabViewMap[tab]] = index;
    return acc;
  }, {} as Record<ViewMode, number>);

  const tabIndexFromViewMode = tabViewMapInverse[viewMode]

  const handleTabChange = (index: number) => {
    setViewMode(tabViewMap[tabs[index]]);
    router.push({
      hash: tabViewMap[tabs[index]],
    }, undefined, { shallow: true });
  }

  const renderTab = (title: typeof tabs[number], index: number) => {
    let TabIcon = SvgDetailViewIcon

    if (title == "Overview") {
      TabIcon = SvgOverviewIcon
    } else if (title == "List") {
      TabIcon = SvgListViewIcon
    }

    return (
      <Skeleton isLoaded={!globalLoadingState.get()}>
        <Tab
          className={styles.gridViewTab}
          key={index}
        >
          <Center>
            <TabIcon />
            <Link href={'#' + tabViewMap[title]} className={styles.noDecoration}>{title}</Link>
          </Center>
        </Tab>
      </Skeleton>
    )
  };

  const renderTabPanel = (title: typeof tabs[number], index: number) => {
    let component = <RoadmapDetailed issueDataState={issueDataState} />
    if (title === 'List') {
      component = <RoadmapList issueDataState={issueDataState} />
    }
    return (
      <TabPanel p={0} key={index}>
        {component}
      </TabPanel>
    )
  };

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header issueDataState={issueDataState} />
        <Flex align="center" justify="space-between" grow={"1"}>
          <Tabs variant='unstyled' onChange={handleTabChange} index={tabIndexFromViewMode} pt='20px' flexGrow={"1"}
            isLazy>
            <Flex direction={'row'} grow={"1"}>
              <TabList display="flex" alignItems="center" justifyContent="space-between">
                {tabs.map(renderTab)}
              </TabList>
              <Spacer />
              <TodayMarkerToggle />
            </Flex>
            <TabPanels>
              {tabs.map(renderTabPanel)}
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </>
  );
}
