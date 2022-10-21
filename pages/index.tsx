import type { NextPage } from 'next';

import { Box } from '@chakra-ui/react';

import React from 'react';

import { RoadmapForm } from '../components/RoadmapForm';

const App: NextPage = () => {
  console.log();

  return (
    <>
      <Box p={5}>
        <RoadmapForm />
      </Box>
    </>
  );
};

export default App;
