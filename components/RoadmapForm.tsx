import { Input, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { match } from 'path-to-regexp';
import { useEffect, useState } from 'react';

// https://github.com/pln-roadmap/tests/issues/9
const urlMatch: any = (url) => {
  const matchResult = match('/:owner/:repo/issues/:issue_number(\\d+)', {
    decode: decodeURIComponent,
  })(url);
  return matchResult;
};

export function RoadmapForm() {
  const router = useRouter();
  const [currentIssueUrl, setCurrentIssueUrl] = useState<string | null>();
  const [issueUrl, setIssueUrl] = useState<string | null>();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (router.isReady) {
      if (isLoading === undefined) return;
      if (isLoading === true) setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    // console.log('/components/RoadmapForm.tsx | inside useEffect()');
    if (router.isReady) {
      // console.log('/components/RoadmapForm.tsx | inside useEffect() | router.isReady');
      if (!issueUrl) return;
      // setLoading(true);
      // console.log('/components/RoadmapForm.tsx | inside useEffect() | issueUrl');
      const { owner, repo, issue_number } = urlMatch(new URL(issueUrl).pathname).params;
      setIssueUrl(null);
      router.push(`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}`);
      // setLoading(false);
    }
  }, [router, issueUrl]);

  return (
    <>
      <h1>Roadmap</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const newUrl = new URL(currentIssueUrl);
            setIssueUrl(newUrl.toString());
            setLoading(true);
          } catch (err: any) {
            setError(err);
          }
        }}
      >
        <Text mb='8px'>GitHub URL: {issueUrl}</Text>
        <Input
          aria-label='Issue URL'
          name='issue-url'
          autoComplete='url'
          onChange={(e) => setCurrentIssueUrl(e.target.value)}
          placeholder='https://github.com/...'
          size='sm'
        />
      </form>
      {isLoading && (
        <>
          <Text>Loading...</Text>
        </>
      )}
    </>
  );
}
