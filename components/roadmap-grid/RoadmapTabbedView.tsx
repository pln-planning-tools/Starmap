import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import React from 'react';
import { ViewMode } from '../../lib/enums';
import { IssueData } from '../../lib/types';
import Header from './header';
import styles from './Roadmap.module.css';
import { RoadmapDetailed } from './RoadmapDetailedView';

export function RoadmapTabbedView({ issueData }: { issueData: IssueData; }) {
  const tabs: Record<string, ViewMode> = {
    'Overview': ViewMode.Simple,
    'Detailed View': ViewMode.Detail,
  }

  const renderTab = (title: string) => (
    <Tab _selected={{
      fontWeight: 'bold',
      textUnderlineOffset: '16px',
      textDecorationLine: 'underline',
      textDecorationThickness: '2px',
    }}>&nbsp;&nbsp;{ title }&nbsp;&nbsp;</Tab>
  );

  const renderTabPanel = (viewMode: ViewMode) => (
    <TabPanel>
      <RoadmapDetailed issueData={issueData} viewMode={viewMode} />
    </TabPanel>
  );

  return (
    <>
      <Box className={styles.timelineBox}>
        <Header issueData={issueData} />
        <Tabs variant='unstyled' isLazy>
          <TabList>
            {Object.keys(tabs).map(renderTab)}
          </TabList>
          <TabPanels>
            {Object.values(tabs).map(renderTabPanel)}
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
