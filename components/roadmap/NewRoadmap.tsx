/* eslint-disable react-hooks/rules-of-hooks */
import { Center, Spinner, usePrevious } from '@chakra-ui/react';
import { State, useHookstate, useHookstateMemo } from '@hookstate/core';

import { D3ZoomEvent, scaleTime, select, zoom as d3Zoom } from 'd3';
import { ManipulateType } from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDateGranularity } from '../../hooks/useDateGranularity';

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { useMaxHeight, setMaxHeight } from '../../hooks/useMaxHeight';
import { useShowTodayMarker } from '../../hooks/useShowTodayMarker';
import { useViewMode } from '../../hooks/useViewMode';
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup';
import { dayjs } from '../../lib/client/dayjs';
import { getDates } from '../../lib/client/getDates';
import getUniqIdForGroupedIssues from '../../lib/client/getUniqIdForGroupedIssues';
import { globalTimeScaler } from '../../lib/client/TimeScaler';
import { ViewMode } from '../../lib/enums';
import { DetailedViewGroup, IssueData } from '../../lib/types';
import AxisTop from './AxisTop';
import BinPackedMilestoneItem from './BinPackedMilestoneItem';
import { binPack } from './lib';
import NewRoadmapHeader from './NewRoadMapHeader';
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
  // const dates = issueData.children.map((issue) => issue.due_date).filter((dateString) => !!dateString);
  const [maxW, setMaxW] = useState(1000);
  const maxH = useMaxHeight();
  const dateGranularity = useDateGranularity()

  useEffect(() => {
    window.addEventListener('resize', () => {
      setMaxW(window.innerWidth);
    });
  }, []);

  useEffect(() => {
  //   console.log('height NewRoadmap setting maxW and maxH', maxH)
    setMaxW(window.innerWidth);
  //   setMaxHeight(Math.max(maxH, window.innerHeight / 2));
  }, [maxH]);

  // useEffect(() => {

  //   if (ref.current) {
  //   //   const zoom = d3Zoom()
  //   //     .extent([[0, 0], [maxW, 1]])
  //   //     .scaleExtent([0, 1])
  //   //     .translateExtent([[0, 0], [maxW, 1]])
  //   //     .on('zoom', (event) => {
  //   //       // console.log(`el, event, d: `, el, event, d);
  //   //       const t = (event as D3ZoomEvent<SVGElement, any>).transform
  //   //       const { k, x, y } = t
  //   //       console.log(`k, x, y: `, k, x, y);
  //   //       select(ref.current).attr('transform', `translate([${x},0]) scale([${k},1])`)
  //   //       // scaleX.scale(t.rescaleX(scaleX).domain())
  //   //       // eventLabels.attr('transform', ({time}) => 'translate(' + (x + time * k) + ' '+ 10 +')')
  //   //       // timeLabels.attr('transform', ({time}) => 'translate(' + (x + time * k) + ' '+ 10 +')')
  //   //     })

  //     select(ref.current).attr('style', `width: ${maxW}px; height: ${maxH}px;`)
  //   }
  // }, [maxW, maxH])

  const dayjsDates = getDates({ issuesGroupedState, issuesGroupedId: 'test' });
  // const startDate = dayjs.min(dayjsDates) ?? dayjs().subtract(3, 'months')
  // const endDate = dayjs().add(3, 'months');
  console.log(`dateGranularity: `, dateGranularity);
  const earliestEta = dayjs.min(dayjsDates) // ?? dayjs().subtract(1, dateGranularity as ManipulateType);
  console.log(`eta dayjs.min(dayjsDates): `, dayjs.min(dayjsDates));
  console.log(`eta earliestEta: `, earliestEta);
  const latestEta = dayjs.max(dayjsDates) //?? dayjs().add(1, dateGranularity as ManipulateType);
  console.log(`eta dayjs.max(dayjsDates): `, dayjs.max(dayjsDates));
  console.log(`eta latestEta: `, latestEta);
  // const minMaxDiff = Math.max(latestEta.diff(earliestEta, 'days'), 10);
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW * .9;
  const height = useMemo(() => maxH - margin.top - margin.bottom, [margin.bottom, margin.top, maxH]);
  console.log(`height: `, height);
  const globalLoadingState = useGlobalLoadingState();
  // const dates = useMemo(() => dayjsDates
  //   .map((date) => date.toDate())
  //   .sort((a, b) => a.getTime() - b.getTime()),  [dayjsDates]);

  console.log(`dayjsDates: `, dayjsDates);
  // useEffect(() => {
  //   globalTimeScaler.setScale(dates, 5);
  // }, [dates]);
  const scaleX = scaleTime()
    .domain([earliestEta.toDate(), latestEta.toDate()])
    .range([0, width]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const scaleX = useMemo(() => globalTimeScaler.percentageScale, [dates]);
  const binPackedItems = binPack(issueData.children, {
      scale: scaleX,
      width: 350,
      height: 80,
      ySpacing: 5,
      xSpacing: 0,
      yMin: 40
    })

  if (globalLoadingState.get()) {
    return (
      <Center h={maxH} w={maxW}>
        <Spinner size='xl' />
      </Center>
    );
  }

  // get the left-most value of binPackedItems
  const { leftMostX, rightMostX } = binPackedItems.reduce((acc, item) => ({
    leftMostX: Math.min(acc.leftMostX, item.left),
    rightMostX: Math.min(acc.rightMostX, item.left)
  }), { leftMostX: 0, rightMostX: 0 });
  const earliestDate = scaleX.invert(leftMostX);
  console.log(`earliestDate: `, earliestDate);
  const latestDate = scaleX.invert(rightMostX);
  console.log(`latestDate: `, latestDate);
  // dayjsDates.push(dayjs(earliestDate));
  // dayjsDates.push(dayjs(latestDate));

  // scaleX = scaleTime()
  //   .domain([earliestDate, latestDate])
  //   .range([0, width])

  console.log(`height maxH: `, maxH);
  return (
    <>
      <div style={{ height: `${height}px`, width }}>
      {/* {isLocal && <WeekTicksSelector />} */}
        <svg ref={ref} width='100%' height='100%'>
          <rect x={0} y={50} width={maxW} height={maxH} fill={'#F8FCFF'}></rect>
          <NewRoadmapHeader scale={scaleX} transform={`translate(0, ${margin.top + 30})`} dates={dayjsDates.map((d) => d.toDate())} leftMostX={leftMostX} rightMostX={rightMostX} />
          {showTodayMarker && <TodayLine scale={scaleX} height={height} />}
          {/* {issueData.children.map((childIssue, index) => (
            <RoadmapItem index={index} scale={scaleX} childIssue={childIssue} />
          ))} */}
          {binPackedItems.map((item) => (
            <BinPackedMilestoneItem item={item} />
          ))}
        </svg>
      </div>
    </>
  );
}

export default NewRoadmap;
