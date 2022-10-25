import { Text } from '@chakra-ui/react';

import styles from './Roadmap.module.css';

export function GroupItem({ showGroupRowTitle, issueData, group }) {
  let detailedViewClass = 'detailedView';
  if (!showGroupRowTitle) {
    detailedViewClass = '';
  }
  return (
    <div className={`${styles.item} ${styles.group}`}>
      <div>
        {!!showGroupRowTitle && (
          // <NextLink
          //   href={`/roadmap/github.com/${slugsFromUrl(getUrlPathname(issueData.html_url)).params.owner}/${
          //     slugsFromUrl(getUrlPathname(issueData.html_url)).params.repo
          //   }/issues/${slugsFromUrl(getUrlPathname(issueData.html_url)).params.issue_number}`}
          //   passHref
          // >
          //   <Link color='blue.500'>{group.groupName}</Link>
          // </NextLink>
          <Text>{group.groupName}</Text>
        )}
      </div>
    </div>
  );
}
