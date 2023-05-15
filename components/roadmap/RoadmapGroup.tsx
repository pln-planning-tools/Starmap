import { BinPackedGroup } from '../../lib/types'
import BinPackedMilestoneItem from './BinPackedMilestoneItem'
import { BinPackedGroupHeader } from './group-header'
import { ItemContainerSvg } from './svg/ItemContainerSvg'

export default function RoadmapGroup ({ binPackedGroup, index }: {binPackedGroup: BinPackedGroup, index: number}) {
  /**
   * @todo: support collapsing/expanding groups
   */
  if (binPackedGroup.items.length === 0) {
    console.warn(`Not rendering empty group for ${binPackedGroup.groupName}`)
    return null
  }
  return (
    <g key={index}>
      <foreignObject x="0" y={binPackedGroup.items[0].top - 30} width="100%" height="50">
        <BinPackedGroupHeader group={binPackedGroup} />
      </foreignObject>
      {binPackedGroup.items.map((item, itemIndex) => (
        <BinPackedMilestoneItem key={`${index}+${itemIndex}`} item={new ItemContainerSvg({ item })} />
      ))}
    </g>
  )
}
