import { IssueData } from '../../lib/types';
import { getFakeIssue } from '../utils/getFakeIssue';

export const testIssueData: IssueData = getFakeIssue({
      html_url: 'root',
      children: [
        getFakeIssue({
          html_url: 'childA',
          children: [
            getFakeIssue({
              html_url: 'childA-1',
              children: [
                getFakeIssue({
                  html_url: 'childA-1-a',
                }),
              ],
            }),
          ]
        }),
        getFakeIssue({
          html_url: 'childB',
          children: [
            getFakeIssue({
              html_url: 'childB-1',
              children: [
                getFakeIssue({
                  html_url: 'childB-1-a',
                }),
              ],
            }),
          ]
        }),
      ],
    });
