import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Roadmapping | Protocol Labs Network</title>
        <meta
          name='description'
          content='Nikas Home'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Roadmapping on Protocol Labs Network!</h1>

        <div className={styles.grid}>
          <a
            href='#'
            className={styles.card}
          >
            <h2>Roadmaps</h2>
            <p>Learn more about our public roadmaps.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='#'
          target='_blank'
          rel='noopener noreferrer'
        >
          &copy; Nikas
        </a>
      </footer>
    </div>
  );
};

export default Home;
