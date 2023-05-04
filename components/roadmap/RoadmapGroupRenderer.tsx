import { BinPackedGroup } from '../../lib/types'
import BinPackedMilestoneItem from './BinPackedMilestoneItem'
import RoadmapGroup from './RoadmapGroup'

export default function RoadmapGroupRenderer ({ binPackedGroups }: {binPackedGroups: BinPackedGroup[]}): JSX.Element {

  if (binPackedGroups.length === 1) {
    return (
      <>
        {binPackedGroups[0].items.map((item, index) => (
          <BinPackedMilestoneItem key={index} item={item} />
        ))}
      </>
    )
  }
  return (
    <>
    {binPackedGroups.map((binPackedGroup, gIdx) => (<RoadmapGroup binPackedGroup={binPackedGroup} index={gIdx} />))}
    </>
  )
}
