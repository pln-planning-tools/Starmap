import { extent, scaleTime } from 'd3';

import { dayjs } from '../../lib/client/dayjs';
import { getQuantiles } from '../../lib/client/getQuantiles';
import { timelineTicks } from '../../lib/client/timelineTicks';
import { IssueData } from '../../lib/types';
import { toTimestamp } from '../../utils/general';
import AxisTop from './AxisTop';
import RoadmapItem from './RoadmapItem';
import TodayLine from './TodayLine';

function NewRoadmap ({issueData}: {issueData: IssueData}) {
  console.log(`issueData: `, issueData);
  if (!issueData) return null;
  const {lists} = issueData
  const dates: string[] = []
  const etaAndTitles: {eta: string, title: string}[] = []
  const childrenIssues = lists[0].childrenIssues
  lists.forEach((listItem) => {
    console.log(`listItem: `, listItem);
    listItem.childrenIssues.forEach((childIssue) => {
      console.log(`childIssue: `, childIssue);
      if (childIssue.dueDate) {
        dates.push(childIssue.dueDate)
        etaAndTitles.push({eta: childIssue.dueDate, title: childIssue.title})
      }
    })
  })

  const timelineQuantiles: number[] = getQuantiles(timelineTicks(dates.map(toTimestamp)));
  const exampleData = timelineQuantiles.map((quantile) => ({ label: dayjs(quantile).utc().format('ll'), value: quantile}))
  let maxW = 1000;
  let maxH = 500;
  if (typeof window !== "undefined") {
    maxW = window.innerWidth;
    maxH = window.innerHeight/2;
  }

  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW - margin.left - margin.right;
  const height = maxH - margin.top - margin.bottom;

  const xDomain = extent(exampleData, ({ value }) => value) as [number, number]
  const scaleX = scaleTime().domain(xDomain).range([0, width])

  return (
    <svg
      width={'90vw'}
      height={height + margin.top + margin.bottom}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisTop scale={scaleX} transform={`translate(0, ${margin.top + 50})`} />
        <TodayLine scale={scaleX} height={height} />
        {childrenIssues.map((childIssue, index) => (<RoadmapItem index={index} scale={scaleX} childIssue={childIssue} />))}
      </g>
    </svg>
  );
}

export default NewRoadmap
