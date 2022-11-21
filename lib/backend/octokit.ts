import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { Octokit } from '@octokit/rest';

const auth = process.env.PLN_ADMIN_GITHUB_TOKEN;
if (!auth) {
  throw new Error('PLN_ADMIN_GITHUB_TOKEN environmental variable not set. It is required.');
}

const maxRetryAfterMinutes = 1;
const RetryableOctokit = Octokit.plugin(retry, throttling);

const octokit = new RetryableOctokit({
  auth,
  throttle: {
    onRateLimit: (retryAfter, options, octokit, retryCount) => {
      octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

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

export { octokit };
