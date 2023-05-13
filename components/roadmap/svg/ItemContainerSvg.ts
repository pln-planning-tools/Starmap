import { BinPackItem } from '../lib';

interface ItemContainerSvgConstructorOptions {
  item: BinPackItem;
  padding?: {x: number, y: number}
  strokeWidth?: number;
}

export class ItemContainerSvg implements BinPackItem {
  static defaultXPadding = 10
  static defaultYPadding = 5
  static defaultStrokeWidth = 2
  top: number;
  bottom: number;
  left: number;
  right: number;
  data: BinPackItem['data'];
  horizontalPadding: number;
  verticalPadding: number;
  boundaryLeft: number;
  boundaryRight: number;
  boundaryTop: number;
  boundaryBottom: number;
  height: number;
  width: number;
  contentWidth: number;

  constructor({ item, padding, strokeWidth=ItemContainerSvg.defaultStrokeWidth }: ItemContainerSvgConstructorOptions) {
    this.top = item.top
    this.bottom = item.bottom
    this.left = item.left
    this.right = item.right
    this.data = item.data

    padding = {
      x: padding?.x ?? ItemContainerSvg.defaultXPadding,
      y: padding?.y ?? ItemContainerSvg.defaultYPadding,
    }

    this.horizontalPadding = strokeWidth + padding.x
    this.verticalPadding = strokeWidth + padding.y
    this.boundaryLeft = item.left + this.horizontalPadding;
    this.boundaryRight = item.right - this.horizontalPadding;
    this.boundaryTop = item.top + this.verticalPadding;
    this.boundaryBottom = item.bottom - this.verticalPadding;

    this.height = item.bottom - item.top
    this.width = item.right - item.left
    this.contentWidth = this.boundaryRight - this.boundaryLeft
  }
}
