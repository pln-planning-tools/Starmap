import { MarkGithubIcon, SearchIcon } from '@primer/octicons-react';
import {
  Avatar,
  Box,
  BranchName,
  Button,
  Header,
  Heading,
  IconButton,
  Link,
  PageLayout,
  StateLabel,
  StyledOcticon,
  TabNav,
  Text,
  TextInput,
} from '@primer/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import NextLink from 'next/link';

const DynamicPage = dynamic(() => import('../components/Page'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Roadmapping | Protocol Labs Network</title>
        <meta name='description' content='Roadmapping tool for the Protocol Labs Network' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* <PullRequestPage /> */}

      <Header>
        <Header.Item>
          <Header.Link href='/'>
            <StyledOcticon icon={MarkGithubIcon} size={32} sx={{ mr: 2 }} />
            <span>Protocol Labs Network</span>
          </Header.Link>
        </Header.Item>
        <Header.Item full>Roadmapping</Header.Item>
      </Header>

      <DynamicPage />
    </div>
  );
};

export default Home;
