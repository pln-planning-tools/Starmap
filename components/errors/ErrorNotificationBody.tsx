import { Box } from '@chakra-ui/react';
import { StarMapsError } from '../../lib/types';
import { ErrorLineItem } from './ErrorLineItem';

interface ErrorNotificationBodyProps {
  isExpanded: boolean;
  errors: StarMapsError[];
}
export function ErrorNotificationBody({isExpanded, errors}: ErrorNotificationBodyProps) {
  if (!isExpanded) {
    return null;
  }
  return <Box>
    {errors.map((error, index) => <ErrorLineItem key={index} error={error} />)}
  </Box>;
}
