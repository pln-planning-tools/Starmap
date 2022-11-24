import { Box, Center, Spinner } from '@chakra-ui/react';

import { scaleTime } from 'd3';
import { useEffect, useRef, useState } from 'react';

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { useMaxHeight, setMaxHeight } from '../../hooks/useMaxHeight';
import { dayjs } from '../../lib/client/dayjs';
import { IssueData } from '../../lib/types';
import AxisTop from './AxisTop';
import RoadmapHeader from './RoadmapHeader';
import RoadmapItem from './RoadmapItem';
import TodayLine from './TodayLine';
import WeekTicksSelector from './WeekTicksSelector';

function NewRoadmap({ issueData, isLocal }: { issueData: IssueData; isLocal: boolean }) {
  if (!issueData) return null;

  const ref = useRef(null);
  const dates = issueData.children.map((issue) => issue.due_date).filter((dateString) => !!dateString);
  const [maxW, setMaxW] = useState(1000);
  const maxH = useMaxHeight();

  useEffect(() => {
    setMaxW(window.innerWidth);
    setMaxHeight(window.innerHeight / 2);
  }, []);

  const dayjsDates = dates.map((date) => dayjs(date));
  const startDate = dayjs().subtract(3, 'months');
  const endDate = dayjs().add(3, 'months');
  const earliestEta = dayjs.min(dayjsDates) ?? startDate;
  const latestEta = dayjs.max(dayjsDates.concat(dayjs())) ?? endDate;
  const minMaxDiff = Math.max(latestEta.diff(earliestEta, 'days'), 10);
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW - margin.left - margin.right;
  const height = maxH - margin.top - margin.bottom;
  const globalLoadingState = useGlobalLoadingState();

  const scaleX = scaleTime()
    .domain([earliestEta.subtract(minMaxDiff / 4, 'days').toDate(), latestEta.add(minMaxDiff / 6, 'days').toDate()])
    .range([0, width]);

  if (globalLoadingState.get()) {
    return (
      <Center h={maxH} w={maxW}>
        <Spinner size='xl' />
      </Center>
    );
  }

  return (
    <>
      <RoadmapHeader issueData={issueData} />
      {/* {isLocal && <WeekTicksSelector />} */}
      <svg ref={ref} width={'100vw'} height={height + margin.top + margin.bottom}>
        <rect x={0} y={50} width={maxW} height={maxH} fill={'#F8FCFF'}></rect>
        <AxisTop scale={scaleX} transform={`translate(0, ${margin.top + 50})`} />
        <TodayLine scale={scaleX} height={height} />
        {issueData.children.map((childIssue, index) => (
          <RoadmapItem index={index} scale={scaleX} childIssue={childIssue} />
        ))}
      </svg>
    </>
  );
}

export default NewRoadmap;
