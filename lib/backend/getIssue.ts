import {octokit} from './octokit'

const infoFromUrl = (url) => {
  console.log('infoFromUrl | url ->', url);
  const urlSplit = new URL(url).pathname.split('/');
  return { owner: urlSplit[1], repo: urlSplit[2], issue_number: Number(urlSplit[4]) };
};

const getIssue = async (url: string) => {
  const { owner, repo, issue_number } = infoFromUrl(url);

  if (!owner || !repo || !issue_number) {
    throw new Error(`Could not obtain owner, repo, or issue_number from url '${url}'`);
  };

  try {

    const { data } = await octokit.rest.issues.get({
      mediaType: {
        format: 'html',
      },
      owner,
      repo,
      issue_number,
    });

    return data;
  } catch (err) {
    console.error('error getting github issue: ', err)
    throw err
  }
};
export {getIssue}
