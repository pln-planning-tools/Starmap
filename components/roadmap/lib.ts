

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

export interface BinPackItem {
  top: number, // y1
  bottom: number, // y2
  left: number, // x1
  right: number, // x2
  data: ImmutableObject<IssueData>
}

// This is not sufficient as it does not take into account blank spaces above it within the same x1 and x2 range.
// const y1 = rects.reduce((y1, rect) => {
//   if (rect.right + xSpacing <= x1) {
//     return y1;
//   }
//   return Math.max(y1, rect.bottom + ySpacing);
// }, yMin ?? 0);

function getAllRectsWithinRange(rects: BinPackItem[], x1: number, x2: number) {
  return rects.filter(rect => rect.right >= x1 && rect.left <= x2);
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
export const binPack = (items: ImmutableArray<IssueData>, { height, width, scale, yMin, ...opts }: BinPackOptions): BinPackItem[] => {
  const sortedItems = items
  const rects: BinPackItem[] = [];
  const ySpacing = opts.ySpacing ?? 0;
  const xSpacing = opts.xSpacing ?? 0;

  for (const item of sortedItems) {
    const x2 = scale(dayjs(item.due_date).toDate());
    const x1 = x2 - width;
    const y1 = getAllRectsWithinRange(rects, x1, x2).reduce((y1, rect) => {
      // first check if the item is within the same x1 and x2 range
      if (rect.right + xSpacing <= x1) {
        return y1;
      }
      return Math.max(y1, rect.bottom + ySpacing);
    }, yMin ?? 0);
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
