import {
  Breadcrumb,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React from 'react'
import { useViewMode } from '../../hooks/useViewMode';
import { getCrumbDataFromCrumbString } from '../../lib/breadcrumbs';
import { ViewMode } from '../../lib/enums';
import { StarmapsBreadcrumbItem } from './StarmapsBreadcrumbItem';

/**
 * Test with "http://localhost:3000/roadmap/github.com/ipfs/ipfs-gui/issues/106?crumbs=ipfs%2Fipfs-gui%23106%40%40This%20is%20a%20name%2CownerA%2FrepoB%23222%40%40Name%202#detail"
 */
interface StarmapsBreadcrumbProps {
  currentTitle: string;
}

export function StarmapsBreadcrumb({ currentTitle }: StarmapsBreadcrumbProps) {
  const router = useRouter();
  const viewMode = useViewMode();

  const { crumbs } = router.query as {crumbs: string};
  const parents = crumbs == null ? [] : getCrumbDataFromCrumbString(decodeURIComponent(crumbs), viewMode as ViewMode);

  if (parents.length !== 0) {
    parents.push({ url: router.asPath, title: currentTitle });
  }

  if (parents.length === 0) {
    /**
     * TODO: Need a placeholder
     */
    return null;
  }

  return (
    <Breadcrumb ml="120px" mr="120px" mt="2rem" mb="2rem" padding="0.25rem" separator={<span style={{ color: 'black' }}>/</span>} fontSize={16} fontWeight={600}>
      {parents.map(({ title, url }, index) => (
          <StarmapsBreadcrumbItem key={index} title={title} url={url} />
        ))}
    </Breadcrumb>
  );
}
