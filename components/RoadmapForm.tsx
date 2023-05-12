import { Router, useRouter } from 'next/router';
import { Button, FormControl, FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react';

import { useGlobalLoadingState } from '../hooks/useGlobalLoadingState';
import styles from './RoadmapForm.module.css'
import theme from './theme/constants'
import { setCurrentIssueUrl, useCurrentIssueUrl } from '../hooks/useCurrentIssueUrl';
import { paramsFromUrl } from '../lib/paramsFromUrl';
import { getValidUrlFromInput } from '../lib/getValidUrlFromInput';
import { useViewMode } from '../hooks/useViewMode';
import { ViewMode } from '../lib/enums';
import { isEmpty } from 'lodash';
import useCheckMobileScreen from '../hooks/useCheckSmallScreen';

export function RoadmapForm() {
  const router = useRouter();
  const globalLoadingState = useGlobalLoadingState();
  const currentIssueUrl = useCurrentIssueUrl();
  const [issueUrl, setIssueUrl] = useState<string | null>();
  const [error, setError] = useState<Error | null>(null);
  const [isInputBlanked, setIsInputBlanked] = useState<boolean>(false);
  const [isSmallScreen] = useCheckMobileScreen();
  const viewMode = useViewMode() as ViewMode;

  useEffect(() => {
    if (!isInputBlanked && isEmpty(currentIssueUrl) && window.location.pathname.length > 1) {
      try {
        const urlObj = getValidUrlFromInput(window.location.pathname.replace('/roadmap', ''));
        setCurrentIssueUrl(urlObj.toString());
      } catch {}
    }
  }, [currentIssueUrl, isInputBlanked])

  useEffect(() => {
    const asyncFn = async () => {
      if (router.isReady) {
        if (!issueUrl) return;
        try {
          const params = paramsFromUrl(issueUrl);
          if (params) {
            const { owner, repo, issue_number } = params;
            setIssueUrl(null);
            if (window.location.pathname.includes(`github.com/${owner}/${repo}/issues/${issue_number}`)) {
              setTimeout(() => {
                /**
                 * Clear the error after a few seconds.
                 */
                setError(null);
              }, 5000);
              throw new Error('Already viewing this issue');
            }
            await router.push(`/roadmap/github.com/${owner}/${repo}/issues/${issue_number}#${viewMode}`);
            globalLoadingState.stop();
          }
        } catch (err) {
          setError(err as Error);
          globalLoadingState.stop();
        }
      }
    };
    asyncFn();
  }, [router, issueUrl, viewMode, globalLoadingState]);

  const formSubmit = (e) => {
    e.preventDefault();
    globalLoadingState.start();
    setError(null);

    try {
      if (currentIssueUrl == null) {
        throw new Error('currentIssueUrl is null');
      }
      const newUrl = getValidUrlFromInput(currentIssueUrl);
      setIssueUrl(newUrl.toString());
    } catch (err) {
      setError(err as Error);
      globalLoadingState.stop();
    }
  }

  const inputRightElement = (
    <Button type="submit" isLoading={globalLoadingState.get()} className={styles.formSubmitButton} border="1px solid #8D8D8D" borderRadius="4px"  bg="rgba(141, 141, 141, 0.3)" onClick={formSubmit}>
      <Text p="6px 10px" color="white">⏎</Text>
    </Button>
  );

  const onChangeHandler = (e) => {
    setIsInputBlanked(true);
    setCurrentIssueUrl(e.target.value ?? '')
  };

  Router.events.on('routeChangeStart', (...events) => {
    globalLoadingState.start();
    const path = events[0];
    if (path === '/') {
      setIsInputBlanked(true);
      setCurrentIssueUrl('');
      return;
    }
    const currentUrl = getValidUrlFromInput(path.split('#')[0].replace('/roadmap/', ''));
    currentUrl.searchParams.delete('crumbs');
    setCurrentIssueUrl(currentUrl.toString());
  });

  return (
    isSmallScreen ?
      <SearchIcon color='#FFFFFF' /> :
      <form onSubmit={formSubmit}>
        <FormControl isInvalid={error != null} isDisabled={globalLoadingState.get()}>
          <InputGroup>
            <InputLeftElement pointerEvents='none'><SearchIcon color='#FFFFFF' /></InputLeftElement>
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
            <InputRightElement cursor="pointer">{inputRightElement}</InputRightElement>
          </InputGroup>
          <FormErrorMessage>{error?.message}</FormErrorMessage>
        </FormControl>
      </form>
  );
}
