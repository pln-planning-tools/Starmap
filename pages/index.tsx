import {readFile} from 'fs/promises'
import {join} from 'path'

import type { NextPage } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Center, Link } from '@chakra-ui/react'

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

const chakraUiRendererTheme: Parameters<typeof ChakraUIRenderer>[0] = {
  a: (props) => {
    const { children, href } = props;

    return (
      <Link target="_blank" rel="noopener noreferrer" href={href} color="#4987BD">
        {children}
      </Link>
    );
  },
}

const App: NextPage<SSProps> = ({markdown}: SSProps) => {
  return (
    <>
      <PageHeader />
      <Center>
        <article className={styles['UserGuide-article']}>
          <ReactMarkdown components={ChakraUIRenderer(chakraUiRendererTheme)} children={markdown} remarkPlugins={[remarkGfm]} />
        </article>
      </Center>
    </>
  );
};

export default App;
