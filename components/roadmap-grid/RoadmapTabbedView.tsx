import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import React from 'react';
import { setViewMode } from '../../hooks/useViewMode';
import { ViewMode } from '../../lib/enums';
import { IssueData } from '../../lib/types';
import Header from './header';
import styles from './Roadmap.module.css';
import { RoadmapDetailed } from './RoadmapDetailedView';

export function RoadmapTabbedView({ issueData }: { issueData: IssueData; }) {
  // Defining what tabs to show and in what order
  const tabs = ['Overview', 'Detailed View'] as const;

  // Mapping the views to the tabs
  const tabViewMap: Record<typeof tabs[number], ViewMode> = {
    'Overview': ViewMode.Simple,
    'Detailed View': ViewMode.Detail,
  };

  const handleTabChange = (index: number) => {
    setViewMode(tabViewMap[tabs[index]]);
  }

  const renderTab = (title: string, index: number) => (
    <Tab
      key={index}
      _selected={{
        fontWeight: 'bold',
        textUnderlineOffset: '16px',
        textDecorationLine: 'underline',
        textDecorationThickness: '2px',
      }}
    >&nbsp;&nbsp;{title}&nbsp;&nbsp;</Tab>
  );

  const renderTabPanel = (_title: string, index: number) => (
    <TabPanel key={index}>
      <RoadmapDetailed issueData={issueData} />
    </TabPanel>
  );

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header issueData={issueData} />
        <Tabs variant='unstyled' onChange={handleTabChange} isLazy>
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
