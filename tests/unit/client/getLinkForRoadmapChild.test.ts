/**
 * @jest-environment jsdom
 */
import { getLinkForRoadmapChild } from '../../../lib/client/getLinkForRoadmapChild';
import { getCrumbStringFromIssueData } from '../../../lib/breadcrumbs';
import { IssueData } from '../../../lib/types';
import { getFakeIssue } from '../../utils/getFakeIssue';

describe('getLinkForRoadmapChild', function() {
  let parent: IssueData;
  let parentDetached: IssueData;
  let child: IssueData;
  let grandchild: IssueData;
  beforeEach(function() {
    parent = getFakeIssue({ html_url: 'https://github.com/orgNameA/repoNameA/issues/1', title: 'root' });
    child = getFakeIssue({ html_url: 'https://github.com/orgNameB/repoNameB/issues/2', title: 'child', parent });
    parent.children.push(child);
    grandchild = getFakeIssue({ html_url: 'https://github.com/orgNameC/repoNameC/issues/3', title: 'grandchild', parent: child });
    child.children.push(grandchild);

    parentDetached = getFakeIssue({ html_url: 'https://github.com/orgNameD/repoNameD/issues/4', title: 'root-detached' });
  });

  describe('returns hash', function() {
    it('issueData is nullish', () => {
      expect(getLinkForRoadmapChild({ issueData: null as unknown as IssueData })).toEqual('#');
      expect(getLinkForRoadmapChild({ issueData: undefined as unknown as IssueData })).toEqual('#');
    });

    it('it has no children', () => {
      expect(getLinkForRoadmapChild({ issueData: grandchild })).toEqual('#');
    });
  });

  describe('returns path with no crumb', function() {
    it('issueData has children and no parent', () => {
      // @ts-expect-error
      delete child.parent
      expect(getLinkForRoadmapChild({ issueData: child })).toEqual('/roadmap/github.com/orgNameB/repoNameB/issues/2');
    });
  });

  describe('returns path with crumb(s)', function() {
    it('issueData has children and parent', () => {
      const expectedCrumbs = encodeURIComponent(getCrumbStringFromIssueData(parent));
      const expectedLink = `/roadmap/github.com${new URL(child.html_url).pathname}?crumbs=${expectedCrumbs}`
      expect(getLinkForRoadmapChild({ issueData: child })).toEqual(expectedLink);
    });

    it('issueData has children and no parent, but with currentRoadmapRoot', () => {
      // @ts-expect-error
      delete child.parent
      const expectedCrumbs = encodeURIComponent(getCrumbStringFromIssueData(parentDetached));
      const expectedLink = `/roadmap/github.com${new URL(child.html_url).pathname}?crumbs=${expectedCrumbs}`
      expect(getLinkForRoadmapChild({ issueData: child, currentRoadmapRoot: parentDetached })).toEqual(expectedLink);
    });

    it('issueData has children and parent and current crumbs', () => {
      const currentUrlCrumbs = getCrumbStringFromIssueData(parentDetached);
      const parentCrumbs = getCrumbStringFromIssueData(parent);
      const expectedCrumbs = encodeURIComponent([currentUrlCrumbs, parentCrumbs].join(','));
      const expectedLink = `/roadmap/github.com${new URL(child.html_url).pathname}?crumbs=${expectedCrumbs}`
      expect(getLinkForRoadmapChild({ issueData: child, query: { crumbs: encodeURIComponent(currentUrlCrumbs) } })).toEqual(expectedLink);
    });
  });

})
