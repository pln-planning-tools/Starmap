import Graph from 'graphology';
import * as render from 'graphology-svg';
import _ from 'lodash';

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

export const getGraph = (rootIssue) => {
  console.log('getGraph()');
  console.log('getGraph | rootIssue', rootIssue);
  const graph = new Graph();
  graph.setAttribute('name', 'Issue Graph');
  graph.mergeNode(rootIssue.html_url, {
    title: rootIssue.title,
    dueDate: rootIssue.dueDate || null,
  });
  rootIssue.lists.forEach((list) => {
    return list.childrenIssues?.forEach((childIssue) => {
      // console.log('childIssue', childIssue);
      // console.log('rootIssue from childIssue', childIssue);
      graph.mergeNode(childIssue.html_url, {
        ..._.pick(childIssue, ['html_url', 'title', 'state', 'node_id']),
        dueDate: childIssue.dueDate || null,
      });
      graph.mergeEdge(rootIssue.html_url, childIssue.html_url, { type: 'DEPENDS_ON' });
    });
  });
  // console.dir(graph.toJSON(), { depth: Infinity, maxArrayLength: Infinity });
  // console.dir(graph.degree('https://github.com/pln-roadmap/roadmap-test/issues/2'), {
  //   depth: Infinity,
  //   maxArrayLength: Infinity,
  // });

  // return graph;
  return graph.toJSON();
};
