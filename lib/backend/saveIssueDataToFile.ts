import { writeFile, readFile } from 'fs/promises';
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
  if (process.env.IS_LOCAL !== 'true' || process.env.ENABLE_ISSUEDATA_SAVING !== 'true') {
    return;
  }
  /**
   * Get the owner, repo, and issue_number from the issue's html_url using paramsFromUrl
   */
  const { owner, repo, issue_number } = paramsFromUrl(finalIssueData.html_url);

  const pathToSaveFiles = join(__dirname, '..', '..', 'tests', 'fixtures', 'issueData');
  const fileName = `${owner}-${repo}-${issue_number}.json`;
  const filePath = join(pathToSaveFiles, fileName);
  console.log(`Saving ${owner}/${repo}#${issue_number} issueData to ${filePath}`);
  writeFile(filePath, JSON.stringify(finalIssueData, null, 2)).catch((err) => {
    console.error(`Error writing file ${filePath}`, err);
  });
  // throw new Error('Function not implemented.');
}

export async function checkForSavedIssueData({ owner, repo, issue_number }): Promise<IssueData> {
  if (process.env.IS_LOCAL !== 'true' || process.env.ENABLE_ISSUEDATA_READING !== 'true') {
    throw new Error('checkForSavedIssueData not enabled. Check that IS_LOCAL and ENABLE_ISSUEDATA_READING are set to true');
  }

  const pathToSaveFiles = join(__dirname, '..', '..', 'tests', 'fixtures', 'issueData');
  const fileName = `${owner}-${repo}-${issue_number}.json`;
  const filePath = join(pathToSaveFiles, fileName);
  try {
    const issueData = await readFile(filePath, 'utf8');
    return JSON.parse(issueData);
  } catch (err) {
    throw new Error(`Error reading file ${filePath}: ${(err as Error).toString()}`);
  }

  // throw new Error('Function not implemented.');
}
