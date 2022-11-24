import Image from 'next/image';
import { Link, Text, Flex, Spacer, Center } from '@chakra-ui/react';
import NextLink from 'next/link'

import themes from '../theme/constants';
import GitHubSvgIcon from '../icons/GitHubLogo.svg';
import { IssueData } from '../../lib/types';
import { State } from '@hookstate/core';

export default function Header({ issueDataState }: { issueDataState: State<IssueData> }) {
  if (issueDataState.ornull == null) {
    return null;
  }
  if (issueDataState.html_url.get() == null || typeof issueDataState.html_url.get() !== 'string') {
    console.log('error with issueData', issueDataState.get())
    return null;
  }

  return (
    <>
      <Flex direction={'row'}>
        <Text as='span' mb='8px' fontSize={40} fontWeight={600} pr="5rem">
          {issueDataState.title.get()}
        </Text>
        <Spacer />
        <Center>
          <NextLink style={{display: 'span'}} passHref href={issueDataState.html_url.get()}>
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
