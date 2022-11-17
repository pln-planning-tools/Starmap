import { Box, SimpleGrid, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import { StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorLineItemDescription } from './ErrorLineItemDescription';
import styles from './ErrorNotificationBody.module.css';

interface ErrorNotificationBodyProps {
  isExpanded: boolean;
  errors: StarMapsIssueErrorsGrouped[];
}
export function ErrorNotificationBody({isExpanded, errors}: ErrorNotificationBodyProps) {
  if (!isExpanded) {
    return null;
  }
  return <Box className={styles.errorNotificationBody}>
    <Box className={styles.errorNotificationBodyHeader}>
      <SimpleGrid columns={2} spacing={10} className="">
        <Text as="b" width="15rem">Link</Text>
        <Text as="b" width="15rem">Description of Error(s)</Text>
        {errors.map((error, index) => {
          return (
            <div className={styles.errorLineItemWrapper}>
              <Text className={`${styles.errorIssueLinkText} ${styles.errorIssueLinkWrapper}`}>
                <NextLink passHref href={error.issueUrl}>
                  <Link width="15rem" target="_blank" rel="noopener noreferrer">
                    {error.issueTitle}
                  </Link>
                </NextLink>
              </Text>
              <ErrorLineItemDescription error={error} />
            </div>
          );
        })}
      </SimpleGrid>
    </Box>
  </Box>;
}
