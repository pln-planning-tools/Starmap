/* eslint-disable react-hooks/rules-of-hooks */
import { Center, Spinner } from '@chakra-ui/react';
import { scaleTime, select, zoom as d3Zoom, D3ZoomEvent, ZoomTransform, ScaleTime } from 'd3';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { useMaxHeight } from '../../hooks/useMaxHeight';
import { dayjs } from '../../lib/client/dayjs';
import { getDates } from '../../lib/client/getDates';
import { BinPackedGroup } from '../../lib/types';
import { IssueDataStateContext, IssuesGroupedContext } from './contexts';
import { binPack } from './lib';
import NewRoadmapHeader from './NewRoadMapHeader';
import TodayLine from './TodayLine';
import styles from '../roadmap-grid/Roadmap.module.css';
import { useViewMode } from '../../hooks/useViewMode';
import RoadmapGroupRenderer from './RoadmapGroupRenderer';
import { useLegacyView } from '../../hooks/useLegacyView';

/**
 * @todo: be smarter about choosing yZoomMin (large timespan roadmaps can't zoom out far enough)
 */
const yZoomMin = 0.2 // zoom OUT limit
const yZoomMax = 3 // zoom IN limit
const roadmapItemWidth = 350
const enableHorizontalScrolling = false

function NewRoadmap() {
  const issueDataState = useContext(IssueDataStateContext)
  const issuesGroupedState = useContext(IssuesGroupedContext)
  const legacyView = useLegacyView()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDevMode, _setIsDevMode] = useState(false);
  const [leftMostMilestoneX, setLeftMostMilestoneX] = useState(0)
  const [rightMostMilestoneX, setRightMostMilestoneX] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topMostMilestoneY, setTopMostMilestoneY] = useState(0)
  const [bottomMostMilestoneY, setBottomMostMilestoneY] = useState(0)
  const [zoomTransform, setZoomTransform] = useState<ZoomTransform>(new ZoomTransform(0.5, 0, 0))
  const viewMode = useViewMode();

  /**
   * Using useState and attachRef as done at https://github.com/facebook/react/issues/11258#issuecomment-495262508
   * in order to get around a bug where reference is null on the last re-render,
   * which causes d3 zoom/pan other event handlers not to work.
   */
  const [ref, attachRef] = useState<SVGSVGElement | null>(null)
  const [maxW, setMaxW] = useState(1000);
  const maxH = useMaxHeight();

  const dayjsDates = getDates({ issuesGroupedState, issuesGroupedId: 'test', legacyView });
  const earliestEta = dayjs.min(dayjsDates)
  const latestEta = dayjs.max(dayjsDates)
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };

  const maxScaleRangeX = useMemo(() => {
    if (ref) {
      const rect = ref.getBoundingClientRect()
      return rect.width
    }
    return maxW
  }, [maxW, ref]);

  const height = useMemo(() => maxH - margin.top - margin.bottom, [margin.bottom, margin.top, maxH]);

  const globalLoadingState = useGlobalLoadingState();

  useEffect(() => {
    window.addEventListener('resize', () => {
      setMaxW(window.innerWidth);
    });
  }, []);

  const zoomBehavior = useMemo(() => {
    function getEventDetails (event) {
      const isMouseEvent = event.type.includes('mouse')
      const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const isZoomAttempt = event.type === 'wheel' && (event.ctrlKey || event.metaKey)
      const isZoom = isZoomAttempt && !isHorizontal
      const isVerticalScroll = !isZoom && !isMouseEvent && !isHorizontal

      const isPan = !isZoom && (isMouseEvent || isHorizontal)
      return { isMouseEvent, isZoom, isPan, isHorizontal, isVerticalScroll }
    }
    const zoomFilter = (event) => {
      event.preventDefault();
      let keepEvent = false

      const { isZoom, isPan, isVerticalScroll } = getEventDetails(event)

      if (isZoom || isPan) {
        keepEvent = true
      } else if (isVerticalScroll) {
        window.scrollBy(0, event.deltaY)
        keepEvent = false
      }

      return keepEvent
    }
    return d3Zoom<SVGSVGElement, unknown>()
      .on('start', (event) => {
        const domEvent = event.sourceEvent
        if (domEvent.type !== 'wheel') {
          select(ref).style('cursor', 'grabbing')
        }
      })
      .on('end', (event) => {
        const domEvent = event.sourceEvent
        if (domEvent.type !== 'wheel') {
          select(ref).style('cursor', 'grab')
        }
      })
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const domEvent = event.sourceEvent
        const { isMouseEvent, isZoom, isPan, isVerticalScroll } = getEventDetails(domEvent)

        if (isZoom) {
          setZoomTransform(event.transform)
        } else if (isPan) {
          const newTransform = event.transform

          if (isMouseEvent) {
            setZoomTransform((oldTransform) => new ZoomTransform(oldTransform.k, newTransform.x, oldTransform.y))
          } else {
            setZoomTransform((oldTransform) => new ZoomTransform(oldTransform.k, oldTransform.x - domEvent.deltaX, oldTransform.y))
          }
        } else if (isVerticalScroll) {
          /**
           * vertical scrolling needs to be done manually because we are using
           * preventDefault
           */
          window.scrollBy(0, -domEvent.deltaY/10)
        }
      })
      .translateExtent([[-maxScaleRangeX, 0], [maxScaleRangeX*2, height]])
      .scaleExtent([yZoomMin, yZoomMax])
      .extent([[0, 0], [maxScaleRangeX, height]])
      .filter(zoomFilter)

    }, [height, maxScaleRangeX, ref])

  const scaleX = useMemo(() => {
    const scaleRange = [0, maxScaleRangeX]
    const scaleDomain = [earliestEta.toDate(), latestEta.toDate()]
    const scale = scaleTime()
      .domain(scaleDomain)
      .range(scaleRange)

    if (zoomTransform) {
      // rescales the dates based on the zoom transform
      const newScale = zoomTransform.rescaleX(scale)

      scale.domain(newScale.domain())
    }

      return scale
  }, [earliestEta, latestEta, maxScaleRangeX, zoomTransform]);

  useEffect(() => {
    if (ref != null) {
      select(ref)
        // .call(zoomBehavior)
        .call(zoomBehavior, zoomTransform)
    }
  }, [zoomBehavior, ref, zoomTransform])

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

  const visibleLeftX = useMemo(() => scaleX(scaleX.invert(0)), [scaleX])
  // console.log(`findRight - visibleLeftX: `, visibleLeftX);
  if (leftMostMilestoneX < visibleLeftX) {
    // console.log('findLeft - leftMostMilestoneX is <less than visibleLeftX')
  } else {
    // console.log('findLeft - leftMostMilestoneX is >greater than visibleLeftX')
  }
  const visibleRightX = useMemo(() => {
    if (zoomTransform) {
      return zoomTransform?.applyX(scaleX(scaleX.invert(maxScaleRangeX)))
    }
    return scaleX(scaleX.invert(maxScaleRangeX))
  }, [maxScaleRangeX, scaleX, zoomTransform])

  if (rightMostMilestoneX < visibleRightX) {
    // console.log('findRight - rightMostMilestoneX is <less than visibleRightX')
  } else {
    // console.log('findRight - rightMostMilestoneX is >greater than visibleRightX')
  }

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
    <>
      <div style={{ height: `${calcHeight}px` }}>
        <svg ref={attachRef} width='100%' height='100%' className={`${styles['d3-draggable']} view-${viewMode}`}>
          <NewRoadmapHeader
            yMin={30}
            width={maxScaleRangeX}
            maxHeight={calcHeight}
            scale={scaleX}
            leftMostX={leftMostMilestoneX}
            rightMostX={rightMostMilestoneX}
          />
          <RoadmapGroupRenderer binPackedGroups={binPackedGroups} />
          <TodayLine scale={scaleX} height={calcHeight} />
        </svg>
      </div>
    </>
  );
}

export default NewRoadmap;
