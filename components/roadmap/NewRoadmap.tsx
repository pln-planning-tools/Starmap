/* eslint-disable react-hooks/rules-of-hooks */
import { Center, Spinner } from '@chakra-ui/react'
import { scaleTime, select, zoom as d3Zoom, D3ZoomEvent, ZoomTransform } from 'd3'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState'
import { useMaxHeight } from '../../hooks/useMaxHeight'
import { useViewMode } from '../../hooks/useViewMode'
import { dayjs } from '../../lib/client/dayjs'
import { getDates } from '../../lib/client/getDates'
import { BinPackedGroup } from '../../lib/types'
import { IssueDataStateContext, IssuesGroupedContext } from './contexts'
import { binPack, getDefaultZoomTransform, getHashFromZoomTransform } from './lib'
import NewRoadmapHeader from './NewRoadMapHeader'
import styles from './Roadmap.module.css'
import RoadmapGroupRenderer from './RoadmapGroupRenderer'
import TodayLine from './TodayLine'

/**
 * @todo: be smarter about choosing yZoomMin (large timespan roadmaps can't zoom out far enough)
 */
const yZoomMin = 0.2 // zoom OUT limit
const yZoomMax = 3 // zoom IN limit
const roadmapItemWidth = 350

function NewRoadmap () {
  const router = useRouter()
  const issueDataState = useContext(IssueDataStateContext)
  const issuesGroupedState = useContext(IssuesGroupedContext)
  // eslint-disable-next-line no-unused-vars
  const [isDevMode, _setIsDevMode] = useState(false)
  const [leftMostMilestoneX, setLeftMostMilestoneX] = useState(0)
  const [rightMostMilestoneX, setRightMostMilestoneX] = useState(0)
  const [, setTopMostMilestoneY] = useState(0)
  const [bottomMostMilestoneY, setBottomMostMilestoneY] = useState(0)

  // const defaultZoomTransform = new ZoomTransform(1, 0, 0)
  const viewMode = useViewMode()
  const defaultZoomSet = useRef(false)
  const [zoomTransform, setZoomTransform] = useState<ZoomTransform>(getDefaultZoomTransform(defaultZoomSet))

  const zoomHash = useMemo(() => getHashFromZoomTransform(zoomTransform), [zoomTransform])
  useEffect(() => {
    const asyncFn = async () => {
      /**
       * if the router isn't ready, or defaultZoomSet.current is false, then we
       * don't want to update the url yet.
       */
      if (!router.isReady || !defaultZoomSet.current) {
        return
      }
      try {
        await router.replace({ hash: zoomHash }, undefined, { shallow: true })
      } catch {
        // catch, but ignore cancelled route errors.
      }
    }
    asyncFn()
    // Ignore the react-hooks/exhaustive-deps warning for 'router' only, otherwise we would repeatedly call router.replace
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomHash])

  /**
   * Using useState and attachRef as done at https://github.com/facebook/react/issues/11258#issuecomment-495262508
   * in order to get around a bug where reference is null on the last re-render,
   * which causes d3 zoom/pan other event handlers not to work.
   */
  const [ref, attachRef] = useState<SVGSVGElement | null>(null)
  const [maxW, setMaxW] = useState(1000)
  const maxH = useMaxHeight()

  const dayjsDates = useMemo(() => getDates({ issuesGroupedState }), [issuesGroupedState])
  const earliestEta = useMemo(() => dayjs.min(dayjsDates.concat(dayjs().subtract(1, 'month'))).toDate(), [dayjsDates])
  const latestEta = useMemo(() => dayjs.max(dayjsDates.concat(dayjs().add(1, 'month'))).toDate(), [dayjsDates])
  const margin = { top: 0, right: 0, bottom: 20, left: 0 }

  const maxScaleRangeX = useMemo(() => {
    if (ref) {
      const rect = ref.getBoundingClientRect()
      return rect.width
    }
    return maxW
  }, [maxW, ref])

  const height = useMemo(() => maxH - margin.top - margin.bottom, [margin.bottom, margin.top, maxH])

  const globalLoadingState = useGlobalLoadingState()

  useEffect(() => {
    window.addEventListener('resize', () => {
      setMaxW(window.innerWidth)
    })
  }, [])

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
      event.preventDefault()
      event.stopImmediatePropagation()
      let keepEvent = false

      const { isZoom, isPan, isVerticalScroll } = getEventDetails(event)

      if (isZoom || isPan) {
        keepEvent = true
      } else if (isVerticalScroll) {
        window.scrollBy(0, event.deltaY)
        event.stopImmediatePropagation()
        keepEvent = false
      }

      return keepEvent
    }
    // const translateExtent: [[number, number], [number, number]] = [[-maxScaleRangeX, 0], [maxScaleRangeX*2, 0]]
    return d3Zoom<SVGSVGElement, unknown>()
      .on('start', (event) => {
        // event.preventDefault();
        const domEvent = event.sourceEvent
        if (domEvent) {
          // event.sourceEvent is empty when we call zoomBehavior.scaleTo
          domEvent.preventDefault()
          domEvent.stopImmediatePropagation()
          if (domEvent.type !== 'wheel') {
            select(ref).style('cursor', 'grabbing')
          }
        }
      })
      .on('end', (event) => {
        const domEvent = event.sourceEvent

        if (domEvent) {
          // event.sourceEvent is empty when we call zoomBehavior.scaleTo
          if (domEvent.type !== 'wheel') {
            select(ref).style('cursor', 'grab')
          }
        }
      })
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const domEvent = event.sourceEvent
        if (domEvent == null) {
          // programmatic zoom event.
          setZoomTransform(event.transform)
          return
        }
        const { isMouseEvent, isZoom, isPan, isVerticalScroll } = getEventDetails(domEvent)

        if (isZoom) {
          setZoomTransform(event.transform)
        } else if (isPan) {
          if (isMouseEvent) {
            setZoomTransform((oldTransform) => new ZoomTransform(oldTransform.k, event.transform.x, oldTransform.y))
          } else {
            // horizontal scroll
            // on mac, it frequently tries to go back when I want to prevent it from doing so
            event.sourceEvent.preventDefault()
            setZoomTransform((oldTransform) => new ZoomTransform(oldTransform.k, oldTransform.x - domEvent.deltaX, oldTransform.y))
          }
        } else if (isVerticalScroll) {
          /**
           * vertical scrolling needs to be done manually because we are using
           * preventDefault
           */
          window.scrollBy(0, -domEvent.deltaY / 10)
        }
      })
      // .translateExtent(translateExtent)
      .scaleExtent([yZoomMin, yZoomMax])
      .extent([[0, 0], [maxScaleRangeX, 0]])
      .filter(zoomFilter)
  }, [maxScaleRangeX, ref])

  const scaleX = useMemo(() => {
    const scaleRange = [0, maxScaleRangeX]
    const scaleDomain = [earliestEta, latestEta]
    const scale = scaleTime()
      .domain(scaleDomain)
      .range(scaleRange)

    if (zoomTransform) {
      // rescales the dates based on the zoom transform
      const newScale = zoomTransform.rescaleX(scale)

      scale.domain(newScale.domain())
    }

    return scale
  }, [earliestEta, latestEta, maxScaleRangeX, zoomTransform])

  useEffect(() => {
    if (ref != null) {
      select(ref)
        .call(zoomBehavior)
        // .call(zoomBehavior, zoomTransform)
    }
  }, [zoomBehavior, ref, zoomTransform])

  const titlePadding = 30
  const binPackedGroups: BinPackedGroup[] = useMemo(() => {
    let leftMostX = Infinity
    let rightMostX = -Infinity
    let topMostY = -Infinity
    let bottomMostY = 40
    const newGroups: BinPackedGroup[] = []
    const shouldAddYMinBuffer = issuesGroupedState.length > 1
    issuesGroupedState.forEach((issueGroup) => {
      const { items } = issueGroup
      const [binPackedIssues, stats] = binPack(items, {
        scale: scaleX,
        width: roadmapItemWidth,
        height: 80,
        ySpacing: 5,
        xSpacing: 0,
        yMin: bottomMostY + (shouldAddYMinBuffer ? titlePadding : 0)
      })

      leftMostX = Math.min(leftMostX, stats.left)
      rightMostX = Math.max(rightMostX, stats.right)
      topMostY = Math.min(topMostY, stats.top)
      bottomMostY = Math.max(bottomMostY, stats.bottom)

      newGroups.push({
        ...issueGroup,
        items: binPackedIssues
      })
    })

    setLeftMostMilestoneX(leftMostX)
    setRightMostMilestoneX(rightMostX)
    setTopMostMilestoneY(topMostY)
    setBottomMostMilestoneY(bottomMostY)
    return newGroups
  }, [issuesGroupedState, scaleX])

  const visibleLeftX = useMemo(() => scaleX(scaleX.domain()[0]), [scaleX])
  const visibleRightX = useMemo(() => scaleX(scaleX.domain()[1]), [scaleX])
  const isLeftMilestoneVisible = useMemo(() => leftMostMilestoneX > visibleLeftX, [leftMostMilestoneX, visibleLeftX])
  const isRightMilestoneVisible = useMemo(() => rightMostMilestoneX < visibleRightX, [rightMostMilestoneX, visibleRightX])
  const zoomKStep = 0.1
  const zoomPanStep = maxScaleRangeX / 10
  const increaseZoomK = useCallback(() => {
    if (ref) {
      zoomBehavior.scaleTo(select(ref), zoomTransform.k + zoomKStep)
    }
    // setZoomTransform((oldTransform) => new ZoomTransform(oldTransform.x, oldTransform.y, oldTransform.k + zoomKStep))
  }, [ref, zoomBehavior, zoomTransform.k])
  const decreaseZoomK = useCallback(() => {
    if (ref) {
      zoomBehavior.scaleTo(select(ref), zoomTransform.k - zoomKStep)
    }
    // setZoomTransform((oldTransform) => new ZoomTransform(oldTransform.x, oldTransform.y, oldTransform.k - zoomKStep))
  }, [ref, zoomBehavior, zoomTransform.k])
  const panRight = useCallback((amount: number | null = null) => {
    if (ref) {
      zoomBehavior.translateBy(select(ref), amount ?? zoomPanStep, 0)
    }
  }, [ref, zoomBehavior, zoomPanStep])
  const panLeft = useCallback((amount: number | null = null) => {
    if (ref) {
      zoomBehavior.translateBy(select(ref), (amount ?? zoomPanStep) * -1, 0)
    }
  }, [ref, zoomBehavior, zoomPanStep])

  useEffect(() => {
    // this effect handles automatically zooming out and panning to create a default view
    // it will continuously run until defaultZoomSet.current === true
    if (!defaultZoomSet.current) {
      const visibleWidth = visibleRightX - visibleLeftX
      const milestoneWidth = rightMostMilestoneX - leftMostMilestoneX
      if (isLeftMilestoneVisible && isRightMilestoneVisible) {
        // update zoomTransform so that all milestones are visible
        defaultZoomSet.current = true
      } else {
        if (milestoneWidth > visibleWidth) {
          // focus on zooming out first. then pan left or right
          decreaseZoomK()
        } else {
          const rightPanAmount = visibleRightX - rightMostMilestoneX
          const leftPanAmount = leftMostMilestoneX - visibleLeftX
          // calculate how much to pan left or right so that all milestones are visible
          // pan left leftPanAmount
          const xPaddingAvailable = visibleWidth - milestoneWidth
          if (Math.abs(rightPanAmount) > Math.abs(leftPanAmount)) {
            panRight(rightPanAmount - xPaddingAvailable / 2)
          } else {
            panLeft(Math.abs(leftPanAmount) + xPaddingAvailable / 2)
          }
        }
      }
    }
  }, [decreaseZoomK, isLeftMilestoneVisible, isRightMilestoneVisible, leftMostMilestoneX, panLeft, panRight, rightMostMilestoneX, visibleLeftX, visibleRightX])

  // we set the height to the max value of either the bottom most milestone or the height of the container
  const calcHeight = Math.max(bottomMostMilestoneY + 5, height)
  // fixes issue with dotted lines from header ticks not extending to bottom of container
  // when calcHeight > maxH, however, it also overrides the minimum height of the container
  // useEffect(() => {setMaxHeight(calcHeight)}, [calcHeight]);

  if (globalLoadingState.get() || issueDataState.ornull === null) {
    return (
      <Center h={maxH} w={maxW}>
        <Spinner size='xl' />
      </Center>
    )
  }

  return (
    <>
      {isDevMode && <button style={{ border: '1px solid red', borderRadius: '5px' }} onClick={() => panLeft()}>panLeft</button>}
      {isDevMode && <button style={{ border: '1px solid red', borderRadius: '5px' }} onClick={increaseZoomK}>increaseZoomK</button>}
      {isDevMode && <button style={{ border: '1px solid red', borderRadius: '5px' }} onClick={decreaseZoomK}>decreaseZoomK</button>}
      {isDevMode && <button style={{ border: '1px solid red', borderRadius: '5px' }} onClick={() => panRight()}>panRight</button>}
      {isDevMode && <button style={{ border: '1px solid red', borderRadius: '5px' }} onClick={() => { scaleX.range([leftMostMilestoneX, rightMostMilestoneX]) }}>setScale</button>}
      <div style={{ height: `${calcHeight}px` }}>
        <svg ref={attachRef} width='100%' height='100%' className={`${styles['d3-draggable']} view-${viewMode}`}>
          <NewRoadmapHeader
            yMin={30}
            width={maxScaleRangeX}
            maxHeight={calcHeight}
            scale={scaleX}
            leftMostX={visibleLeftX}
            rightMostX={visibleRightX}
          />
          <RoadmapGroupRenderer binPackedGroups={binPackedGroups} />
          <TodayLine scale={scaleX} height={calcHeight} />
        </svg>
      </div>
    </>
  )
}

export default NewRoadmap
