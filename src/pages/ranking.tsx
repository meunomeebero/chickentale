import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import styles from '../styles/ranking.module.css'
import Header from '@/components/Header'

interface Player {
  id: number
  name: string
  email: string
  winCount: number
}

export default function Ranking() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/ranking')
        setPlayers(data.rankings)
      } catch (err) {
        setError('Failed to load ranking data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()
  }, [])

  return (
    <>
      <Head>
        <title>ChickenTale - Ranking</title>
        <meta name="description" content="ChickenTale player ranking leaderboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <div className={styles.arcadeCabinet}>
          <div className={styles.screen}>
            <div className={styles.scanline}></div>
            <div className={styles.screenContent}>
              {loading ? (
                <div className={styles.loading}>LOADING...</div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : (
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PLAYER</th>
                      <th>WINS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.length > 0 ? (
                      players.map((player, index) => (
                        <tr key={player.id} className={index < 3 ? styles.topPlayer : ''}>
                          <td>{index + 1}</td>
                          <td className={styles.playerName}>
                            {player.name}
                          </td>
                          <td className={styles.score}>{player.winCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className={styles.noData}>NO DATA</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
