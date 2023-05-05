/* eslint-disable react-hooks/rules-of-hooks */
import { Center, Spinner } from '@chakra-ui/react';
import { scaleTime, select, zoom as d3Zoom, drag as d3Drag, D3ZoomEvent, ZoomTransform, D3DragEvent } from 'd3';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { useMaxHeight } from '../../hooks/useMaxHeight';
import { dayjs } from '../../lib/client/dayjs';
import { getDates } from '../../lib/client/getDates';
import { BinPackedGroup } from '../../lib/types';
import { IssueDataStateContext, IssuesGroupedContext, PanContext } from './contexts';
import { binPack } from './lib';
import NewRoadmapHeader from './NewRoadMapHeader';
import TodayLine from './TodayLine';
import styles from '../roadmap-grid/Roadmap.module.css';
import { useViewMode } from '../../hooks/useViewMode';
import RoadmapGroupRenderer from './RoadmapGroupRenderer';

/**
 * @todo: be smarter about choosing yZoomMin (large timespan roadmaps can't zoom out far enough)
 */
const yZoomMin = 0.01 // zoom OUT limit
const yZoomMax = 3 // zoom IN limit
const roadmapItemWidth = 350

function NewRoadmap() {
  const issueDataState = useContext(IssueDataStateContext)
  const issuesGroupedState = useContext(IssuesGroupedContext)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDevMode, _setIsDevMode] = useState(false);
  const [leftMostMilestoneX, setLeftMostMilestoneX] = useState(0)
  const [rightMostMilestoneX, setRightMostMilestoneX] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topMostMilestoneY, setTopMostMilestoneY] = useState(0)
  const [bottomMostMilestoneY, setBottomMostMilestoneY] = useState(0)
  const [zoomTransform, setZoomTransform] = useState<ZoomTransform|null>(null)
  const [panX, setPanX] = useState(0) // positive is pan left (earlier), negative is pan right (later)
  const viewMode = useViewMode();

  /**
   * Using useState and attachRef as done at https://github.com/facebook/react/issues/11258#issuecomment-495262508
   * in order to get around a bug where reference is null on the last re-render,
   * which causes d3 zoom/pan other event handlers not to work.
   */
  const [ref, attachRef] = useState<SVGSVGElement | null>(null)
  const [maxW, setMaxW] = useState(1000);
  const maxH = useMaxHeight();

  const dayjsDates = getDates({ issuesGroupedState, issuesGroupedId: 'test' });
  const earliestEta = dayjs.min(dayjsDates)
  const latestEta = dayjs.max(dayjsDates)
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW * .9;

  const maxScaleRangeX = maxW
  const height = useMemo(() => maxH - margin.top - margin.bottom, [margin.bottom, margin.top, maxH]);

  const globalLoadingState = useGlobalLoadingState();

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

  // const currentRef = ref.current
  const getNewPanX = useCallback((panDx, oldPanX) => {
    // TODO: instead of using panX directly, we should transform elements appropriately using d3.

    if (ref != null) {
      const boundingRect = ref.getBoundingClientRect()
      const panMargin = boundingRect.width/5
      let newPanX = oldPanX + panDx
      // const middleX = rightMostMilestoneX - leftMostMilestoneX
      const maxRightValue = boundingRect.width - rightMostMilestoneX - panMargin
      const maxLeftValue = (boundingRect.width - leftMostMilestoneX) - boundingRect.width + panMargin
      if (oldPanX <= maxRightValue && oldPanX >= maxLeftValue) {
        // prevent jittering
        /**
         * TODO: Fix this to ensure that when zoomed out so far that all
         * milestones are visible, and somewhat vertically aligned, that they
         * are completely centered.
         */
        return oldPanX
      }

      if (newPanX <= maxRightValue) {
        newPanX = maxRightValue
      } else if (newPanX >= maxLeftValue) {
        newPanX = maxLeftValue
      }
      return newPanX
    }
  }, [leftMostMilestoneX, rightMostMilestoneX, ref])

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

  const zoomBehavior = useMemo(() => {
    const zoomFilter = (event) => {
      // when over the roadmap, prevent horizontal scrolling from sending user fwd/back
      event.preventDefault();
      const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const isZoom = event.type === 'wheel' && (event.ctrlKey || event.metaKey)
      if (!isZoom) {
        if (!isHorizontal) {
          return false
        }
      }
      return true

    }
    return d3Zoom<SVGSVGElement, unknown>()
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const domEvent = event.sourceEvent

        // if the deltaX is greater than the delta Y, then it's a horizontal scroll and we should pan
        const isHorizontal = Math.abs(domEvent.deltaX) > Math.abs(domEvent.deltaY)
        const isZoom = domEvent.type === 'wheel' && (domEvent.ctrlKey || domEvent.metaKey)

        // block if it's a wheel event and CTRL is not pressed.
        // this allows pinch to zoom on trackpads
        if (!isZoom && isHorizontal) {

          setPanX((oldPanX) => getNewPanX(-domEvent.deltaX, oldPanX))

        } else {
          setZoomTransform(event.transform)
          // setPanX((oldPanX) => event.transform.applyX(oldPanX))
        }
      })
      .translateExtent([[0, 0], [maxScaleRangeX, height]])
      .scaleExtent([yZoomMin, yZoomMax])
      .extent([[0, 0], [maxScaleRangeX, height]])
      .filter(zoomFilter)
    }, [getNewPanX, height, maxScaleRangeX])

  const scaleX = useMemo(() => {
    let scaleRange = [0, maxScaleRangeX]
    const scaleDomain = [earliestEta.toDate(), latestEta.toDate()]
    if (zoomTransform !== null) {
      scaleRange = scaleRange.map(d => zoomTransform.applyY(d))
    }
    const scale = scaleTime()
      .domain(scaleDomain)
      .range(scaleRange)

      return scale
  }, [earliestEta, latestEta, maxScaleRangeX, zoomTransform]);

  useEffect(() => {
    if (ref != null) {
      // let validDrag = false
      const drag = d3Drag<SVGSVGElement, any>()
        .on('start', () => select(ref).style('cursor', 'grabbing'))
        .on('end', () => select(ref).style('cursor', 'grab'))
        .on("drag", function dragged(event: D3DragEvent<SVGSVGElement, unknown, unknown>) {
          if (Math.abs(event.dx) > 0) {
            setPanX((oldPanX) => getNewPanX(event.dx, oldPanX))
          }
        })
        .filter((event) => {
          if (event.srcElement === ref) {
            event.preventDefault();
            return true
          }
          return false
        })

      select(ref)
        .call(drag)
        .call(zoomBehavior)
    }
  }, [getNewPanX, zoomBehavior, viewMode, ref])

  const titlePadding = 30;
  const binPackedGroups: BinPackedGroup[] = useMemo(() => {
    let leftMostX = Infinity
    let rightMostX = 0
    let topMostY = Infinity
    let bottomMostY = 40
    const newGroups: BinPackedGroup[] = []
    const shouldAddYMinBuffer = issuesGroupedState.length > 1
    issuesGroupedState.forEach((issueGroup) => {
      const { items } = issueGroup
      const binPackedIssues = binPack(items, {
        scale: scaleX,
        width: roadmapItemWidth,
        height: 80,
        ySpacing: 5,
        xSpacing: 0,
        yMin: bottomMostY + (shouldAddYMinBuffer ? titlePadding : 0)
      })

      binPackedIssues.forEach((item) => {
        leftMostX = Math.min(leftMostX, item.left)
        rightMostX = Math.max(rightMostX, item.right)
        topMostY = Math.min(topMostY, item.top)
        bottomMostY = Math.max(bottomMostY, item.bottom)
      })
      newGroups.push({
        ...issueGroup,
        items: binPackedIssues
      });
    })

    setLeftMostMilestoneX(leftMostX)
    setRightMostMilestoneX(rightMostX)
    setTopMostMilestoneY(topMostY)
    setBottomMostMilestoneY(bottomMostY)
    return newGroups
  }, [issuesGroupedState, scaleX])

  // we set the height to the max value of either the bottom most milestone or the height of the container
  const calcHeight = Math.max(bottomMostMilestoneY+5, height)
  // fixes issue with dotted lines from header ticks not extending to bottom of container
  // when calcHeight > maxH, however, it also overrides the minimum height of the container
  // useEffect(() => {setMaxHeight(calcHeight)}, [calcHeight]);

  if (globalLoadingState.get() || issueDataState.ornull === null) {
    return (
      <Center h={maxH} w={maxW}>
        <Spinner size='xl' />
      </Center>
    );
  }

  return (
    <PanContext.Provider value={panX}>
      <div style={{ height: `${calcHeight}px` }}>
        <svg ref={attachRef} width='100%' height='100%' className={`${styles['d3-draggable']} view-${viewMode}`} >
          <NewRoadmapHeader
            transform={`translate(0, ${margin.top + 30})`}
            width={width}
            maxHeight={calcHeight}
            scale={scaleX}
            leftMostX={leftMostMilestoneX}
            rightMostX={rightMostMilestoneX}
          />
          <TodayLine scale={scaleX} height={calcHeight} />
          <RoadmapGroupRenderer binPackedGroups={binPackedGroups} />
        </svg>
      </div>
    </PanContext.Provider>
  );
}

export default NewRoadmap;
