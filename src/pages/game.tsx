import Head from 'next/head'
import styles from '../styles/home.module.css'
import { type GetServerSideProps } from 'next'
import { type GetBetDataResponse, getBet } from './api/bets'
import { json } from '@/utils/json'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BetState, UserBetState, UserBetValue, type UserBets } from '@prisma/client'
import { type HandleLoginReturn, Login } from '@/components/login'
import axios from 'axios'
import { MyBets } from '@/components/my-bets'
import { useQuery } from 'react-query'
import { BuyTicket } from '@/components/buy-ticket'
import { type UserBetsResponse } from './api/users/bets'
import { getErrorMessage } from '@/utils/get-error-message'
import { sleep } from '@/utils/sleep'
import useSessionStorage from '@/hooks/use-session-storage'
import { SingleMom } from '@/components/single-mom'
import ConfettiExplosion from 'react-confetti-explosion'

enum BetFightState {
  FIGHTING,
  WAITING,
  FINISHED,
}

interface GameProps {
  data: GetBetDataResponse
  status: '' | 'processing'
}

const explosion = {
  force: 0.8,
  duration: 3000,
  particleCount: 250,
  width: 1600
}

export default function Game ({ data: sbets, status }: GameProps) {
  const [betState, setBetState] = useState(BetFightState.WAITING)
  const [winner, setWinner] = useState<number | undefined>(undefined)
  const [lastBetState, setLastBetState] = useState<UserBetState | undefined>()
  const [isDataReady, setIsDataReady] = useState(false)

  useEffect(() => {
    if (status === 'processing') {
      alert('Pagamento em processamento')
    }
  }, [status])

  const { setSession, session: { token, user } } = useSessionStorage()

  const { refetch: refetchMyBets, data: myData } = useQuery('myData', async () => {
    if (token) {
      try {
        const { data: { myBets, myTickets } } = await axios.get<UserBetsResponse>('/api/users/bets', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })

        setIsDataReady(true)

        return { myBets, myTickets }
      } catch (err: any) {
        alert(getErrorMessage(err))
      }
    }
  }, { keepPreviousData: true, refetchInterval: 1000 * 5 })

  const { data: bets = sbets } = useQuery<GetBetDataResponse>('bets', async () => {
    if (token) {
      try {
        const { data } = await axios.get('/api/bets', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })

        console.log(data)

        return data
      } catch (err: any) {
        alert(getErrorMessage(err))
      }
    }
  }, { keepPreviousData: true, refetchInterval: 1000 * 5 })

  const [
    myBetsOnChickenOne,
    myBetsOnChickenTwo,
    myMoney
  ] = useMemo(() => {
    let c1 = 0
    let c2 = 0
    let mm = 0

    if (myData) {
      myData.myBets.forEach(b => {
        if (b.value === UserBetValue.CHICKEN_1) {
          c1++
        } else {
          c2++
        }

        if (b.state === UserBetState.WON && !b.isWithdrawn) {
          mm += 9 // 5 + (80/100 * 5);
        }
      })
    }

    return [c1, c2, mm]
  }, [myData])

  console.log({myData})

  const handleCreateBet = useCallback(async (chicken: number) => {
    try {
      if (bets.bet.state === BetState.CLOSE) {
        alert('A rinha ja acabou, aguarde a próxima!')
        return
      }

      if (!token) {
        alert('Você precisa estar logado para fazer uma aposta!')
        return
      }

      if (!user) {
        alert('Você precisa estar logado para fazer uma aposta!')
        return
      }

      if (myData?.myTickets.length <= 0) {
        alert('Você precisa comprar um ticket pra apostar!')
        return
      }

      if (betState === BetFightState.FIGHTING) {
        alert('Uma luta ja está em andamento, aguarde!')
        return
      }

      setBetState(BetFightState.FIGHTING)

      const { data } = await axios.post<UserBets>('/api/users/bets', {
        value: chicken === 1 ? UserBetValue.CHICKEN_1 : UserBetValue.CHICKEN_2
      }, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })

      const getOpositeChicken = (value: UserBetValue) => {
        if (value === UserBetValue.CHICKEN_1) return 2
        return 1
      }

      const getChickenValue = (value: UserBetValue) => {
        if (value === UserBetValue.CHICKEN_1) return 1
        return 2
      }

      await sleep(2000)

      setLastBetState(data.state)

      setWinner(
        data.state == 'WON'
          ? getChickenValue(data.value)
          : getOpositeChicken(data.value)
      )

      setBetState(BetFightState.FINISHED)
    } catch (err: any) {
      alert(getErrorMessage(err))
    } finally {
      setBetState(BetFightState.FINISHED)
      await refetchMyBets()
    }
  }, [bets, token, user, myData?.myTickets.length, refetchMyBets, betState])

  const handleLogin = useCallback(async ({ token, user }: HandleLoginReturn) => {
    setSession({ token, user })
    await refetchMyBets()
  }, [refetchMyBets, setSession])

  const [chickenOneWinnings, chickenTwoWinnings] = useMemo(() => {
    let c1w = 0
    let c2w = 0

    bets.bettors.forEach(b => {
      if (b.state === UserBetState.WON) {
        if (b.value === UserBetValue.CHICKEN_1) {
          c1w++
        } else {
          c2w++
        }
      }

      if (b.state === UserBetState.LOST) {
        if (b.value === UserBetValue.CHICKEN_1) {
          c2w++
        } else {
          c1w++
        }
      }
    })

    return [c1w, c2w]
  }, [bets])

  const handleBuyTickets = useCallback(async (quantity: number) => {
    try {
      if (!token) {
        alert('Você precisa estar logado para fazer uma aposta!')
        return
      }

      if (!user) {
        alert('Você precisa estar logado para comprar tickets!')
        return
      }

      if (quantity <= 0) {
        alert('Quem muito brinca vira brinquedo...')
        return
      }

      const { data } = await axios.post('/api/users/bets/tickets', { quantity }, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })

      window.location.replace(data.paymentLink as string)
    } catch (err: any) {
      alert(getErrorMessage(err))
    }
  }, [token, user])

  const [music, setMusic] = useState('/game-ost.mp3')

  useEffect(() => {
    if (betState === BetFightState.FIGHTING) {
      setMusic('/fight-ost.mp3')
      return
    }

    if (lastBetState === 'WON') {
      setMusic('home-ost.mp3')
      return
    }

    setMusic('/game-ost.mp3')
  }, [betState, lastBetState])

  return (
        <>
            <Head>
                <title>Chickentale</title>
                <meta name="description" content="Galotale é uma rinha de galo virtual" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <audio src={music} autoPlay loop></audio>
                <div className={styles.container}>
                <Login handleLogin={handleLogin} user={user}/>
                {user && <MyBets c1={myBetsOnChickenOne} c2={myBetsOnChickenTwo} myMoney={myMoney} myTickets={myData?.myTickets.length || 0}/>}
                <h1>ChickenTale</h1>
                <strong>
                    { betState === BetFightState.FINISHED
                      ? (
                          'Rinha finalizada. chicken ' + winner + ' venceu!'
                        )
                      : betState === BetFightState.FIGHTING ? 'As galinhas estão brigando!' : 'Aposte na sua galinha vencedora!' }
                </strong>
                {lastBetState === 'WON' && betState === BetFightState.FINISHED && <ConfettiExplosion {...explosion} />}
                <div className={styles.cage}>
                    { betState === BetFightState.FIGHTING
                      ? (
                        <img src="/fight.gif" alt="smoke" className={styles.smoke}/>
                        )
                      : betState === BetFightState.WAITING
                        ? (
                        <>
                        <img src="/galo-1.png" alt="chicken 1" className={styles.chickenOne}/>
                        <img src="/galo-2.png" alt="chicken 2" className={styles.chickenTwo}/>
                        </>
                          )
                        : (
                        <img src={`/galo-${winner}.png`} alt="smoke" className={styles.smoke}/>
                          )}
                </div>
                <div className={styles.buttonContainersWrapper}>
                    <div className={styles.buttonContainer}>
                    <p>
                        Vitórias {chickenOneWinnings}
                    </p>
                    <button className={styles.button} onClick={async () => { await handleCreateBet(1) }} disabled={!isDataReady}>
                        <p className={styles.buttonText}>chicken 1</p>
                    </button>
                    </div>
                    <div className={styles.buttonContainer}>
                    <p>
                        Vitórias {chickenTwoWinnings}
                    </p>
                    <button className={styles.button} onClick={async () => { await handleCreateBet(2) }} disabled={!isDataReady}>
                        <p className={styles.buttonText}>chicken 2</p>
                    </button>
                    </div>
                </div>
                {user && <BuyTicket handleBuyTicket={handleBuyTickets}/>}
                </div>
            </main>
            <SingleMom position="left"/>
            <SingleMom position="right"/>
        </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let status = ''

  if (query.status) {
    status = query.status as string
  }

  const res = await getBet()
  const data = json(res)

  return {
    props: {
      data,
      status
    }
  }
}
