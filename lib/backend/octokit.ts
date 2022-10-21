import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { Octokit } from '@octokit/rest';

const auth = process.env.PLN_ADMIN_GITHUB_TOKEN;
// console.log(`auth: `, auth);
if (!auth) {
  throw new Error('PLN_ADMIN_GITHUB_TOKEN environmental variable not set. It is required.');
}

const RetryableOctokit = Octokit.plugin(retry, throttling);

const octokit = new RetryableOctokit({
  auth,
  throttle: {
    onRateLimit: (retryAfter, options, octokit) => {
      octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

      // retry forever
      octokit.log.info(`Retrying after ${retryAfter} seconds!`);
      return true;
    },
    onSecondaryRateLimit: (retryAfter, options, octokit) => {
      octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);

      // retry forever
      octokit.log.info(`Retrying after ${retryAfter} seconds!`);
      return true;
    },
  },
});

export { octokit };
