import { BreadcrumbItem, BreadcrumbItemProps, BreadcrumbLink } from '@chakra-ui/react';
import React from 'react';

interface StarmapsBreadcrumbItemProps extends BreadcrumbItemProps {
  title: string;
  url: string | null;
}
export function StarmapsBreadcrumbItem({ title, url, ...props }: StarmapsBreadcrumbItemProps) {

  return (
    <BreadcrumbItem isCurrentPage={url == null} {...props}>
        <BreadcrumbLink href={url ?? ''} textDecoration={url == null ? 'none' : 'underline'}>
            {title}
        </BreadcrumbLink>
    </BreadcrumbItem>
  );
}
