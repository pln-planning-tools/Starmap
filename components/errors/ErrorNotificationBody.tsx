import { Box, SimpleGrid, Text, Link, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';

import { StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorLineItemDescription } from './ErrorLineItemDescription';
import styles from './ErrorNotificationBody.module.css';

interface ErrorNotificationBodyProps {
  isExpanded: boolean;
  errors: StarMapsIssueErrorsGrouped[];
}
export function ErrorNotificationBody({ isExpanded, errors }: ErrorNotificationBodyProps) {
  if (!isExpanded) {
    return null;
  }
  return <Box className={styles.errorNotificationBody}>
    <Box className={styles.errorNotificationBodyHeader}>
      <SimpleGrid columns={2} spacing={0} width="100%">
        <Text as="b" ml="1rem">Link</Text>
        <Text as="b">Description of Error(s)</Text>
        {errors.map((error) => (
            <Box className={styles.errorLineItemWrapper} width="auto">
              <Text className={`${styles.errorIssueLinkText} ${styles.errorIssueLinkWrapper}`}>
                <NextLink passHref href={error.issueUrl}>
                  <Link width="15rem" target="_blank" rel="noopener noreferrer">
                    <Text ml="1rem"><Flex>{error.issueTitle}</Flex></Text>
                  </Link>
                </NextLink>
              </Text>
              <ErrorLineItemDescription error={error} />
            </Box>
          ))}
      </SimpleGrid>
    </Box>
  </Box>;
}
