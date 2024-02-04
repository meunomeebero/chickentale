import Head from "next/head";
import styles from "../styles/home.module.css"
import { GetServerSideProps } from "next";
import { getBet } from "./api/bets";
import { json } from "@/utils/json";
import { useCallback, useMemo, useState } from "react";
import { Bets, UserBets, Users } from "@prisma/client";
import { format } from "date-fns";
import { HandleLoginReturn, Login } from "@/components/login";
import axios from "axios";
import { MyBets } from "@/components/my-bets";
import { createPaymentLink } from "@/utils/stripe";

type HomeProps = {
  data: {
    bet: Bets;
    userBets: UserBets[];
  }
};

export default function Home({ data: { bet, userBets }}: HomeProps) {
  const [user, setUser] = useState<Users | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [myBets, setMyBets] = useState<UserBets[] | undefined>();
  const [myMoney, setMyMoney] = useState(0);

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

  const [myBetsC1, myBetsC2] = useMemo(() => {
    let chicken1 = 0 
    let chicken2 = 0
    myBets?.forEach(ub => {
      if (ub.value === 1) return chicken1++
      chicken2++
    })
    return [chicken1, chicken2]
  }, [myBets]);

  const handleCreateBet = useCallback(async (chicken: number) => {
    if (bet.isFinished) {
      alert("A rinha ja acabou, aguarde a próxima!");
      return;
    }

    if (!token) {
      alert("Você precisa estar logado para fazer uma aposta!");
      return;
    }

    if (!user) {
      alert("Você precisa estar logado para fazer uma aposta!");
      return;
    }

    const paymentLink = await createPaymentLink(user, JSON.stringify({ value: chicken, times: 1, token }));

    window.location.replace(paymentLink as string);
  }, [token, bet, user]);

  const handleLogin = useCallback(async ({ token, user }: HandleLoginReturn) => {
    setUser(user);
    setToken(token);

    const { data: { myBets: myBetsData, myMoney } } = await axios.get('/api/users/bets', {
      headers: {
        Authorization: "Bearer " + token,
      }
    });

    setMyBets(myBetsData);
    setMyMoney(myMoney);
  }, []);

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
          <Login handleLogin={handleLogin} user={user}/>
          {user && <MyBets c1={myBetsC1} c2={myBetsC2} myMoney={myMoney}/>}
          <h1>ChickenTale</h1>
          <strong>
            { bet.isFinished ? (
              "Rinha finalizada. chicken " + bet.winner + " venceu!"
            ) : "Próxima briga às: " + timeToCloseBet }
          </strong>
          <div className={styles.cage}>
            <img src="/galo-1.png" alt="galo 1" className={styles.chickenOne}/>
            <img src="/galo-2.png" alt="galo 1" className={styles.chickenTwo}/>
          </div>
          <div className={styles.buttonContainersWrapper}>
            <div className={styles.buttonContainer}>
              <p>
                Apostas {c1}
              </p>
              <button className={styles.button} onClick={() => handleCreateBet(1)} >
                <p className={styles.buttonText}>chicken 1</p>
              </button>
            </div>
            <div className={styles.buttonContainer}>
              <p>
                Apostas {c2}
              </p>
              <button className={styles.button} onClick={() => handleCreateBet(2)} >
              <p className={styles.buttonText}>chicken 2</p>
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