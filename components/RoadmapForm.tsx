import { useRouter } from 'next/router';
import { Box, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Text } from '@chakra-ui/react';
import { ArrowForwardIcon, SearchIcon } from '@chakra-ui/icons'
import { match } from 'path-to-regexp';
import { useEffect, useState } from 'react';

import { setIsLoading, useIsLoading } from '../hooks/useIsLoading';
import styles from './RoadmapForm.module.css'
import theme from './theme/constants'
import { setCurrentIssueUrl, useCurrentIssueUrl } from '../hooks/useCurrentIssueUrl';
import { isEmpty } from 'lodash';

const slugsFromUrl: any = (url) => {
  const matchResult = match('/:owner/:repo/issues/:issue_number(\\d+)', {
    decode: decodeURIComponent,
  })(url);

  return matchResult;
};

export function RoadmapForm() {
  const router = useRouter();
  const isLoading = useIsLoading();
  const currentIssueUrl = useCurrentIssueUrl();
  const [issueUrl, setIssueUrl] = useState<string | null>();
  const [error, setError] = useState();

  useEffect(() => {
    if (isEmpty(currentIssueUrl)) {
      const urlMatchParams = slugsFromUrl(window.location.pathname.replace('/roadmap/github.com', ''))?.params
      if (urlMatchParams != null) {
        const { owner, repo, issue_number } = urlMatchParams;
        setCurrentIssueUrl(`https://github.com/${owner}/${repo}/issues/${issue_number}`);
      }

    }
  }, [currentIssueUrl, slugsFromUrl])

  useEffect(() => {
    if (router.isReady) {
      if (!issueUrl) return;
      const { owner, repo, issue_number } = slugsFromUrl(new URL(issueUrl).pathname).params;
      setIssueUrl(null);
      router.push(`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}`).then(() => setIsLoading(false));
    }
  }, [router, issueUrl, setCurrentIssueUrl]);

  const formSubmit = (e) => {
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
  }

  let inputRightElement = (
    <Box className={styles.formSubmitButton} border="1px solid #8D8D8D" borderRadius="4px"  bg="rgba(141, 141, 141, 0.3)" onClick={formSubmit}>
      <Text p="6px 10px" color="white">⏎</Text>
    </Box>
  )
  if (isLoading) {
    inputRightElement = <Spinner />
  }
  return (
    <>
      <form
        onSubmit={formSubmit}
      >
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='#FFFFFF' />}
          />
          <Input
            value={currentIssueUrl}
            className={styles.urlInput}
            color={theme.light.header.input.text.color}
            aria-label='Issue URL'
            name='issue-url'
            autoComplete='url'
            onChange={(e) => setCurrentIssueUrl(e.target.value)}
            placeholder='https://github.com/...'
            bg={theme.light.header.input.background.color}
            borderColor={theme.light.header.input.border.color}
            borderRadius={theme.light.header.input.border.radius}
          />
          <InputRightElement cursor="pointer" children={inputRightElement}/>
        </InputGroup>
      </form>
    </>
  );
}
