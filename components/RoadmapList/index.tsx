// import React from 'react';
import { IssueDataViewInput } from '../../lib/types';

interface RoadmapListProps extends IssueDataViewInput {
  maybe?: unknown
}

function getFlattenedIssues(issueDataState) {
  // const issueData = issueDataState.get({ noproxy: true });
  const flattenedIssues: IssueData[] = issueDataState.children.flatMap((issueData) => {
    console.log(`issueData: `, issueData);
    return [issueData.get({ noproxy: true }), ...getFlattenedIssues(issueData)]
  })
  return flattenedIssues
}
// eslint-disable-next-line import/no-unused-modules
export default function RoadmapList({ issueDataState }: RoadmapListProps): JSX.Element {
  console.log(`RoadmapList issueDataState: `, issueDataState.get({ noproxy: true }));
  const flattenedIssues = getFlattenedIssues(issueDataState);
  console.log(`RoadmapList flattenedIssues: `, flattenedIssues);
  const { issuesWithDueDates, issuesWithoutDueDates } = flattenedIssues.reduce((acc, issue) => {
    if (issue.due_date.length > 0) {
      acc.issuesWithDueDates.push(issue)
    } else {
      acc.issuesWithoutDueDates.push(issue)
    }
    return acc
  }, { issuesWithDueDates: [], issuesWithoutDueDates: [] })
    // .filter((issue) => issue.due_date.length > 0)
    // .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  console.log(`RoadmapList issuesWithDueDates: `, issuesWithDueDates);
  console.log(`RoadmapList issuesWithoutDueDates: `, issuesWithoutDueDates);
  const sortedIssuesWithDueDates = issuesWithDueDates.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  console.log(`RoadmapList sortedIssuesWithDueDates: `, sortedIssuesWithDueDates);
  // const issuesWithoutDueDate = flattenedIssues.filter((issue) => issue.due_date.length === 0)

  return (
    <div>
      <h1>Roadmap List</h1>
      <h2>Issues with due dates</h2>
      <ol>
        {sortedIssuesWithDueDates.map((issue) => (
          <li key={issue.id}>
            <article>
              <h3>{issue.title}</h3>
              <p>{issue.due_date}</p>
              <p>{issue.description}</p>
            </article>
          </li>
        ))}
      </ol>
      <h2>Issues without due dates</h2>
      <ul>
        {issuesWithoutDueDates.map((issue) => (
          <li key={issue.id}>
            <article>
              <h3>{issue.title}</h3>
              <p>{issue.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
