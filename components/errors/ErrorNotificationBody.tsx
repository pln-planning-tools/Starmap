import { Box, SimpleGrid, Text, Link } from '@chakra-ui/react'
import { ImmutableArray } from '@hookstate/core'
import NextLink from 'next/link'

import { StarMapsIssueErrorsGrouped } from '../../lib/types'
import { ErrorLineItemDescription } from './ErrorLineItemDescription'
import styles from './ErrorNotificationBody.module.css'

interface ErrorNotificationBodyProps {
  isExpanded: boolean;
  errors: ImmutableArray<StarMapsIssueErrorsGrouped>;
}
export function ErrorNotificationBody ({ isExpanded, errors }: ErrorNotificationBodyProps) {
  if (!isExpanded) {
    return null
  }
  return <Box className={styles.errorNotificationBody}>
    <Box className={styles.errorNotificationBodyHeader}>
      <SimpleGrid columns={2} spacing={0} width="100%">
        <Text as="b" ml="1rem">Link</Text>
        <Text as="b">Description of Error(s)</Text>
        {errors.map((error, index) => (
            <Box key={index} className={styles.errorLineItemWrapper} width="auto">
              <Box className={`${styles.errorIssueLinkText} ${styles.errorIssueLinkWrapper}`}>
                <NextLink passHref href={error.issueUrl}>
                  <Link width="15rem" target="_blank" rel="noopener noreferrer">
                    <Text ml="1rem">{error.issueTitle}</Text>
                  </Link>
                </NextLink>
              </Box>
              <ErrorLineItemDescription error={error} />
            </Box>
        ))}
      </SimpleGrid>
    </Box>
  </Box>
}
