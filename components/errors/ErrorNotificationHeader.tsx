import { Box, Center, Flex, IconButton, Spacer, Text } from '@chakra-ui/react';
import {ChevronDownIcon, ChevronUpIcon, WarningTwoIcon} from '@chakra-ui/icons'

export interface ErrorNotificationHeaderProps {
  isExpanded: boolean;
  toggle: () => void;
}
export function ErrorNotificationHeader({isExpanded, toggle}: ErrorNotificationHeaderProps) {

  const ariaLabel = isExpanded ? 'Collapse' : 'Expand';
  const iconWandH = 8;
  const icon = isExpanded
    ? <ChevronDownIcon width={iconWandH} height={iconWandH} cursor="pointer" onClick={toggle} />
    : <ChevronUpIcon width={iconWandH} height={iconWandH} cursor="pointer" onClick={toggle} />;
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
          <Text fontSize="20">Issues with roadmap</Text>
        </Center>
        <Spacer />
        {icon}
      </Flex>

    </Box>
  );
}
