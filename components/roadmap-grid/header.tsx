import Image from 'next/image';
import { Link, Text, Flex, Spacer, Center } from '@chakra-ui/react';
import NextLink from 'next/link'

import themes from '../theme/constants';
import GitHubSvgIcon from '../icons/GitHubLogo.svg';
import { IssueData } from '../../lib/types';
import { setViewMode, useViewMode } from '../../hooks/useViewMode';
import { ViewMode } from '../../lib/enums';

export default function Header({ issueData }: { issueData: IssueData }) {
  const viewMode = useViewMode();

  const changeToView = viewMode === ViewMode.Detail ? ViewMode.Simple : ViewMode.Detail;

  return (
    <>
      <Text mb='8px' fontSize={14}>
        <Link
          color='blue.500'
          onClick={() => {
            setViewMode(changeToView);
          }}
        >
          Switch to {changeToView} view
        </Link>
      </Text>
      <Flex direction={'row'}>
        <Text as='span' mb='8px' fontSize={40} fontWeight={600}>
          {issueData.title}
        </Text>
        <Spacer />
        <Center>
          <NextLink style={{display: 'span'}} passHref href={issueData.html_url}>
            <Link target="_blank" rel="noopener noreferrer">
              <Center>
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
