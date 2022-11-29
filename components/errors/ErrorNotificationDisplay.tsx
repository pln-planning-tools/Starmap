import { Box, Center } from '@chakra-ui/react';
import { useState } from 'react';

import { StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorNotificationHeader } from './ErrorNotificationHeader';
import { ErrorNotificationBody } from './ErrorNotificationBody';

export interface ErrorNotificationDisplayProps {
  errors: StarMapsIssueErrorsGrouped[]
}
export function ErrorNotificationDisplay ({ errors }: ErrorNotificationDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
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
