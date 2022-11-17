import { useRouter } from 'next/router';
import { Button, FormControl, FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import { match } from 'path-to-regexp';
import { useEffect, useState } from 'react';

import { setIsLoading, useIsLoading } from '../hooks/useIsLoading';
import styles from './RoadmapForm.module.css'
import theme from './theme/constants'
import { setCurrentIssueUrl, useCurrentIssueUrl } from '../hooks/useCurrentIssueUrl';
import { isEmpty } from 'lodash';
import { paramsFromUrl } from '../lib/paramsFromUrl';
import { getValidUrlFromInput } from '../lib/getValidUrlFromInput';

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
  const [error, setError] = useState<Error | null>(null);
  const [isInputBlanked, setIsInputBlanked] = useState<boolean>(false);

  useEffect(() => {
    if (!isInputBlanked && isEmpty(currentIssueUrl) && window.location.pathname.length > 1) {
      try {
        const urlObj = getValidUrlFromInput(window.location.pathname.replace('/roadmap', ''));
        setCurrentIssueUrl(urlObj.toString());
      } catch {}
    }
  }, [currentIssueUrl, getValidUrlFromInput, setCurrentIssueUrl])

  useEffect(() => {
    if (router.isReady) {
      if (!issueUrl) return;
      try {
        const { owner, repo, issue_number } = paramsFromUrl(issueUrl);
        setIssueUrl(null);
        router.push(`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}`).then(() => setIsLoading(false));
      } catch (err){
        setError(err as Error);
        setIsLoading(false);
      }
    }
  }, [router, issueUrl, setCurrentIssueUrl]);

  const formSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (currentIssueUrl == null) {
        throw new Error('currentIssueUrl is null');
      }
      const newUrl = getValidUrlFromInput(currentIssueUrl);
      setIssueUrl(newUrl.toString());
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }

  let inputRightElement = (
    <Button type="submit" isLoading={isLoading} className={styles.formSubmitButton} border="1px solid #8D8D8D" borderRadius="4px"  bg="rgba(141, 141, 141, 0.3)" onClick={formSubmit}>
      <Text p="6px 10px" color="white">⏎</Text>
    </Button>
  )
  if (isLoading) {
    inputRightElement = <Spinner />
  }
  const onChangeHandler = (e) => {
    setIsInputBlanked(true);
    setCurrentIssueUrl(e.target.value ?? '')
  };
  return (
    <form onSubmit={formSubmit}>
      <FormControl isInvalid={error != null}>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='#FFFFFF' />}
          />
          <Input
            type="text"
            value={currentIssueUrl}
            className={styles.urlInput}
            color={theme.light.header.input.text.color}
            aria-label='Issue URL'
            name='issue-url'
            autoComplete='url'
            onChange={onChangeHandler}
            placeholder='https://github.com/...'
            bg={theme.light.header.input.background.color}
            borderColor={theme.light.header.input.border.color}
            borderRadius={theme.light.header.input.border.radius}
          />
          <InputRightElement cursor="pointer" children={inputRightElement}/>
        </InputGroup>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
    </form>
  );
}
