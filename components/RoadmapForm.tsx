import { useRouter } from 'next/router';

import { Input } from '@chakra-ui/react';

import { match } from 'path-to-regexp';
import { useEffect, useState } from 'react';

import { setIsLoading } from '../hooks/useIsLoading';

// https://github.com/pln-roadmap/tests/issues/9
const slugsFromUrl: any = (url) => {
  const matchResult = match('/:owner/:repo/issues/:issue_number(\\d+)', {
    decode: decodeURIComponent,
  })(url);

  return matchResult;
};

export function RoadmapForm() {
  const router = useRouter();
  const [currentIssueUrl, setCurrentIssueUrl] = useState<string | null>(null);
  const [issueUrl, setIssueUrl] = useState<string | null>();
  const [error, setError] = useState();

  useEffect(() => {
    if (router.isReady) {
      if (!issueUrl) return;

      const { owner, repo, issue_number } = slugsFromUrl(new URL(issueUrl).pathname).params;
      setIssueUrl(null);
      router.push(`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}`).then(() => setIsLoading(false));
    }
  }, [router, issueUrl]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);

          try {
            if (currentIssueUrl == null) {
              throw new Error('currentIssueUrl is null');
            }
            const newUrl = new URL(currentIssueUrl);
            setIssueUrl(newUrl.toString());
          } catch (err: any) {
            setError(err);
            setIsLoading(false);
          }
        }}
      >
        <Input
          color={'black'}
          aria-label='Issue URL'
          name='issue-url'
          autoComplete='url'
          onChange={(e) => setCurrentIssueUrl(e.target.value)}
          placeholder='https://github.com/...'
          size='sm'
          bg='white'
          // TODO: round corners
        />
      </form>
    </>
  );
}
