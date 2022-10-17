import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { addHttpsIfNotLocal } from '../utils/general';
import { Container, Grid } from '@chakra-ui/react';
import { Navbar } from '../components/Layout/Navbar';
import { Main } from '../components/Layout/Main';
import { Footer } from '../components/Layout/Footer';

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    `${addHttpsIfNotLocal(
      process.env.NEXT_PUBLIC_VERCEL_URL,
    )}/api/github-issue?depth=1&url=https://github.com/pln-roadmap/tests/issues/9`,
  );
  const issueData = await res.json();

  // const transformData = (v) => {
  //   return v.lists
  //     .flatMap((v) => v.childrenIssues)
  //     .map((v) => ({
  //       ...v,
  //       dueDate: new Date(v.dueDate),
  //     }));
  // };

  return {
    props: {
      issueData,
    },
  };
};

const Homepage: NextPage = (pageProps: InferGetStaticPropsType<typeof getStaticProps>) => {
  // console.dir(pageProps, { depth: Infinity, maxArrayLength: Infinity });
  // const milestones = pageProps?.issueData?.lists?.flatMap((v) => v.childrenIssues);
  // console.dir(milestones, { depth: Infinity, maxArrayLength: Infinity });
  console.log();

  return (
    <div>
      <Container>
        {/* <Navbar />
        <Main />
        <Footer /> */}
      </Container>
    </div>
  );
};

export default Homepage;
