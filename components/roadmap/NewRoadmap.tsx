/* eslint-disable react-hooks/rules-of-hooks */
import { Center, Spinner, usePrevious } from '@chakra-ui/react';
import { State, useHookstate } from '@hookstate/core';

import { scaleTime } from 'd3';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { useMaxHeight, setMaxHeight } from '../../hooks/useMaxHeight';
import { useShowTodayMarker } from '../../hooks/useShowTodayMarker';
import { useViewMode } from '../../hooks/useViewMode';
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup';
import { dayjs } from '../../lib/client/dayjs';
import { getDates } from '../../lib/client/getDates';
import getUniqIdForGroupedIssues from '../../lib/client/getUniqIdForGroupedIssues';
import { ViewMode } from '../../lib/enums';
import { DetailedViewGroup, IssueData } from '../../lib/types';
import AxisTop from './AxisTop';
import RoadmapItem from './RoadmapItem';
import TodayLine from './TodayLine';

function NewRoadmap({ issueDataState }: { issueDataState: State<IssueData> }) {
  if (!issueDataState) return null;
  const issueData = issueDataState.get({ noproxy: true })
  const [isDevMode, _setIsDevMode] = useState(false);
  const viewMode = useViewMode() as ViewMode;
  const router = useRouter();

  const issuesGroupedState = useHookstate<DetailedViewGroup[]>([]);
  const groupedIssuesId = getUniqIdForGroupedIssues(issuesGroupedState.value)
  const groupedIssuesIdPrev = usePrevious(groupedIssuesId);
  const query = router.query
  const showTodayMarker = useShowTodayMarker();

  const setIssuesGroupedState = issuesGroupedState.set
  useEffect(() => {
    if (viewMode && groupedIssuesIdPrev !== groupedIssuesId) {
      setIssuesGroupedState(() => convertIssueDataStateToDetailedViewGroupOld(issueDataState, viewMode, query))
    }
  }, [viewMode, query, setIssuesGroupedState, issueDataState, groupedIssuesIdPrev, groupedIssuesId]);


  const ref = useRef(null);
  const dates = issueData.children.map((issue) => issue.due_date).filter((dateString) => !!dateString);
  const [maxW, setMaxW] = useState(1000);
  const maxH = useMaxHeight();

  useEffect(() => {
    setMaxW(window.innerWidth);
    setMaxHeight(window.innerHeight / 2);
  }, []);

  const dayjsDates = getDates({ issuesGroupedState, issuesGroupedId: 'test' });
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
      {/* <RoadmapHeader issueData={issueData} /> */}
      <div style={{ height: height + margin.top + margin.bottom, width: maxW * 0.90 }}>
      {/* {isLocal && <WeekTicksSelector />} */}
        <svg ref={ref} width='100%' height='100%'>
          <rect x={0} y={50} width={maxW} height={maxH} fill={'#F8FCFF'}></rect>
          <AxisTop scale={scaleX} transform={`translate(0, ${margin.top + 50})`} />
          {showTodayMarker && <TodayLine scale={scaleX} height={height} />}
          {issueData.children.map((childIssue, index) => (
            <RoadmapItem index={index} scale={scaleX} childIssue={childIssue} />
          ))}
        </svg>
      </div>
    </>
  );
}

export default NewRoadmap;
