import { Box, Center } from '@chakra-ui/react'
import type { ImmutableArray, State } from '@hookstate/core'
import React, { useMemo, useState } from 'react'

import { IssueData, StarMapsIssueErrorsGrouped } from '../../lib/types'
import { ErrorNotificationHeader } from './ErrorNotificationHeader'
import { ErrorNotificationBody } from './ErrorNotificationBody'
import { errorFilters } from '../../lib/client/errorFilters'
import { useViewMode } from '../../hooks/useViewMode'

interface ErrorNotificationDisplayProps {
  errorsState: State<StarMapsIssueErrorsGrouped[]>;
  issueDataState: State<IssueData | null>;
}

export function ErrorNotificationDisplay ({ errorsState, issueDataState }: ErrorNotificationDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const viewMode = useViewMode()
  const filteredErrors: ImmutableArray<StarMapsIssueErrorsGrouped> = useMemo(() => {
    if (errorsState.ornull == null) {
      return []
    }
    const errors = errorsState.ornull.value
    if (viewMode != null && issueDataState.ornull != null && errorFilters[viewMode] != null) {
      return errorFilters[viewMode](errors, issueDataState.ornull.value)
    }
    return errors
  }, [errorsState.ornull, viewMode, issueDataState.ornull])

  if (filteredErrors?.length === 0) {
    return null
  }

  const handleToggle = () => setIsExpanded(!isExpanded)

  return <Center>
      <Box
        width="100%"
        pr={{ base: '30px', sm: '30px', md: '60px', lg: '120px' }}
        pl={{ base: '30px', sm: '30px', md: '60px', lg: '120px' }}
        pt="2rem"
        pb="1rem"
      >
      <ErrorNotificationHeader isExpanded={isExpanded} toggle={handleToggle} errorCount={filteredErrors.length} />
        <ErrorNotificationBody isExpanded={isExpanded} errors={filteredErrors} />
      </Box>
  </Center>
}
