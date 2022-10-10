import Graph from 'graphology';

export const getGraph = () => {
  console.log('getGraph()');
  const graph = new Graph();
  graph.addNode('github.com/.../issues/1', {
    title: 'Milestone 1',
    dueDate: '2022-10-20',
    category: 'Developer Experience',
  });
  graph.addNode('github.com/.../issues/2', {
    title: 'Milestone 2',
    dueDate: '2022-10-25',
    category: 'Ecosystem Growth',
  });
  console.log(graph.nodes());

  // return graph;
  return '';
};
