
import { ImmutableArray } from '@hookstate/core'
import { ScaleTime, ZoomTransform } from 'd3'
import { MutableRefObject } from 'react'

import { dayjs } from '../../lib/client/dayjs'
import { BinPackIssueData, BinPackItem } from '../../lib/types.js'

interface BinPackOptions {
  width: number
  height: number
  scale: ScaleTime<number, number>
  xSpacing?: number
  ySpacing?: number
  yMin?: number
}

function getAllRectsWithCollisionsOnXRange (rects: BinPackItem[], x1: number, x2: number) {
  // this can be calculated as item that are outside the range of x1 and x2.
  return rects.filter(rect => !(rect.right < x1 || rect.left > x2))
}

/**
 * A bin-packing algorithm that converts items to a position within an x,y coordinate system, given:
 * 1. an ETA date (this is converted to the x2 position; i.e. x2 = scale(eta))
 * 2. an index (this is used to determine order; i.e. whether the item is placed above or below other items, and it is assumed the given items are in order)
 * 3. a width (this is used to determine the x1 position; e.g. x1 = x2 - width)
 * 4. a height (this is used to determine the y2 position; e.g. y2 = y1 + height)
 *
 * y1 is determined by finding the first empty space where the space between y1 and y2 are not occupied by other items within the same x1 and x2 range.
 */
export const binPack = (items: ImmutableArray<BinPackIssueData>, { height, width, scale, yMin, ...opts }: BinPackOptions): BinPackItem[] => {
  const sortedItems = items
  const rects: BinPackItem[] = []
  const ySpacing = opts.ySpacing ?? 0
  // const xSpacing = opts.xSpacing ?? 0;

  for (const item of sortedItems) {
    if (item.due_date == null || item.due_date === '') {
      // if there's no due date, then we don't place it on the roadmap
      continue
    }
    const dueDate = dayjs(item.due_date)
    const x2 = scale(dueDate.endOf('day').toDate())
    const x1 = x2 - width

    const overlappingRects = getAllRectsWithCollisionsOnXRange(rects, x1, x2).sort((a, b) => a.bottom - b.bottom)
    let y1 = yMin ?? 0
    // if the space between one rect and another is greater than the height, then we can place it there
    // otherwise, we need to find the first empty space
    if (overlappingRects.length > 0 && overlappingRects[0].top === (yMin ?? 0)) {
      // ensure that we don't loop over items if there's not already an item in the first row.
      // if (overlappingRects[0].top === (yMin ?? 0)) {
      // y1 = overlappingRects.reduce((y1, rect) => Math.max(y1, rect.bottom + ySpacing), yMin ?? 0);
      for (let i = 0; i <= overlappingRects.length - 1; i++) {
        const currentRect = overlappingRects[i]
        const nextRect = overlappingRects[i + 1]
        if (nextRect != null) {
          const spaceBetweenCurrentRectAndNext = nextRect.top - currentRect.bottom
          if (spaceBetweenCurrentRectAndNext >= height) {
            y1 = currentRect.bottom + ySpacing
            break
          }
        } else {
          y1 = Math.max(y1, currentRect.bottom + ySpacing)
        }
        // }
      }
    }
    const y2 = y1 + height

    rects.push({
      left: x1,
      right: x2,
      top: y1,
      bottom: y2,
      data: item
    })
  }

  return rects
}

/**
 * Returns the hashString by merging the current hashString with the given zoomTransform
 *
 * @param zoomTransform
 * @returns {string} the hashString
 */
export const getHashFromZoomTransform = (zoomTransform: ZoomTransform) => {
  const d3x = zoomTransform.x.toFixed(2)
  const d3y = zoomTransform.y.toFixed(2)
  const d3k = zoomTransform.k.toFixed(2)

  const hashString = window.location.hash.substring(1) ?? ''
  // const hashString = window.location.search ?? ''
  const hashParams = new URLSearchParams(hashString)
  hashParams.set('d3x', String(d3x))
  hashParams.set('d3y', String(d3y))
  hashParams.set('d3k', String(d3k))

  // const newUrl = new URL(window.location.toString())
  // newUrl.hash = hashParams.toString()

  // setShareLink(newUrl.toString())
  return hashParams.toString()
}

export const getDefaultZoomTransform = (defaultZoomSet: MutableRefObject<boolean>) => {
  if (typeof window === 'undefined') {
    return new ZoomTransform(1, 0, 0)
  }
  // load zoomTransform from URL, only once.
  const hashString = window.location.hash.substring(1) || ''
  const hashParams = new URLSearchParams(hashString)
  const d3xParam = hashParams.get('d3x')
  const d3yParam = hashParams.get('d3y')
  const d3kParam = hashParams.get('d3k')
  if (d3xParam || d3yParam || d3kParam) {
    // we received some urlParameters, prevent finding the default zoom.
    defaultZoomSet.current = true
  }

  const d3x = Number(d3xParam) || 0
  const d3y = Number(d3yParam) || 0
  const d3k = Number(d3kParam) || 1

  return new ZoomTransform(d3k, d3x, d3y)
}
