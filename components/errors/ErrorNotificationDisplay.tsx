import { Box, Center } from '@chakra-ui/react';
import type { State } from '@hookstate/core';
import React, { useMemo, useState } from 'react';

import { IssueData, StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorNotificationHeader } from './ErrorNotificationHeader';
import { ErrorNotificationBody } from './ErrorNotificationBody';
import { errorFilters } from '../../lib/client/errorFilters';
import { useViewMode } from '../../hooks/useViewMode';

interface ErrorNotificationDisplayProps {
  errors: StarMapsIssueErrorsGrouped[];
  issueDataState: State<IssueData | null>;
}

export function ErrorNotificationDisplay ({ errors, issueDataState }: ErrorNotificationDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const viewMode = useViewMode();
  const filteredErrors: StarMapsIssueErrorsGrouped[] = useMemo(() => {

    if (viewMode && issueDataState.value != null) {
      return errorFilters[viewMode](errors, issueDataState.value)
    }
    return errors;
  }, [errors, viewMode, issueDataState.value]);

  if (filteredErrors?.length === 0) {
    return null;
  }

  const handleToggle = () => setIsExpanded(!isExpanded);

  return <Center>
      <Box
        width="100%"
        pr={{ base:"30px", sm:"30px", md:"60px", lg:"120px" }}
        pl={{ base:"30px", sm:"30px", md:"60px", lg:"120px" }}
        pt="4rem"
        pb="1rem"
        padding="0.25rem"
      >
      <ErrorNotificationHeader isExpanded={isExpanded} toggle={handleToggle} errorCount={filteredErrors.length} />
        <ErrorNotificationBody isExpanded={isExpanded} errors={filteredErrors} />
      </Box>
  </Center>
}
