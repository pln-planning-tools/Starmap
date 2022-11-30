import {
  Breadcrumb,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React from 'react'
import { useViewMode } from '../../hooks/useViewMode';
import { getCrumbDataFromCrumbString } from '../../lib/client/getCrumbDataFromCrumbString';
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
  const parents = crumbs == null ? [] : getCrumbDataFromCrumbString(crumbs, viewMode as ViewMode);
  parents.push({ url: null, title: currentTitle });

  let fontSize = 40;
  if (parents.length >= 3) {
    fontSize = 20;
  } else if (parents.length >= 2) {
    fontSize = 25;
  }

  return (
    <Breadcrumb separator="/" mb='8px' fontSize={fontSize} fontWeight={600} pr="5rem">
      {parents.map(({ title, url }, index) => (
          <StarmapsBreadcrumbItem key={index} title={title} url={url} />
        ))}
    </Breadcrumb>
  );
}
