import { BreadcrumbItem, BreadcrumbItemProps, BreadcrumbLink } from '@chakra-ui/react';
import React from 'react';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';

interface StarmapsBreadcrumbItemProps extends BreadcrumbItemProps {
  title: string;
  url: string;
}

export function StarmapsBreadcrumbItem({ title, url, ...props }: StarmapsBreadcrumbItemProps) {
  const globalLoadingState = useGlobalLoadingState();

  const isClickable = url != null;
  const breadcrumbItemProps = {
    ...props,
    color: 'black',
    // eslint-disable-next-line arrow-body-style
    onClick: () => { return; },
    className: 'js-breadcrumbItem',
    isCurrentPage: false,
    cursor: 'default',
  }
  if (isClickable) {
    breadcrumbItemProps.onClick = () => {
      globalLoadingState.start();
      setTimeout(() => globalLoadingState.stop(), 5000);
    }
    breadcrumbItemProps.color = '#4987BD';
    breadcrumbItemProps.className += ' js-breadcrumbItem-link';
    breadcrumbItemProps.cursor = 'pointer'
  }
  return (
    <BreadcrumbItem {...breadcrumbItemProps}>
        <BreadcrumbLink href={url}>
            {title}
        </BreadcrumbLink>
    </BreadcrumbItem>
  );
}
