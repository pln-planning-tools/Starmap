import { Center, Flex, Link, Spacer, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';

import { ReactElement } from 'react-markdown/lib/react-markdown';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';
import { IssueDataViewInput } from '../../lib/types';
import GitHubSvgIcon from '../icons/GitHubLogo.svg';
import themes from '../theme/constants';

export default function Header({
  issueDataState
}: IssueDataViewInput): ReactElement | null {
  const globalLoadingState = useGlobalLoadingState();
  if (issueDataState.html_url.value == null || typeof issueDataState.html_url.value !== 'string') {
    console.log('error with issueData', issueDataState.get({ noproxy: true }))
    return null;
  }

  return (
    <>
      <Flex direction={'row'} lineHeight={1} >
          <Text as='span' fontSize={24} fontWeight={600} pr="5rem">
            {issueDataState.title.value} {globalLoadingState.get() ? <Spinner /> : null}
          </Text>
        <Spacer />
        <Center>
          <NextLink style={{ display: 'span' }} passHref href={issueDataState.get().html_url}>
            <Link target="_blank" rel="noopener noreferrer">
              <Center minWidth="9rem">
                <Text as='span' fontSize={15} fontWeight={400} color={themes.light.text.color} pr="0.5rem">View in GitHub</Text>
                <Image src={GitHubSvgIcon} alt="GitHub Logo" color={themes.light.text.color} width={24} height={24} />
              </Center>
            </Link>
          </NextLink>
        </Center>
      </Flex>
    </>
  );
}
