import getUniqIdForGroupedIssues from '../../../lib/client/getUniqIdForGroupedIssues'

describe('getUniqIdForGroupedIssues', function() {
  it('returns empty string for empty array', () => {
    expect(getUniqIdForGroupedIssues([])).toEqual('');
  });
  it('Returns only groupName for group without children', () => {
    expect(getUniqIdForGroupedIssues([{ groupName: 'test123', items: [], url: 'nothing' }])).toEqual('test123')
  });
  it('Returns both groupNames for two groups without children', () => {
    expect(getUniqIdForGroupedIssues([
      { groupName: 'test123', items: [], url: 'nothing' },
      { groupName: 'abc987', items: [], url: 'nothing2' },
    ])).toEqual('test123--abc987');
  });
  it('Respects sort order', () => {
    expect(getUniqIdForGroupedIssues([
      { groupName: 'item1', items: [], url: 'nothing' },
      { groupName: 'item2', items: [], url: 'nothing2' },
    ])).toEqual('item1--item2');
    expect(getUniqIdForGroupedIssues([
      { groupName: 'item2', items: [], url: 'nothing2' },
      { groupName: 'item1', items: [], url: 'nothing' },
    ])).toEqual('item2--item1');
  });
  it('Returns children and groupName', () => {
    expect(getUniqIdForGroupedIssues([
      { groupName: 'item1', items: [{ node_id: 'childA' }], url: 'nothing' },
      { groupName: 'item2', items: [], url: 'nothing2' },
    ])).toEqual('item1childA--item2');
    expect(getUniqIdForGroupedIssues([
      { groupName: 'item1', items: [{ node_id: 'child1A' }, { node_id: 'child1B' }], url: 'nothing' },
      { groupName: 'item2', items: [{ node_id: 'child2A' }], url: 'nothing2' },
    ])).toEqual('item1child1A-child1B--item2child2A');
  })
})
