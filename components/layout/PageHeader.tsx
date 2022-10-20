import { Flex, FormControl, FormLabel, Switch, Box, Spacer, Heading} from '@chakra-ui/react'

import { RoadmapForm } from '../RoadmapForm'

function PageHeader() {

  return (
    <Flex direction={'row'} bg='#BDBFF0'>
      <Box p={4}>
        <Heading as="span" paddingRight={'5px'}>MapLight</Heading>
      </Box>
      <Box minW="33vw" maxW="45vw" pt={6} color='white' textAlign={'center'} alignContent="center" verticalAlign="center">
        <RoadmapForm/>
      </Box>
      <Spacer />
      <Box pt={6} color='white' textAlign={'center'} alignContent="center" verticalAlign="center">
        <FormControl>
          <FormLabel htmlFor='isDetailedView' display='inline' textAlign='right'>
            Detailed view:
          </FormLabel>
          <Switch id='isDetailedView' textAlign='right' />
        </FormControl>
      </Box>
    </Flex>
  )
}

export default PageHeader
