

import { ScaleTime } from 'd3';
import { IssueData } from '../../lib/types.js';
import { dayjs } from '../../lib/client/dayjs';
import { ImmutableArray, ImmutableObject } from '@hookstate/core';

interface BinPackOptions {
  width: number
  height: number
  scale: ScaleTime<number, number>
  xSpacing?: number
  ySpacing?: number
  yMin?: number
}
type PartialIssueData = Pick<IssueData, 'due_date' | 'children' | 'html_url' | 'title' | 'completion_rate'>

export interface BinPackItem {
  top: number, // y1
  bottom: number, // y2
  left: number, // x1
  right: number, // x2
  data: ImmutableObject<PartialIssueData>
}

function getAllRectsWithCollisionsOnXRange(rects: BinPackItem[], x1: number, x2: number) {
  return rects.filter(rect => {
    const isLeftOverlapping = rect.left <= x1 && rect.right >= x1;
    const isRightOverlapping = rect.left <= x2 && rect.right >= x2;
    const isWithin = rect.left >= x1 && rect.right <= x2;
    return isLeftOverlapping || isRightOverlapping || isWithin;
  });
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
export const binPack = (items: ImmutableArray<PartialIssueData>, { height, width, scale, yMin, ...opts }: BinPackOptions): BinPackItem[] => {
  const sortedItems = items
  const rects: BinPackItem[] = [];
  const ySpacing = opts.ySpacing ?? 0;
  // const xSpacing = opts.xSpacing ?? 0;

  for (const item of sortedItems) {
    if (item.due_date == null || item.due_date === '') {
      console.error(`item ${item.title} has no due date: `, item.due_date)
      // continue;
    }
    const dueDate = item.due_date ? dayjs(item.due_date) : dayjs();
    const x2 = scale(dueDate.toDate());
    // console.log(`${item.title} x2: `, x2);
    const x1 = x2 - width;

    const overlappingRects = getAllRectsWithCollisionsOnXRange(rects, x1, x2).sort((a, b) => a.bottom - b.bottom);
    let y1 = yMin ?? 0;
    // if the space between one rect and another is greater than the height, then we can place it there
    // otherwise, we need to find the first empty space
    if (overlappingRects.length > 0 && overlappingRects[0].top === (yMin ?? 0)) {
      // ensure that we don't loop over items if there's not already an item in the first row.
      // if (overlappingRects[0].top === (yMin ?? 0)) {
        // y1 = overlappingRects.reduce((y1, rect) => Math.max(y1, rect.bottom + ySpacing), yMin ?? 0);
        for (let i = 0; i <= overlappingRects.length - 1; i++) {
          const currentRect = overlappingRects[i];
          const nextRect = overlappingRects[i + 1];
          if (nextRect != null) {
            const spaceBetweenCurrentRectAndNext = nextRect.top - currentRect.bottom;
            if (spaceBetweenCurrentRectAndNext >= height) {
              y1 = currentRect.bottom + ySpacing;
              break;
            }
          } else {
            y1 = Math.max(y1, currentRect.bottom + ySpacing)
          }
        // }
      }
    }
    const y2 = y1 + height;

    rects.push({
      left: x1,
      right: x2,
      top: y1,
      bottom: y2,
      data: item
    });
  }

  return rects;
}
