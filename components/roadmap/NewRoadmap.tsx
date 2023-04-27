/* eslint-disable react-hooks/rules-of-hooks */
import { Center, Spinner, usePrevious } from '@chakra-ui/react';
import { State, useHookstate } from '@hookstate/core';
import { scaleTime, select, zoom as d3Zoom, drag as d3Drag } from 'd3';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  const viewMode = useViewMode() as ViewMode;
  const router = useRouter();
  const [panX, setPanX] = useState(0)
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
            // if user clicked and dragged left/right, then pan
            setPanX((oldPanX) => {
              const newPanX = oldPanX + event.dx
              if (Math.abs(newPanX) > maxW) {
                // don't allow panning too far... naive.
                return oldPanX
              }
              return newPanX
            })
          } else if (Math.abs(event.dy) > 1) {
            // if user clicked and dragged up/down, then zoom in/out
            setYZoom((oldZoomY) => {
              let newYZoom = oldZoomY
              if (event.dy < 0) {
                newYZoom = oldZoomY+yZoomStep
              } else if (event.dy > 0) {
                newYZoom = oldZoomY-yZoomStep
              }
              // if newYZoom is greater than yZoomMax, things get out of hand..
              if (newYZoom >= yZoomMax) {
                newYZoom = yZoomMax
              } else if (newYZoom <= yZoomMin) {
                newYZoom = yZoomMin
              }
              console.log(`newYZoom: `, newYZoom);
              return newYZoom
              // return newZoomY
            })
          }
        })
      const zoom = d3Zoom<SVGSVGElement, any>()
        .on('zoom', function zoomed(event) {
          // zoom in/out of the total timespan we can view
          setYZoom((oldZoomY) => {
            let newYZoom = oldZoomY
            if (event.sourceEvent.deltaY > 0) {
              newYZoom = oldZoomY+yZoomStep
            } else if (event.sourceEvent.deltaY < 0) {
              newYZoom = oldZoomY-yZoomStep
            }
            // if newYZoom is greater than yZoomMax, things get out of hand..
            if (newYZoom >= yZoomMax) {
              newYZoom = yZoomMax
            } else if (newYZoom <= yZoomMin) {
              newYZoom = yZoomMin
            }
            console.log(`newYZoom: `, newYZoom);
            return newYZoom
            // return newZoomY
          })
          return false
        })

      select(ref.current)
      .call(drag)
      .call(zoom)

      // select(ref.current).attr('style', `width: ${maxW}px; height: ${maxH}px;`)
    }
  }, [currentRef, maxW])

  const dayjsDates = getDates({ issuesGroupedState, issuesGroupedId: 'test' });
  const earliestEta = dayjs.min(dayjsDates)
  const latestEta = dayjs.max(dayjsDates)
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW * .9;
  const height = useMemo(() => maxH - margin.top - margin.bottom, [margin.bottom, margin.top, maxH]);

  const globalLoadingState = useGlobalLoadingState();

  const scaleX = useMemo(() => scaleTime()
    .domain([earliestEta.toDate(), latestEta.toDate()])
    .range([0, width * yZoom])
  , [earliestEta, latestEta, width, yZoom]);

  const binPackedItems = binPack(issueData.children, {
    scale: scaleX,
    width: 350,
    height: 80,
    ySpacing: 5,
    xSpacing: 0,
    yMin: 40
  })

  const { leftMostX, rightMostX } = binPackedItems.reduce((acc, item) => ({
    leftMostX: Math.min(acc.leftMostX, item.left),
    rightMostX: Math.min(acc.rightMostX, item.left)
  }), { leftMostX: 0, rightMostX: 0 });

  if (globalLoadingState.get()) {
    return (
      <Center h={maxH} w={maxW}>
        <Spinner size='xl' />
      </Center>
    );
  }

  return (
    <PanContext.Provider value={panX}>
      <div style={{ height: `${height}px` }}>
        <svg ref={ref} width='100%' height='100%' viewBox={`[${panX}, 0, ${width+panX}, ${height}]`}>
          <NewRoadmapHeader
            transform={`translate(0, ${margin.top + 30})`}
            width={width}
            scale={scaleX}
            leftMostX={leftMostX}
            rightMostX={rightMostX}
          />
          {showTodayMarker && <TodayLine scale={scaleX} height={height} />}
          {binPackedItems.map((item) => (
            <BinPackedMilestoneItem item={item} />
          ))}
        </svg>
      </div>
    </PanContext.Provider>
  );
}

export default NewRoadmap;
