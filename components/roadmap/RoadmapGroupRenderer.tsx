import { ReactElement } from 'react'
import { BinPackedGroup } from '../../lib/types'
import BinPackedMilestoneItem from './BinPackedMilestoneItem'
import RoadmapGroup from './RoadmapGroup'
import { ItemContainerSvg } from './svg/ItemContainerSvg'

export default function RoadmapGroupRenderer ({ binPackedGroups }: {binPackedGroups: BinPackedGroup[]}): ReactElement {
  if (binPackedGroups.length === 1) {
    return (
      <>
        {binPackedGroups[0].items.map((item, index) => (
          <BinPackedMilestoneItem key={index} item={new ItemContainerSvg({ item })} />
        ))}
      </>
    )
  }
  return (
    <>
    {binPackedGroups.map((binPackedGroup, gIdx) => (<RoadmapGroup key={gIdx} binPackedGroup={binPackedGroup} index={gIdx} />))}
    </>
  )
}
