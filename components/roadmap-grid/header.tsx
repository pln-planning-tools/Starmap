import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Link, Text } from '@chakra-ui/react';

import { IssueData } from '../../lib/types';

export default function Header({ issueData }: { issueData: IssueData }) {
  const router = useRouter();

  // console.log('router.query:', router.query);

  // const view = (router.query.view === 'simple' && 'detail') || (!router.query.view && 'detail') || 'simple';

  const changeToView = router.query.view === 'detail' ? 'simple' : 'detail';

  return (
    <>
      <Text as='span' mb='8px' fontSize={14}>
        {/* <NextLink href='?view=detail' passHref>
          <Link color='blue.500'>Switch to detailed view</Link>
        </NextLink> */}
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
      <br />
      <Text as='span' mb='8px' fontSize={40} fontWeight={600}>
        {issueData.title}
      </Text>
    </>
  );
}
