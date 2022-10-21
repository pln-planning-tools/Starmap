import { Flex, FormControl, FormLabel, Switch, Box, Spacer, Heading, Text} from '@chakra-ui/react'

import { RoadmapForm } from '../RoadmapForm'

function PageHeader() {

  return (
    <Flex direction={'row'} bg='#BDD8F0'>
      <Box p={6} textAlign={'center'} alignContent="center" verticalAlign="center" paddingRight={'15px'}>
        <Text fontSize={'xl'} as="span" >Planetarium</Text>
      </Box>
      <Box minW="33vw" maxW="45vw" pt={6} color='white' textAlign={'center'} alignContent="center" verticalAlign="center">
        <RoadmapForm/>
      </Box>
      <Spacer />
      <Box pt={6} color='black' textAlign={'center'} alignContent="center" verticalAlign="center" pr={10}>
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
