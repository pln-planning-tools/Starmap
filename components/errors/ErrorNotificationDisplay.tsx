import { Box, Button, Center, Collapse, IconButton } from '@chakra-ui/react';
import {ChevronDownIcon} from '@chakra-ui/icons'
import { useState } from 'react';

import { StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorNotificationHeader } from './ErrorNotificationHeader';
import { ErrorNotificationBody } from './ErrorNotificationBody';

export interface ErrorNotificationDisplayProps {
  errors: StarMapsIssueErrorsGrouped[]
}
export function ErrorNotificationDisplay ({errors}: ErrorNotificationDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (errors == null || errors.length === 0) {
    return null;
  }

  const handleToggle = () => setIsExpanded(!isExpanded);

  return <Center>
      <Box
        width="100%"
        pr="120px"
        pl="120px"
        pt="4rem"
        pb="1rem"
      >
        <ErrorNotificationHeader isExpanded={isExpanded} toggle={handleToggle} />
        <ErrorNotificationBody isExpanded={isExpanded} errors={errors} />
      </Box>
  </Center>
}
