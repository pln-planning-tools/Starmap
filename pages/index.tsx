import {readFile} from 'fs/promises'
import {join} from 'path'

import type { NextPage } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Center, Link, Text, Flex } from '@chakra-ui/react'
import Image from 'next/image';
import NextLink from 'next/link'
import GitHubSvgIcon from '../components/icons/GitHubLogo.svg';
import themes from '../components/theme/constants';

import styles from './LandingPage.module.css'
import PageHeader from '../components/layout/PageHeader';
import { useGlobalLoadingState } from '../hooks/useGlobalLoadingState';

interface SSProps {
  markdown: string
}

const starmapsGithubUrl = 'https://github.com/pln-planning-tools/StarMaps/blob/main/User%20Guide.md';

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
};


const App: NextPage<SSProps> = ({markdown}: SSProps) => {
  // const isGlobalLoadingState = useGlobalLoadingState();
  // isGlobalLoadingState.stop();
  return (
    <>
      <PageHeader />
      <Center>
        <article className={styles['UserGuide-article']}>
          <Flex w="100%" justify="flex-end">
            <NextLink style={{display: 'span'}} passHref href={starmapsGithubUrl}>
              <Link target="_blank" rel="noopener noreferrer">
                <Center minWidth="9rem">
                  <Text as='span' fontSize={15} fontWeight={400} color={themes.light.text.color} pr="0.5rem">View in GitHub</Text>
                  <Image src={GitHubSvgIcon} alt="GitHub Logo" color={themes.light.text.color} width={24} height={24} />
                </Center>
              </Link>
            </NextLink>
          </Flex>
          <ReactMarkdown components={ChakraUIRenderer(chakraUiRendererTheme)} children={markdown} remarkPlugins={[remarkGfm]} />
        </article>
      </Center>
    </>
  );
};

export default App;
