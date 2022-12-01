import { BreadcrumbItem, BreadcrumbItemProps, BreadcrumbLink } from '@chakra-ui/react';
import React from 'react';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';

interface StarmapsBreadcrumbItemProps extends BreadcrumbItemProps {
  title: string;
  url: string;
}

export function StarmapsBreadcrumbItem({ title, url, ...props }: StarmapsBreadcrumbItemProps) {
  const globalLoadingState = useGlobalLoadingState();

  const breadcrumbItemProps = {
    ...props,
    color: '#4987BD',
    onClick: () => {
      globalLoadingState.start();
      setTimeout(() => globalLoadingState.stop(), 5000);
    },
    className: 'js-breadcrumbItem js-breadcrumbItem-link',
    isCurrentPage: false,
    cursor: 'pointer',
  }

  return (
    <BreadcrumbItem {...breadcrumbItemProps}>
        <BreadcrumbLink href={url}>
            {title}
        </BreadcrumbLink>
    </BreadcrumbItem>
  );
}
