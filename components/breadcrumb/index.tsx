import {
  Breadcrumb,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React, { useMemo } from 'react'
import { useViewMode } from '../../hooks/useViewMode';
import { getCrumbDataFromCrumbString } from '../../lib/breadcrumbs';
import { ViewMode } from '../../lib/enums';
import { StarmapsBreadcrumbItem } from './StarmapsBreadcrumbItem';

/**
 * Test with "http://localhost:3000/roadmap/github.com/ipfs/ipfs-gui/issues/110?crumbs=%5B%5B%22ipfs%2Fipfs-gui%23106%22%2C%22IPFS+Ignite+Roadmap+-+2022-%3E2023%22%5D%2C%5B%22ipfs%2Fipfs-gui%23124%22%2C%22Theme%3A+UX+%26+UI+Improvements%22%5D%5D#simple"
 */
interface StarmapsBreadcrumbProps {
  currentTitle: string;
}

export function StarmapsBreadcrumb({ currentTitle }: StarmapsBreadcrumbProps) {
  const router = useRouter();
  const viewMode = useViewMode();

  const { crumbs } = router.query as {crumbs: string};
  const decodedCrumbs = decodeURIComponent(crumbs)
  const parents = useMemo(() => {
      if (decodedCrumbs == null || decodedCrumbs == 'null' || decodedCrumbs == 'undefined') {
        return []
      }
      const parentsFromQuery = getCrumbDataFromCrumbString(decodedCrumbs, viewMode as ViewMode)
      if (parentsFromQuery.length !== 0) {
        parentsFromQuery.push({ url: router.asPath, title: currentTitle });
      }
      return parentsFromQuery;
    },
    [currentTitle, decodedCrumbs, router.asPath, viewMode],
  );

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
