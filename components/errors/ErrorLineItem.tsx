import { Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { StarMapsError } from '../../lib/types';
import { ErrorBoundary } from './ErrorBoundary';

export interface ErrorLineItemProps {
  error: StarMapsError;
}
export function ErrorLineItem({error}: ErrorLineItemProps) {
  console.log(`error: `, error);
  if (error.url == null || typeof error.url !== 'string') {
    console.log(`error.url == null: `, error.url == null);
    return null;
  }
  return <div>

    <ErrorBoundary>
      <NextLink style={{display: 'span'}} passHref href={error.url}>
        <Link target="_blank" rel="noopener noreferrer">
          <Text>{error.url}</Text>
        </Link>
      </NextLink>
      <div>{error.message}</div>
    </ErrorBoundary>
  </div>;
}

