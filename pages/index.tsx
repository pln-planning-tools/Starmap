import {readFile} from 'fs/promises'
import {join} from 'path'

import type { NextPage } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Center } from '@chakra-ui/react'
import styles from './LandingPage.module.css'

import PageHeader from '../components/layout/PageHeader';

interface SSProps {
  markdown: string
}

export async function getServerSideProps(context): Promise<{props: SSProps}> {
  const filePath = join(process.cwd(), 'User Guide.md');
  const markdown = await readFile(filePath, 'utf8');

  return {
    props: {
      markdown
    },
  };
}

const App: NextPage<SSProps> = ({markdown}: SSProps) => {
  return (
    <>
      <PageHeader />
      <Center className={styles['UserGuide-container']}>
        <article className={styles['UserGuide-article']}>
          <ReactMarkdown components={ChakraUIRenderer()} children={markdown} remarkPlugins={[remarkGfm]} />
        </article>
      </Center>
    </>
  );
};

export default App;
