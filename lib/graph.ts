import Graph from 'graphology';

// graph.addNode(issue.url, {
//   title: 'Milestone 1',
//   dueDate: '2022-10-20',
//   category: 'Developer Experience',
// });
// graph.addNode('github.com/.../issues/2', {
//   title: 'Milestone 2',
//   dueDate: '2022-10-25',
//   category: 'Ecosystem Growth',
// });

export const getGraph = (issue) => {
  // console.log('getGraph()');
  // console.log('getGraph | issue', issue);
  const issueChildren = issue.parsed?.lists[0]?.references;
  const graph = new Graph();
  graph.setAttribute('name', 'Issue Graph');
  graph.mergeNode(issue.url, {
    title: issue.title,
    dueDate: issue.parsed?.config?.eta || null,
  });
  issueChildren?.forEach((issueChild) => {
    graph.mergeNode(issueChild);
    graph.mergeEdge(issue.url, issueChild, { type: 'DEPENDS_ON' });
  });
  // console.dir(graph.toJSON(), { depth: Infinity, maxArrayLength: Infinity });

  // return graph;
  return graph.toJSON();
};
