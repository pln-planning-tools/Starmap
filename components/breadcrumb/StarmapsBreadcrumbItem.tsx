import { BreadcrumbItem, BreadcrumbItemProps, BreadcrumbLink } from '@chakra-ui/react';
import React from 'react';
import { useGlobalLoadingState } from '../../hooks/useGlobalLoadingState';

interface StarmapsBreadcrumbItemProps extends BreadcrumbItemProps {
  title: string;
  url: string | null;
}

export function StarmapsBreadcrumbItem({ title, url, ...props }: StarmapsBreadcrumbItemProps) {
  const globalLoadingState = useGlobalLoadingState();
  // eslint-disable-next-line arrow-body-style
  let onClickHandler = () => {
    return;
  }
  const isClickable = url != null;
  if (isClickable) {
    onClickHandler = () => {
      globalLoadingState.start();
    }
  }
  return (
    <BreadcrumbItem onClick={onClickHandler} className="js-breadcrumbItem-link" isCurrentPage={!isClickable} {...props}>
        <BreadcrumbLink href={url ?? ''} textDecoration={isClickable ? 'underline' : 'none'}>
            {title}
        </BreadcrumbLink>
    </BreadcrumbItem>
  );
}
