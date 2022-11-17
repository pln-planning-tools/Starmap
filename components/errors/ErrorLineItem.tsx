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
  console.log(`error: `, error);
  if (error.url == null || typeof error.url !== 'string') {
    console.log(`error.url == null: `, error.url == null);
    return null;
  }
  return <div>

    <ErrorBoundary>
      <Wrap className={styles.errorIssueLineItem}>
            <Center className={`${styles.errorIssueLinkText} ${styles.errorIssueLinkWrapper}`}>
        {/* <WrapItem className={styles.errorIssueLinkWrapper}> */}
          {/* <Center> */}
              <NextLink passHref href={error.url}>
                <Center>

                <Link target="_blank" rel="noopener noreferrer">
                  {error.url}
                </Link>
                </Center>
            </NextLink>
          {/* </Center> */}
        {/* </WrapItem> */}
            </Center>
        <Spacer />
        <WrapItem className={styles.errorIssueDescriptionWrapper}>
          <Center>
            <ErrorLineItemDescription error={error} />
          </Center>
        </WrapItem>
      </Wrap>
    </ErrorBoundary>
  </div>;
}

