import { ChevronDownIcon, ChevronUpIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { Box, Center, Flex, Spacer, Spinner, Text } from '@chakra-ui/react'
import React from 'react'

import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState'

interface ErrorNotificationHeaderProps {
  isExpanded: boolean;
  toggle: () => void;
  errorCount: number;
}
export function ErrorNotificationHeader ({ isExpanded, toggle, errorCount }: ErrorNotificationHeaderProps) {
  const globalLoadingState = useGlobalLoadingState()

  const iconWandH = 8
  const icon = isExpanded
    ? <ChevronDownIcon width={iconWandH} height={iconWandH} cursor="pointer" onClick={toggle} />
    : <ChevronUpIcon width={iconWandH} height={iconWandH} cursor="pointer" onClick={toggle} />
  return (
    <Box
      bg="#F8FBFF"
      border="1px solid #DDE8EC"
      borderRadius="5px 5px 0 0"
      // color="white"
      fontWeight="semibold"
      px={4}
      py={3}
      textAlign="center"
    >
      <Flex>
        <Center>
          <WarningTwoIcon color="#F39106" ml="1rem" mr="1rem" width={iconWandH} height={iconWandH} />
          <Text fontSize="20">{errorCount} issue{errorCount > 1 && 's'} with roadmap</Text>
          {globalLoadingState.get() ? <Spinner ml="1rem" /> : null}
        </Center>
        <Spacer />
        {icon}
      </Flex>

    </Box>
  )
}
