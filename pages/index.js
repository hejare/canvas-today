import { backendClient } from "@/services/backendClient";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function getHistory() {
      const historyResponse = await backendClient.get("history");
      console.log((historyResponse));
      setHistory(historyResponse.history.reverse());
    }
    getHistory();
  }, []);

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
          Check health{" "}
          <Link href="/api/health"><code className={styles.code}>api/health.js</code></Link>
        </p>
      </main>
      <section>
        <h2>History:</h2>
        {history.map(h => (
          <div key={h.timestamp} style={{ backgroundColor: "#efeefd", padding: 10 }}>
            <h3>{h.headlines.headline}</h3>
            <img src={h.imageUrl} width="100px" />
          </div>
        ))}
      </section>
    </div>
  );
}
