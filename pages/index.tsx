import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import { addHttpsIfNotLocal } from '../utils/general';
import { Box, Container, Grid, Input, Text, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Roadmap } from '../components/Roadmap';
// import Link from 'next/link';

// export const getStaticProps: GetStaticProps = async () => {
// const res = await fetch(
//   `${addHttpsIfNotLocal(
//     process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://staging.pln-roadmap.nikas.page',
//   )}/api/github-issue?depth=1&url=https://github.com/pln-roadmap/tests/issues/9`,
// );
// const issueData = (await res.json()) || {};

// const transformData = (v) => {
//   return v.lists
//     .flatMap((v) => v.childrenIssues)
//     .map((v) => ({
//       ...v,
//       dueDate: new Date(v.dueDate),
//     }));
// };

// return {
//   props: {
//     issueData,
//   },
// };
// };

const App: NextPage = (/*pageProps: InferGetStaticPropsType<typeof getStaticProps>*/) => {
  // console.dir(pageProps, { depth: Infinity, maxArrayLength: Infinity });
  // const milestones = pageProps?.issueData?.lists?.flatMap((v) => v.childrenIssues);
  // console.dir(milestones, { depth: Infinity, maxArrayLength: Infinity });
  console.log();

  return (
    <>
      <Roadmap />
    </>
  );
};

export default App;
