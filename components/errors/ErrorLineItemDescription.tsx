import { Box, Text } from '@chakra-ui/react'
import { ImmutableObject } from '@hookstate/core'

import { StarMapsIssueErrorsGrouped } from '../../lib/types'
import styles from './ErrorLineItemDescription.module.css'

export function ErrorLineItemDescription ({ error }: {error: ImmutableObject<StarMapsIssueErrorsGrouped>}) {
  return (
    <Box>
        {error.errors.map((errItem, index) => (
            <Text as="span" width="auto" key={index} className={styles.errorIssueDescriptionText}>&nbsp;{errItem.message};</Text>
        ))}
    </Box>
  )
}
