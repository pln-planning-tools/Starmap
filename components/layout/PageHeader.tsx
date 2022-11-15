import { Box, Flex, Spacer, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import { RoadmapForm } from '../RoadmapForm';
import styles from './PageHeader.module.css'

function PageHeader() {
  return (
    <Flex direction={'row'} bg='#BDD8F0'>
      <Box className={styles.Logo} p={6} textAlign={'center'} alignContent='center' verticalAlign='center' paddingRight={'20px'}>
        <NextLink href="/" passHref>
          <Link>
            <Text fontSize={'xl'} as='span' className={styles['Logo-text']}>
              Starmaps
            </Text>
          </Link>
        </NextLink>
      </Box>
      <Box
        minW='33vw'
        maxW='45vw'
        pt={6}
        color='white'
        textAlign={'center'}
        alignContent='center'
        verticalAlign='center'
      >
        <RoadmapForm />
      </Box>
      <Spacer />
      {/* <Box pt={6} color='black' textAlign={'center'} alignContent='center' verticalAlign='center' pr={10}>
        <FormControl>
          <FormLabel htmlFor='isDetailedView' display='inline' textAlign='right'>
            Detailed view:
          </FormLabel>
          <Switch id='isDetailedView' textAlign='right' />
        </FormControl>
      </Box> */}
    </Flex>
  );
}

export default PageHeader;
