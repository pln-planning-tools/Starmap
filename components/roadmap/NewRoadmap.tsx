import { interpolate, scaleTime } from 'd3';
import { useRef } from 'react';

import { dayjs } from '../../lib/client/dayjs';
import { IssueData } from '../../lib/types';
import AxisTop from './AxisTop';
import RoadmapHeader from './RoadmapHeader';
import RoadmapItem from './RoadmapItem';
import TodayLine from './TodayLine';
import WeekTicksSelector from './WeekTicksSelector';

function NewRoadmap ({issueData, isLocal}: {issueData: IssueData | false, isLocal: boolean}) {
  const ref = useRef(null);

  if (!issueData) return null;
  const {lists} = issueData

  const issues: IssueData[] = []
  if (lists.length === 0) {
    issues.push(issueData)
  } else {
    issues.push(...lists[0].childrenIssues)
  }

  const dates = issues.map(issue => issue.dueDate).filter((dateString) => !!dateString);
  const childrenIssues: IssueData[] = issues

  let maxW = 1000;
  let maxH = 500;
  if (typeof window !== "undefined") {
    maxW = window.innerWidth;
    maxH = window.innerHeight/2;
  }
  const dayjsDates = dates.map((date) => dayjs(date))
  const startDate = dayjs().subtract(3, 'months')
  const endDate = dayjs().add(3, 'months')
  const earliestEta = dayjs.min(dayjsDates) ?? startDate;
  const latestEta = dayjs.max(dayjsDates) ?? endDate;
  const minMaxDiff = Math.max(latestEta.diff(earliestEta, 'days'), 30)
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const width = maxW - margin.left - margin.right;
  const height = maxH - margin.top - margin.bottom;

  const scaleX = scaleTime().domain([earliestEta.subtract(minMaxDiff/2, 'days').toDate(), latestEta.add(minMaxDiff/2, 'days').toDate()]).range([0, width])


  return (
    <>
    <RoadmapHeader issueData={issueData}/>
    {isLocal && <WeekTicksSelector />}
    <svg
      ref={ref}
      width={'90vw'}
      height={height + margin.top + margin.bottom}
    >
      <AxisTop scale={scaleX} transform={`translate(0, ${margin.top + 50})`} />
      <TodayLine scale={scaleX} height={height} />
      {childrenIssues.map((childIssue, index) => (<RoadmapItem index={index} scale={scaleX} childIssue={childIssue} />))}
    </svg>
    </>
  );
}

export default NewRoadmap
