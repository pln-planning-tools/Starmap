import {
  Breadcrumb,
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import React, { useMemo } from 'react'
import { useViewMode } from '../../hooks/useViewMode';
import { getCrumbDataFromCrumbDataArray, routerQueryToCrumbArrayData } from '../../lib/breadcrumbs';
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

  const urlCrumbDataArray = routerQueryToCrumbArrayData(router.query);
  const parents = useMemo(() => {
      if (urlCrumbDataArray.length === 0) {
        return []
      }
      try {
        const parentsFromQuery = getCrumbDataFromCrumbDataArray(urlCrumbDataArray, viewMode as ViewMode)
        /**
         * We don't add the currently viewed item unless there are already breadcrumbs
         */
        if (parentsFromQuery.length !== 0) {
          parentsFromQuery.push({ url: router.asPath, title: currentTitle });
        }
        return parentsFromQuery;
      } catch (err) {
        return []
      }
    },
    [currentTitle, router.asPath, urlCrumbDataArray, viewMode],
  );

  if (parents.length === 0) {
    /**
     * TODO: Need a placeholder
     */
    return null;
  }

  return (
    <Breadcrumb
      mr={{ base:"30px", sm:"30px", md:"60px", lg:"120px" }}
      ml={{ base:"30px", sm:"30px", md:"60px", lg:"120px" }}
      padding={{ base: "0 0 20px 0" }} separator={<span style={{ color: 'black' }}>/</span>} fontSize={16} fontWeight={600}>
      {parents.map(({ title, url }, index) => (
        <StarmapsBreadcrumbItem key={index} title={title} url={url} lineHeight={1} />
      ))}
    </Breadcrumb>
  );
}
