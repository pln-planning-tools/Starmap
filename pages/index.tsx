import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nikas</title>
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
        <h1 className={styles.title}>Welcome to Nikas!</h1>

        {/* <p className={styles.description}>Look around and explore.</p> */}

        <div className={styles.grid}>
          <a
            href='#'
            className={styles.card}
          >
            <h2>Projects</h2>
            <p>Learn about our projects.</p>
          </a>

          <a
            href='#'
            className={styles.card}
          >
            <h2>Research</h2>
            <p>Learn about Nikas Research!</p>
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
