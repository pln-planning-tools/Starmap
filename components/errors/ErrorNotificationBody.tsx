import { Box } from '@chakra-ui/react';
import { groupBy } from 'lodash';

import { StarMapsIssueErrorsGrouped } from '../../lib/types';
import { ErrorLineItem } from './ErrorLineItem';
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
    {errors.map((error, index) => <ErrorLineItem key={index} error={error} />)}
  </Box>;
}
