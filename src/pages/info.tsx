import Head from 'next/head';
import styles from '../styles/policy.module.css';
import Header from '@/components/Header';
import Link from 'next/link';

export default function GameInfo() {
  return (
    <>
      <Head>
        <title>ChickenTale - Como Funciona</title>
        <meta name="description" content="Saiba como jogar o ChickenTale e trocar seus ganhos por produtos" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h1 className={styles.title}>Como Funciona o ChickenTale</h1>
            <p className={styles.lastUpdated}>Última atualização: 25/11/2023</p>

            <section className={styles.section}>
              <h2>1. O Jogo</h2>
              <p>
                ChickenTale é um jogo de apostas virtuais onde dois galinhos competem entre si.
                Você pode apostar em qual dos galinhos acredita que será o vencedor da batalha.
                A cada rodada, um galinho é declarado vencedor com base em um algoritmo aleatório.
              </p>
              <p>
                Cada batalha termina com a vitória do Galinho 1 (c1) ou do Galinho 2 (c2),
                aumentando a contagem de vitórias daquele galinho específico.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Como Apostar</h2>
              <p>
                Para apostar, você precisa:
              </p>
              <ul className={styles.list}>
                <li>Escolher qual galinho você acredita que será o vencedor (c1 ou c2)</li>
                <li>Determinar o valor da sua aposta em tickets</li>
                <li>Clicar no botão "Apostar" correspondente ao galinho escolhido</li>
                <li>Aguardar o resultado da batalha</li>
              </ul>
              <p>
                Após o término da batalha, que dura aproximadamente 10 segundos, o resultado é exibido
                e seus ganhos são calculados automaticamente caso seu galinho vença.
              </p>
            </section>

            <section className={styles.section}>
              <h2>3. Ganhos e Tickets</h2>
              <p>
                Ao vencer uma aposta, você recebe ganhos baseados no valor apostado e nas
                probabilidades do momento em que realizou a aposta. Os ganhos são calculados automaticamente
                e adicionados ao seu saldo.
              </p>
              <p>
                Os tickets são a moeda virtual utilizada para realizar apostas no ChickenTale.
                Quanto mais tickets você apostar, maiores serão seus potenciais ganhos.
              </p>
            </section>

            <section className={styles.section}>
              <h2>4. Trocando Ganhos por Produtos</h2>
              <p>
                Os ganhos acumulados no ChickenTale podem ser trocados por produtos e serviços disponíveis na plataforma Bero.
              </p>
              <p>
                Para trocar seus ganhos:
              </p>
              <ul className={styles.list}>
                <li>Acumule ganhos jogando o ChickenTale</li>
                <li>Acesse a plataforma Bero através do link abaixo</li>
                <li>Conecte sua conta do ChickenTale à Bero</li>
                <li>Escolha os produtos ou serviços que deseja adquirir</li>
                <li>Confirme a troca utilizando seus ganhos acumulados</li>
              </ul>
              <p>
                A plataforma Bero oferece uma variedade de produtos e serviços que podem ser adquiridos com seus ganhos do ChickenTale.
                Visite o site da Bero para conhecer todas as opções disponíveis.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Regras Importantes</h2>
              <p>
                Para garantir uma experiência justa e divertida para todos, algumas regras devem ser seguidas:
              </p>
              <ul className={styles.list}>
                <li>Você só pode apostar se tiver tickets suficientes</li>
                <li>As apostas são finais e não podem ser canceladas após confirmadas</li>
                <li>Os ganhos podem variar de acordo com as probabilidades do momento da aposta</li>
                <li>A plataforma se reserva o direito de suspender contas suspeitas de comportamento fraudulento</li>
                <li>Os tickets e ganhos não possuem valor monetário real e só podem ser utilizados dentro do ecossistema ChickenTale e Bero</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>6. Dúvidas e Suporte</h2>
              <p>
                Se você tiver alguma dúvida sobre como jogar, como funcionam os ganhos ou como trocar por produtos,
                entre em contato conosco através do email:
                <br />
                <span className={styles.email}>suporte@chickentale.com</span>
              </p>
              <p>
                Nossa equipe está disponível para ajudar e garantir que sua experiência seja a melhor possível.
              </p>
            </section>

            <div className={styles.navButtons}>
              <Link href="/" className={styles.policyButton} style={{ marginRight: '1rem' }}>
                Voltar ao Jogo
              </Link>
              <a
                href="https://bero.land"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.policyButton}
              >
                Visitar Bero
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
