import Head from "next/head";
import styles from "../styles/home.module.css"
import { GetServerSideProps } from "next";
import { getBet } from "./api/bets";
import { json } from "@/utils/json";
import { useCallback, useMemo, useState } from "react";
import { BetState, Bets, UserBets, Users } from "@prisma/client";
import { format } from "date-fns";
import { HandleLoginReturn, Login } from "@/components/login";
import axios from "axios";
import { MyBets } from "@/components/my-bets";
import { useQuery } from "react-query";

type HomeProps = {
  data: {
    bet: Bets;
    userBets: UserBets[];
  }
};

type UserBetsResponse = {
  myBets: UserBets[];
  myMoney: number;
};

type BetsResponse = {
  bet: Bets;
  userBets: UserBets[];
};

export default function Home({ data: serverSideData }: HomeProps) {
  const [user, setUser] = useState<Users | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const { data: bets = serverSideData } = useQuery('bets', async () => {
    const { data } = await axios.get<BetsResponse>("/api/bets");
    return data;
  });

  const { refetch: refetchMyBets, data: myBetsRes} = useQuery('myBets', async () => {
    if (token) {
      const { data: { myBets, myMoney }} = await axios.get<UserBetsResponse>('/api/users/bets', {
        headers: {
          Authorization: "Bearer " + token,
        }
      });

      console.log({ myBets, myMoney });
  
     return { myBets, myMoney };
    }
  });

  const timeToCloseBet = useMemo(() => {
    return format(new Date(bets.bet.finishAt as any), "HH:mm")
  }, [bets.bet]);

  const [c1, c2] = useMemo(() => {
    let chicken1 = 0 
    let chicken2 = 0
    bets.userBets.forEach(ub => {
      if (ub.value === 1) return chicken1++
      chicken2++
    })
    return [chicken1, chicken2]
  }, [bets]);

  const [myBetsC1, myBetsC2] = useMemo(() => {
    let chicken1 = 0 
    let chicken2 = 0
    myBetsRes?.myBets?.forEach(ub => {
      if (ub.value === 1) return chicken1++
      chicken2++
    })
    return [chicken1, chicken2]
  }, [myBetsRes]);

  const handleCreateBet = useCallback(async (chicken: number) => {
    if (bets.bet.state === BetState.FINISHED) {
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

    const { data: { paymentLink }} = await axios.post('/api/users/bets', {
      times: 1, 
      value: chicken,
    }, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });  

    window.location.replace(paymentLink as string);
  }, [token, bets, user]);

  const handleLogin = useCallback(async ({ token, user }: HandleLoginReturn) => {
    setUser(user);
    setToken(token);
    refetchMyBets();
  }, [refetchMyBets]);

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
          {user && <MyBets c1={myBetsC1} c2={myBetsC2} myMoney={myBetsRes?.myMoney ?? 0}/>}
          <h1>ChickenTale</h1>
          <strong>
            { bets.bet.state === BetState.FINISHED ? (
              "Rinha finalizada. chicken " + bets.bet.winner + " venceu!"
            ) : bets.bet.state === BetState.FIGHTING ? "As galinhas estão brigando!" : "Próxima briga às: " + timeToCloseBet }
          </strong>
          <div className={styles.cage}>
              { bets.bet.state === BetState.FIGHTING ? (
                <img src="/smoke.gif" alt="smoke" className={styles.smoke}/>
              ): bets.bet.state === BetState.WAITING ? (
                <>
                  <img src="/galo-1.png" alt="chicken 1" className={styles.chickenOne}/>
                  <img src="/galo-2.png" alt="chicken 2" className={styles.chickenTwo}/>
                </>
              ):(
                <img src={`/galo-${bets.bet.winner}.png`} alt="smoke" className={styles.smoke}/>
              )}
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
  const res = await getBet();
  const data = json(res);

  return {
    props: {
      data,
    }
  }
};