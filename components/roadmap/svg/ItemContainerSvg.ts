import { BinPackItem, BoxItem } from '../../../lib/types'

interface ItemContainerSvgConstructorOptions {
  item: BinPackItem;
  padding?: { x: number, y: number }
  strokeWidth?: number;
}

class BoxModel {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number

  constructor({ item }: { item: BoxItem }) {
    this.top = item.top
    this.bottom = item.bottom
    this.left = item.left
    this.right = item.right
    this.width = Math.abs(item.right - item.left)
    this.height = Math.abs(item.top - item.bottom)
  }
}

export class ItemContainerSvg extends BoxModel implements BinPackItem {
  static defaultXPadding = 10
  static defaultYPadding = 5
  static defaultStrokeWidth = 2
  data: BinPackItem['data']
  boundary: BoxModel

  constructor({
    item, padding, strokeWidth = ItemContainerSvg.defaultStrokeWidth
  }: ItemContainerSvgConstructorOptions) {
    super({ item })
    this.data = item.data

    const computedPadding = {
      x: padding?.x ?? ItemContainerSvg.defaultXPadding,
      y: padding?.y ?? ItemContainerSvg.defaultYPadding
    }

    const horizontalPadding = strokeWidth + computedPadding.x
    const verticalPadding = strokeWidth + computedPadding.y

    this.boundary = new BoxModel({
      item: {
        top: item.top + verticalPadding,
        bottom: item.bottom - verticalPadding,
        left: item.left + horizontalPadding,
        right: item.right - horizontalPadding
      }
    })
  }
}
