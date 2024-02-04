import Head from "next/head";
import styles from "../styles/home.module.css"
import { GetServerSideProps } from "next";
import { getBet } from "./api/bets";
import { json } from "@/utils/json";
import { useMemo, useState } from "react";
import { Bets, UserBets, Users } from "@prisma/client";
import { format } from "date-fns";
import { Login } from "@/components/login";

type HomeProps = {
  data: {
    bet: Bets;
    userBets: UserBets[];
  }
};

export default function Home({ data: { bet, userBets }}: HomeProps) {
  const [user, setUser] = useState<Users | undefined>();

  const timeToCloseBet = useMemo(() => {
    return format(new Date(bet.finishAt as any), "HH:mm")
  }, [bet]);

  const [c1, c2] = useMemo(() => {
    let chicken1 = 0 
    let chicken2 = 0
    userBets.forEach(ub => {
      if (ub.value === 1) return chicken1++
      chicken2++
    })
    return [chicken1, chicken2]
  }, [userBets]);

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
          <Login/>
          <h1>ChickenTale</h1>
          <strong>
            Próxima briga às: {timeToCloseBet}
          </strong>
          <div className={styles.cage}>
            <img src="/galo-1.png" alt="galo 1" className={styles.chickenOne}/>
            <img src="/galo-2.png" alt="galo 1" className={styles.chickenTwo}/>
          </div>
          <div className={styles.buttons}>
            <div className={styles.buttonContainer}>
              <p>
                Apostas {c1}
              </p>
              <button className={styles.button}>
                chicken 1
              </button>
            </div>
            <div className={styles.buttonContainer}>
              <p>
                Apostas {c2}
              </p>
              <button className={styles.button}>
                chicken 2
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getBet();
  return {
    props: {
      data: json(data),
    }
  }
};