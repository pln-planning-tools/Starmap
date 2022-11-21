import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { Octokit } from '@octokit/rest';
import {knuthShuffle} from 'knuth-shuffle';

const auth1 = process.env.PLN_ADMIN_GITHUB_TOKEN;
const auth2 = process.env.PLN_ADMIN_GITHUB_TOKEN2;
const auth3 = process.env.PLN_ADMIN_GITHUB_TOKEN3;
if (!auth1 && !auth2 && !auth3) {
  console.error('You need to set `PLN_ADMIN_GITHUB_TOKEN`, `PLN_ADMIN_GITHUB_TOKEN1`, and/or `PLN_ADMIN_GITHUB_TOKEN3`')
  throw new Error('PLN_ADMIN_GITHUB_TOKEN environmental variable not set. It is required.');
}

const maxRetryAfterMinutes = 1;
const RetryableOctokit = Octokit.plugin(retry, throttling);

const authTokens = new Map<string, boolean>();

if (auth1 != null) {
  authTokens.set(auth1, true);
}
if (auth2 != null) {
  authTokens.set(auth2, true);
}
if (auth3 != null) {
  authTokens.set(auth3, true);
}

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
