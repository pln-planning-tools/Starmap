import { Box, Flex, Spacer, Text, Center, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { RoadmapForm } from '../RoadmapForm';
import theme from '../theme/constants'
import SvgStarMapsLogo from '../icons/svgr/StarMapsLogo'
import styles from './PageHeader.module.css';
import { ErrorBoundary } from '../errors/ErrorBoundary';

function PageHeader() {
  return (
    <Flex direction={'row'} bg={theme.light.header.background.color} pl="120px" pr="120px">
      <Box pt={6} pb={6} className={styles.Logo} textAlign={'center'} alignContent='center' verticalAlign='center'>

      <ErrorBoundary>
        <NextLink href="/" passHref>
          <Link className="js-headerLogo">
            <Center>
              <SvgStarMapsLogo width={45} height={45} className={styles.StarMapsLogo} />
              <Text fontSize={'24px'} as='span' color={theme.light.header.text.color}>Star</Text>
              <Text fontSize={'24px'} as='b' color={theme.light.header.text.color}>Maps</Text>
            </Center>
          </Link>
        </NextLink>
      </ErrorBoundary>
      </Box>
      <Spacer />
      <Center>
        <Box
          className={styles.pageHeaderInput}
        >
          <RoadmapForm />
        </Box>
      </Center>
    </Flex>
  );
}

export default PageHeader;
