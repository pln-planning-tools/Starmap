import { writeFile } from 'fs/promises';
import { join } from 'path';
import { IssueData } from '../types';
import path from 'path';
import { fileURLToPath } from 'url';
import { paramsFromUrl } from '../paramsFromUrl';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
  /**
   * Save the finalIssueData to a file with the owner, repo, and issue number as name
   */
export function saveIssueDataToFile(finalIssueData: IssueData) {
  /**
   * Get the owner, repo, and issue_number from the issue's html_url using paramsFromUrl
   */
  const { owner, repo, issue_number } = paramsFromUrl(finalIssueData.html_url);

  const pathToSaveFiles = join(__dirname, '..', '..', 'tests', 'fixtures', 'issueData');
  const fileName = `${owner}-${repo}-${issue_number}.json`;
  const filePath = join(pathToSaveFiles, fileName);

  writeFile(filePath, JSON.stringify(finalIssueData, null, 2)).catch((err) => {
    console.error(`Error writing file ${filePath}`, err);
  });
  // throw new Error('Function not implemented.');
}
