import { Box, Flex, Spacer, Text, Image, Center } from '@chakra-ui/react';

import { RoadmapForm } from '../RoadmapForm';
import theme from '../theme/constants'
import SvgStarMapsLogo from '../icons/svgr/StarMapsLogo'
import styles from './PageHeader.module.css';

function PageHeader() {
  return (
    <Flex direction={'row'} bg={theme.light.header.background.color} pl="120px" pr="120px">
      <Box pt={6} pb={6} textAlign={'center'} alignContent='center' verticalAlign='center'>
        <Center>
          <SvgStarMapsLogo width={45} height={45} className={styles.StarMapsLogo} />
          <Text fontSize={'24px'} as='span' color={theme.light.header.text.color}>Star</Text>
          <Text fontSize={'24px'} as='b' color={theme.light.header.text.color}>Maps</Text>
        </Center>
      </Box>
      <Spacer />
      <Center>
      <Box
        minW='33vw'
        maxW='45vw'
        color='white'
        textAlign={'center'}
        alignContent='center'
        verticalAlign='center'
      >
        <RoadmapForm />
      </Box>
        </Center>
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
