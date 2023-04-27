/* eslint-disable react-hooks/rules-of-hooks */
import { Center, Spinner, usePrevious } from '@chakra-ui/react';
import { State, useHookstate } from '@hookstate/core';
import { scaleTime, select, zoom as d3Zoom, drag as d3Drag } from 'd3';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { useMaxHeight } from '../../hooks/useMaxHeight';
import { useShowTodayMarker } from '../../hooks/useShowTodayMarker';
import { useViewMode } from '../../hooks/useViewMode';
import { convertIssueDataStateToDetailedViewGroupOld } from '../../lib/client/convertIssueDataToDetailedViewGroup';
import { dayjs } from '../../lib/client/dayjs';
import { getDates } from '../../lib/client/getDates';
import getUniqIdForGroupedIssues from '../../lib/client/getUniqIdForGroupedIssues';
import { ViewMode } from '../../lib/enums';
import { DetailedViewGroup, IssueData } from '../../lib/types';
import BinPackedMilestoneItem from './BinPackedMilestoneItem';
import { PanContext } from './contexts';
import { binPack } from './lib';
import NewRoadmapHeader from './NewRoadMapHeader';
import TodayLine from './TodayLine';

const yZoomStep = 0.05
const yZoomMin = 0.65 // inclusive
const yZoomMax = 3 // inclusive

function NewRoadmap({ issueDataState }: { issueDataState: State<IssueData> }) {
  if (!issueDataState) return null;
  const issueData = issueDataState.get({ noproxy: true })
  const [isDevMode, _setIsDevMode] = useState(false);
  const [leftMostMilestoneX, setLeftMostMilestoneX] = useState(0)
  const [rightMostMilestoneX, setRightMostMilestoneX] = useState(0)
  const [topMostMilestoneY, setTopMostMilestoneY] = useState(0)
  const [bottomMostMilestoneY, setBottomMostMilestoneY] = useState(0)

  const viewMode = useViewMode() as ViewMode;
  const router = useRouter();
  const [panX, setPanX] = useState(0) // positive is pan left (earlier), negative is pan right (later)
  const [yZoom, setYZoom] = useState(1)

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

  const ref = useRef<SVGSVGElement>(null);
  const [maxW, setMaxW] = useState(1000);
  const maxH = useMaxHeight();

  const dayjsDates = getDates({ issuesGroupedState, issuesGroupedId: 'test' });
  const earliestEta = dayjs.min(dayjsDates)
  const latestEta = dayjs.max(dayjsDates)
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW * .9;

  const maxScaleRangeX = width * yZoom
  const height = useMemo(() => maxH - margin.top - margin.bottom, [margin.bottom, margin.top, maxH]);

  const globalLoadingState = useGlobalLoadingState();
  // const dateGranularity = useDateGranularity()

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

  const currentRef = ref.current
  const getNewPanX = useCallback((panDx, oldPanX) => {
    if (currentRef != null) {
      const boundingRect = currentRef.getBoundingClientRect()
      const panMargin = boundingRect.width/10
      let newPanX = oldPanX + panDx
      const maxRightValue = boundingRect.width - rightMostMilestoneX - panMargin
      const maxLeftValue = (boundingRect.width - leftMostMilestoneX) - boundingRect.width + panMargin

      if (newPanX < maxRightValue) {
        newPanX = maxRightValue
      } else if (newPanX > maxLeftValue) {
        newPanX = maxLeftValue
      }
      return newPanX
    }
  }, [currentRef, leftMostMilestoneX, rightMostMilestoneX])

  useEffect(() => {
    /**
     * if user is fully zoomed in, panned all the way to the right, and then
     * zooms out, panning needs to adjust so that the rightmost milestone is
     * still visible
     *
     * TODO: make these transitions more smooth.
     */
      setPanX((oldPanX) => getNewPanX(0, oldPanX) ?? 0)
  }, [getNewPanX, maxScaleRangeX])

  const getNewYZoom = useCallback((zoomDy, oldZoomY) => {
    let newYZoom = oldZoomY
    if (zoomDy < 0) {
      newYZoom = oldZoomY+yZoomStep
    } else if (zoomDy > 0) {
      newYZoom = oldZoomY-yZoomStep
    }
    // if newYZoom is greater than yZoomMax, things get out of hand..
    if (newYZoom >= yZoomMax) {
      newYZoom = yZoomMax
    } else if (newYZoom <= yZoomMin) {
      newYZoom = yZoomMin
    }
    return newYZoom

  }, [])

  useEffect(() => {
    if (ref.current != null) {
      let validDrag = false
      const drag = d3Drag<SVGSVGElement, any>()
        .on('start', function (event) {
          if (event.sourceEvent.srcElement === ref.current) {
            validDrag = true
          }
        })
        .on('end', () => {
          validDrag = false
        })
        .on("drag", function dragged(event) {
          if (!validDrag) {
            return
          }
          // we only want to either pan or zoom, not both (may change in the future.. but doing both isn't super intuitive)
          if (Math.abs(event.dx) > 0) { // prefer panning to zooming on drag.
            setPanX((oldPanX) => getNewPanX(event.dx, oldPanX))
          } else if (Math.abs(event.dy) > 1) {
            // if user clicked and dragged up/down, then zoom in/out
            setYZoom((oldZoomY) => getNewYZoom(event.dy, oldZoomY))
          }
        })
      const zoom = d3Zoom<SVGSVGElement, any>()
        .on('zoom', function zoomed(event) {
          setYZoom((oldZoomY) => getNewYZoom(event.sourceEvent.deltaY, oldZoomY))
        })

      select(ref.current)
        .call(drag)
        .call(zoom)
    }
  }, [currentRef, leftMostMilestoneX, maxW, rightMostMilestoneX, yZoom, getNewPanX, getNewYZoom])

  const scaleX = useMemo(() => scaleTime()
    .domain([earliestEta.toDate(), latestEta.toDate()])
    .range([0, maxScaleRangeX])
  , [earliestEta, latestEta, maxScaleRangeX]);

  const binPackedItems = binPack(issueData.children, {
    scale: scaleX,
    width: 350,
    height: 80,
    ySpacing: 5,
    xSpacing: 0,
    yMin: 40
  })

  // find the largest x value, smallest y value, and largest y value in binPackedItems
  let leftMostX = Infinity
  let rightMostX = 0
  let topMostY = Infinity
  let bottomMostY = 0
  binPackedItems.forEach((item) => {
    leftMostX = Math.min(leftMostX, item.left)
    rightMostX = Math.max(rightMostX, item.right)
    topMostY = Math.min(topMostY, item.top)
    bottomMostY = Math.max(bottomMostY, item.bottom)
  })

  useEffect(() => {
    setLeftMostMilestoneX(leftMostX)
    setRightMostMilestoneX(rightMostX)
    setTopMostMilestoneY(topMostY)
    setBottomMostMilestoneY(bottomMostY)
  }, [bottomMostY, leftMostX, rightMostX, topMostY])

  if (globalLoadingState.get()) {
    return (
      <Center h={maxH} w={maxW}>
        <Spinner size='xl' />
      </Center>
    );
  }

  // we set the height to the max value of either the bottom most milestone or the height of the container
  const calcHeight = Math.max(bottomMostY+5, height)

  return (
    <PanContext.Provider value={panX}>
      <div style={{ height: `${calcHeight}px` }}>
        <svg ref={ref} width='100%' height='100%' viewBox={`[${panX}, 0, ${width+panX}, ${calcHeight}]`}>
          <NewRoadmapHeader
            transform={`translate(0, ${margin.top + 30})`}
            width={width}
            scale={scaleX}
            leftMostX={leftMostX}
            rightMostX={rightMostX}
          />
          {showTodayMarker && <TodayLine scale={scaleX} height={calcHeight} />}
          {binPackedItems.map((item) => (
            <BinPackedMilestoneItem item={item} />
          ))}
        </svg>
      </div>
    </PanContext.Provider>
  );
}

export default NewRoadmap;
