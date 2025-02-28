import Head from 'next/head'
import styles from '../styles/home.module.css'
import { type GetServerSideProps } from 'next'
import { type GetBetDataResponse, getBet } from './api/bets'
import { json } from '@/utils/json'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
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
import Header from '@/components/Header'

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
  const [hitEffectsActive, setHitEffectsActive] = useState(false)
  const hitTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      // Cleanup audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  }, []);

  // Function to play hit sound effect
  const playHitSound = useCallback(() => {
    if (!audioContextRef.current) return;

    const context = audioContextRef.current;

    // Create oscillator for punch sound
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Setup oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, context.currentTime + 0.1);

    // Setup gain (volume)
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);

    // Play sound
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  }, []);

  useEffect(() => {
    if (status === 'processing') {
      alert('Pagamento em processamento')
    }
  }, [status])

  const { setSession, session: { token, user } } = useSessionStorage()

  const { refetch: refetchMyBets, data: myData, isLoading: isMyDataLoading } = useQuery('myData', async () => {
    if (token) {
      try {
        const { data: { myBets, myTickets, totalWinnings } } = await axios.get<UserBetsResponse>('/api/users/bets', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })

        setIsDataReady(true)

        return { myBets, myTickets, totalWinnings }
      } catch (err: any) {
        alert(getErrorMessage(err))
      }
    }
  }, { keepPreviousData: true, refetchInterval: 1000 * 5 })

  const { data: bets = sbets, isLoading: isBetsLoading } = useQuery<GetBetDataResponse>('bets', async () => {
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

  const isLoading = isMyDataLoading || isBetsLoading || !isDataReady

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
      })

      mm = myData.totalWinnings || 0
    }

    return [c1, c2, mm]
  }, [myData])

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

      if ((myData?.myTickets?.length || 0) <= 0) {
        alert('Você precisa comprar um ticket pra apostar!')
        return
      }

      if (betState === BetFightState.FIGHTING) {
        alert('Uma luta ja está em andamento, aguarde!')
        return
      }

      // Clear any existing reset timer when starting a new bet
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
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

  // Hit effect timer
  useEffect(() => {
    if (betState === BetFightState.FIGHTING) {
      // Play hit sounds at random intervals during fight
      const playRandomHitSounds = () => {
        // Play hit sound
        playHitSound();

        // Activate hit effect
        setHitEffectsActive(true);

        // Turn off hit effect after a short delay
        setTimeout(() => {
          setHitEffectsActive(false);
        }, 150);

        // Schedule next hit effect at random time
        hitTimerRef.current = setTimeout(
          playRandomHitSounds,
          Math.random() * 800 + 300
        ); // Between 300ms and 1100ms
      }

      // Start playing hit sounds
      playRandomHitSounds();

      // Clean up timers on state change
      return () => {
        if (hitTimerRef.current) {
          clearTimeout(hitTimerRef.current);
        }
        setHitEffectsActive(false);
      }
    }
  }, [betState, playHitSound]);

  // Reset to WAITING state after battle finishes
  useEffect(() => {
    if (betState === BetFightState.FINISHED) {
      // Clear any existing reset timer
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }

      // Set new timer to reset state after 10 seconds
      resetTimerRef.current = setTimeout(() => {
        setBetState(BetFightState.WAITING);
      }, 10000); // 10 segundos
    }

    // Cleanup timer on unmount or state change
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [betState]);

  return (
        <>
            <Head>
                <title>Chickentale</title>
                <meta name="description" content="Chickentale é uma rinha de galo virtual" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <audio src={music} autoPlay loop></audio>
                <div className={`${styles.container} ${betState === BetFightState.FIGHTING ? styles.screenShake : ''}`}>
                <Header handleLogin={handleLogin} user={user} />
                {user && <MyBets
                  c1={myBetsOnChickenOne}
                  c2={myBetsOnChickenTwo}
                  myMoney={myMoney}
                  myTickets={myData?.myTickets.length || 0}
                  isLoading={isLoading}
                />}
                <h1 className={styles.gameTitle}>ChickenTale</h1>
                <strong className={styles.gameStatus}>
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
                      : betState === BetFightState.WAITING || isLoading
                        ? (
                        <>
                        <img src="/galo-1.png" alt="chicken 1" className={styles.chickenOneFighting}/>
                        <img src="/galo-1.png" alt="chicken 2" className={styles.chickenTwoFighting}/>
                        </>
                          )
                        : (
                        <img src={`/galo-${winner}.png`} alt="smoke" className={styles.smoke}/>
                          )}
                </div>
                <div className={styles.buttonContainersWrapper}>
                    <div className={styles.buttonContainer}>
                    <p>
                        {`Vitórias ${chickenOneWinnings}`}
                    </p>
                    <button className={styles.button} onClick={async () => { await handleCreateBet(1) }} disabled={isLoading}>
                        <p className={styles.buttonText}>chicken 1</p>
                    </button>
                    </div>
                    <div className={styles.buttonContainer}>
                    <p>
                        {`Vitórias ${chickenTwoWinnings}`}
                    </p>
                    <button className={styles.button} onClick={async () => { await handleCreateBet(2) }} disabled={isLoading}>
                        <p className={styles.buttonText}>chicken 2</p>
                    </button>
                    </div>
                </div>
                {user && <BuyTicket handleBuyTicket={handleBuyTickets}/>}
                </div>
                <div className={`${styles.damageFlash} ${hitEffectsActive ? styles.flashActive : ''}`}></div>
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
