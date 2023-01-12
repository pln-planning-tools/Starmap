import {
  Box,
  Link,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Center
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import SvgDetailViewIcon from '../icons/svgr/SvgDetailViewIcon';
import SvgOverviewIcon from '../icons/svgr/SvgOverviewIcon';

import { setViewMode, useViewMode } from '../../hooks/useViewMode';
import { DEFAULT_INITIAL_VIEW_MODE } from '../../lib/defaults';
import { ViewMode } from '../../lib/enums';
import { IssueDataViewInput } from '../../lib/types';
import Header from './header';
import styles from './Roadmap.module.css';
import { RoadmapDetailed } from './RoadmapDetailedView';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';

export function RoadmapTabbedView({
  issueDataState,
}: IssueDataViewInput): ReactElement {
  const globalLoadingState = useGlobalLoadingState();
  const viewMode = useViewMode() || DEFAULT_INITIAL_VIEW_MODE;
  const router = useRouter();
  if (issueDataState.children.length === 0 || globalLoadingState.get()) {
    return (<Spinner size="lg" />);
  }
  // Defining what tabs to show and in what order
  const tabs = ['Detailed View','Overview'] as const;

  // Mapping the views to the tabs
  const tabViewMap: Record<typeof tabs[number], ViewMode> = {
    'Detailed View': ViewMode.Detail,
    'Overview': ViewMode.Simple,
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

  const renderTab = (title: string, index: number) => {
    let TabIcon = SvgDetailViewIcon

    if (title == "Overview") {
      TabIcon = SvgOverviewIcon
    }

    return (
      <Tab
        className={styles.gridViewTab}
        key={index}
      >
        <Center>
          <TabIcon />
          <Link href={'#' + tabViewMap[title]} className={styles.noDecoration}>{title}</Link>
        </Center>
      </Tab>
    )
  };

  const renderTabPanel = (_title: string, index: number) => (
    <TabPanel p={0} key={index}>
      <RoadmapDetailed issueDataState={issueDataState} />
    </TabPanel>
  );

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header issueDataState={issueDataState} />
        <Tabs variant='unstyled' onChange={handleTabChange} index={tabIndexFromViewMode} isLazy pt='20px'>
          <TabList>
            {tabs.map(renderTab)}
          </TabList>
          <TabPanels>
            {tabs.map(renderTabPanel)}
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
