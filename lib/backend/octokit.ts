import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { Octokit } from '@octokit/rest';
import {knuthShuffle} from 'knuth-shuffle';


const authTokens = new Map<string, boolean>();
const potentialTokens = [
  process.env.PLN_ADMIN_GITHUB_TOKEN,
  process.env.PLN_ADMIN_GITHUB_TOKEN2,
  process.env.PLN_ADMIN_GITHUB_TOKEN3,
];

if (potentialTokens.filter((t: string | undefined) => t != null).length === 0) {
  console.error('You need to set `PLN_ADMIN_GITHUB_TOKEN`, `PLN_ADMIN_GITHUB_TOKEN1`, and/or `PLN_ADMIN_GITHUB_TOKEN3`')
  throw new Error('PLN_ADMIN_GITHUB_TOKEN environmental variable not set. It is required.');
}
potentialTokens.forEach((token: string | undefined) => {
  if (token != null) {
    authTokens.set(token, true);
  }
})

const maxRetryAfterMinutes = 1;
const RetryableOctokit = Octokit.plugin(retry, throttling);


function getValidAuthToken(): string {
  const validAuthTokens: string[] = []
  // find all authTokens with value of true
  for (const [token, isValid] of authTokens.entries()) {
    if (isValid) {
      validAuthTokens.push(token);
    }
  }

  return knuthShuffle(validAuthTokens)[0];
}

function getOctokit() {
  const currentAuthToken = getValidAuthToken();
  return new RetryableOctokit({
    auth: currentAuthToken,
    throttle: {
      onRateLimit: (retryAfter, options, octokit, retryCount) => {
        octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

        if (retryAfter / 60 > maxRetryAfterMinutes) {
          authTokens.set(currentAuthToken, false);
          throw new Error(`RetryAfter is over ${maxRetryAfterMinutes} minutes. Aborting.`);
        }
        if (retryCount < 2) {
          // retry 2 times
          octokit.log.warn(`Retrying after ${retryAfter} seconds!`);
          return true;
        } else {
          throw new Error('Request quota exceeded after two retries.')
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit, retryCount) => {
        octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);

        if (retryAfter / 60 > maxRetryAfterMinutes) {
          throw new Error(`RetryAfter is over ${maxRetryAfterMinutes} minutes. Aborting.`);
        }
        if (retryCount < 2) {
          // retry 2 times
          octokit.log.warn(`Retrying after ${retryAfter} seconds!`);
          return true;
        } else {
          throw new Error('Request quota exceeded after two retries.')
        }
      },
    },
  });
}

export { getOctokit };
