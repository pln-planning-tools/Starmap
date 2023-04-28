import { readFile } from 'fs/promises';
import { join } from 'path';

import type { NextPage } from 'next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Center, Link, Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import GitHubSvgIcon from '../components/icons/GitHubLogo.svg';
import themes from '../components/theme/constants';

import styles from './LandingPage.module.css';
import PageHeader from '../components/layout/PageHeader';

interface SSProps {
  markdown: string
}

const starmapsGithubUrl = 'https://github.com/pln-planning-tools/Starmap/blob/main/User%20Guide.md';

export async function getServerSideProps(): Promise<{ props: SSProps }> {
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
  img: (props) => {
    const { children, src } = props;

    return (
      <Center>
        <Image src={src as string} alt={children as string} width={500} height={500} />
      </Center>
    );
  },
};


const App: NextPage<SSProps> = ({ markdown }: SSProps) => (
    <>
      <PageHeader />
      <Center>
        <article className={styles['UserGuide-article']}>
          <Flex w="100%" justify="flex-end">
            <NextLink style={{ display: 'span' }} passHref href={starmapsGithubUrl}>
              <Link target="_blank" rel="noopener noreferrer">
                <Center minWidth="9rem">
                  <Text as='span' fontSize={15} fontWeight={400} color={themes.light.text.color} pr="0.5rem">View in GitHub</Text>
                  <Image src={GitHubSvgIcon} alt="GitHub Logo" color={themes.light.text.color} width={24} height={24} />
                </Center>
              </Link>
            </NextLink>
          </Flex>
        <ReactMarkdown components={ChakraUIRenderer(chakraUiRendererTheme)} children={markdown} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]} />
        </article>
      </Center>
    </>
  );

export default App;
