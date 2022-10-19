import { Box, BoxProps, Container } from '@chakra-ui/react';
import * as React from 'react';

export const Footer = (props: BoxProps) => {
  return (
    <Box as='footer' role='contentinfo' bg='bg-accent' {...props}>
      <Container>Footer</Container>
    </Box>
  );
};
