import { interpolate, scaleTime } from 'd3';

import { dayjs } from '../../lib/client/dayjs';
import { IssueData } from '../../lib/types';
import AxisTop from './AxisTop';
import RoadmapHeader from './RoadmapHeader';
import RoadmapItem from './RoadmapItem';
import TodayLine from './TodayLine';
import WeekTicksSelector from './WeekTicksSelector';

function NewRoadmap ({issueData}: {issueData: IssueData | false}) {
  console.log(`issueData: `, issueData);
  if (!issueData) return null;
  const {lists} = issueData
  // const lists = (Array.isArray(issueData?.lists) && issueData?.lists?.length > 0 && issueData?.lists) || [issueData];
  // const dates =
  //   lists
  //     .map(
  //       (list) =>
  //         (!list?.childrenIssues && [formatDate(list.dueDate)]) ||
  //         list?.childrenIssues?.map((v) => formatDate(v.dueDate)),
  //     )
  //     .flat()
  //     .filter((v) => !!v) || lists.flatMap((v) => formatDate(v.dueDate));
  const childrenIssues2 = lists.flatMap((v) => v.childrenIssues)
  console.log(`childrenIssues2: `, childrenIssues2);

  const issues: IssueData[] = []
  // issues.push(issueData)
  if (lists.length === 0) {
    console.log('no lists, preventing newRoadMap render')
    // return null;
    issues.push(issueData)
  } else {
    issues.push(...lists[0].childrenIssues)
  }

  const dates: string[] = []
  lists.forEach((listItem) => {
    console.log(`listItem: `, listItem);
    listItem.childrenIssues.forEach((childIssue) => {
      // issues.push(childIssue)
      console.log(`childIssue: `, childIssue);
      if (childIssue.dueDate) {
        dates.push(childIssue.dueDate)
      }
    })
  })
  // const childrenIssues: IssueData[] = lists[0].childrenIssues
  const childrenIssues: IssueData[] = issues

  // const timelineQuantiles: number[] = getQuantiles(timelineTicks(dates.map(toTimestamp)));
  // const exampleData = timelineQuantiles.map((quantile) => ({ label: dayjs(quantile).utc().format('ll'), value: quantile}))
  // console.log(`exampleData: `, exampleData);
  // extent(exampleData, (d) => d.value)
  // console.log(`extent(exampleData, (d) => d.value): `, extent(exampleData, (d) => dayjs(d.value).toDate()));
  let maxW = 1000;
  let maxH = 500;
  if (typeof window !== "undefined") {
    maxW = window.innerWidth;
    maxH = window.innerHeight/2;
  }
  const startDate = dayjs().subtract(3, 'months').toDate()
  const endDate = dayjs().add(3, 'months').toDate()
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW - margin.left - margin.right;
  const height = maxH - margin.top - margin.bottom;

  const scaleX = scaleTime().domain([startDate, endDate]).range([0, width])
  console.log('scaleX.ticks(): ', scaleX.ticks());
  const dateScale = interpolate(startDate, endDate)
  // const dateScale2 = scaleX.interpolate(dayjs().unix())
  const todayX = scaleX(dayjs().toDate())
  console.log(`todayX: `, todayX);
  const todayX2 = dateScale(dayjs().unix())
  console.log(`todayX2: `, todayX2);

  return (
    <>
    <RoadmapHeader issueData={issueData}/>
    <WeekTicksSelector />
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
    </>
  );
}

export default NewRoadmap
