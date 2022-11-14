import { useRouter } from 'next/router';
import Image from 'next/image';
import { Link, Text, Flex, Spacer, Center } from '@chakra-ui/react';
import NextLink from 'next/link'

import themes from '../theme/constants';
import GitHubSvgIcon from '../icons/GitHubLogo.svg';
import { IssueData } from '../../lib/types';

export default function Header({ issueData }: { issueData: IssueData }) {
  const router = useRouter();

  const changeToView = router.query.view === 'detail' ? 'simple' : 'detail';

  return (
    <>
      <Text mb='8px' fontSize={14}>
        <Link
          color='blue.500'
          onClick={() => {
            router.push({
              pathname: '/roadmap/[...slug]',
              query: { view: changeToView, slug: router.query.slug },
            });
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
