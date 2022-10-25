import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Input } from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';

import { setIsLoading, useIsLoading } from '../../hooks/useIsLoading';
import { paramsFromUrl, slugsFromUrl } from '../../utils/general';

export function RoadmapForm() {
  const router = useRouter();
  const [currentIssueUrl, setCurrentIssueUrl] = useState<string | null>(null);
  const [issueUrl, setIssueUrl] = useState<string | null>();
  const [error, setError] = useState();

  useEffect(() => {
    console.log('inside useEffect()!');
    setIsLoading(true);
    if (router.isReady) {
      if (!issueUrl) return;

      const { owner, repo, issue_number } = paramsFromUrl(issueUrl);
      router.push(`/roadmap-test/github.com/${owner}/${repo}/issues/${issue_number}`).then(() => {
        // setIssueUrl(null);
        setIsLoading(false);
      });
    }
  }, [issueUrl]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // setIsLoading(true);

          try {
            if (currentIssueUrl == null) {
              throw new Error('currentIssueUrl is null');
            }
            const newUrl = new URL(currentIssueUrl);
            setIssueUrl(newUrl.toString());
          } catch (err: any) {
            setError(err);
            // setIsLoading(false);
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
        />
      </form>
    </>
  );
}

function PageHeader() {
  return (
    <>
      <span>Planetarium</span>
      <RoadmapForm />
    </>
  );
}

function App() {
  const isLoading = useIsLoading();
  const rootIssue = '';
  const parentIssue = '';
  const currentIssue = '';

  useEffect(() => {
    console.log('isLoading changed:', isLoading);
  }, [isLoading]);

  return (
    <>
      <PageHeader />
      {!!isLoading && <span>Loading...</span>}
    </>
  );
}

export default App;
