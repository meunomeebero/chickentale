import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "../styles/home.module.css"
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Chickentale</title>
        <meta name="description" content="Galotale é uma rinha de galo virtual" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          <h1>ChickenTale</h1>
          <strong>
            Próxima briga em 30 minutos
          </strong>
          <div className={styles.cage}>
            <img src="/galo-1.png" alt="galo 1" className={styles.chickenOne}/>
            <img src="/galo-2.png" alt="galo 1" className={styles.chickenTwo}/>
          </div>
          <div className={styles.chickenInfoContainer}>
            <p className={styles.chickenInfo}>
              odds 1.1
            </p>
            <p className={styles.chickenInfo}>
              odds 2.2
            </p>
          </div>
          <div className={styles.buttons}>
            <button className={styles.button}>
              chicken 1
            </button>
            <button className={styles.button}>
              chicken 2
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
