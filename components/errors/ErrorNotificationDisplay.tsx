import { Box, Center } from '@chakra-ui/react';
import type { State } from '@hookstate/core';
import React, { useState } from 'react';

import { IssueData, StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorNotificationHeader } from './ErrorNotificationHeader';
import { ErrorNotificationBody } from './ErrorNotificationBody';
import { errorFilters } from '../../lib/client/errorFilters';
import { useViewMode } from '../../hooks/useViewMode';

export interface ErrorNotificationDisplayProps {
  errors: StarMapsIssueErrorsGrouped[];
  issueDataState: State<IssueData | null>;
}

export function ErrorNotificationDisplay ({ errors, issueDataState }: ErrorNotificationDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const viewMode = useViewMode();
  let filteredErrors: StarMapsIssueErrorsGrouped[] = errors;
  if (viewMode && issueDataState.value != null) {
    filteredErrors = errorFilters[viewMode](errors, issueDataState.value)
  }

  if (filteredErrors?.length === 0) {
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
        <ErrorNotificationBody isExpanded={isExpanded} errors={filteredErrors} />
      </Box>
  </Center>
}
