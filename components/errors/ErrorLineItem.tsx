import { WrapItem, Center, Wrap, Link, Spacer, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import type { StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorBoundary } from './ErrorBoundary';
import styles from './ErrorLineItem.module.css';
import { ErrorLineItemDescription } from './ErrorLineItemDescription';

export interface ErrorLineItemProps {
  error: StarMapsIssueErrorsGrouped;
}
export function ErrorLineItem({error}: ErrorLineItemProps) {
  if (error.issueUrl == null || typeof error.issueUrl !== 'string') {
    return null;
  }
  return (
    <ErrorBoundary>
      <Wrap className={styles.errorIssueLineItem}>
        <Center className={`${styles.errorIssueLinkText} ${styles.errorIssueLinkWrapper}`}>
          <Center>
            <NextLink passHref href={error.issueUrl}>

              <Link target="_blank" rel="noopener noreferrer">
                {error.issueTitle}
              </Link>
            </NextLink>
          </Center>
        </Center>
        <Spacer />
        <WrapItem className={styles.errorIssueDescriptionWrapper}>
          <Center>
            <ErrorLineItemDescription error={error} />
          </Center>
        </WrapItem>
      </Wrap>
    </ErrorBoundary>
  );
}

