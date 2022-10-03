import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Canvas Today App</title>
        <meta name="description" content="Canvas Today" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Canvas Today!
        </h1>

        <p className={styles.description}>
          Check health{' '}
          <a href="/api/health"><code className={styles.code}>api/health.js</code></a>
        </p>
      </main>
    </div>
  )
}
