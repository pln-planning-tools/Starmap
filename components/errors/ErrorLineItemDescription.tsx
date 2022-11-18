import {Box, Text} from '@chakra-ui/react';

import { StarMapsIssueErrorsGrouped } from '../../lib/types';
import styles from './ErrorLineItemDescription.module.css';

export function ErrorLineItemDescription({error}: {error: StarMapsIssueErrorsGrouped}) {
  return (
    <Box>
        {error.errors.map((errItem, index) => {
          return (
            <Text key={index} className={styles.errorIssueDescriptionText}>&nbsp;{errItem.message}</Text>
          );
        })}
    </Box>
  )
}
