import { IssueData } from '../../lib/types';
import { getFakeIssue } from '../utils/getFakeIssue';

export const testIssueData: IssueData = getFakeIssue({
      html_url: 'root',
      children: [
        getFakeIssue({
          html_url: 'child1',
          children: [
            getFakeIssue({
              html_url: 'child1-1',
              children: [
                getFakeIssue({
                  html_url: 'child1-1-1',
                }),
              ],
            }),
          ]
        }),
        getFakeIssue({
          html_url: 'child2',
          children: [
            getFakeIssue({
              html_url: 'child2-1',
              children: [
                getFakeIssue({
                  html_url: 'child2-1-1',
                }),
              ],
            }),
          ]
        }),
      ],
    });
