import Head from 'next/head';
import styles from '../styles/policy.module.css';
import Header from '@/components/Header';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>ChickenTale - Política de Privacidade</title>
        <meta name="description" content="ChickenTale privacy policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h1 className={styles.title}>Política de Privacidade</h1>
            <p className={styles.lastUpdated}>Última atualização: 28/02/2025</p>

            <section className={styles.section}>
              <h2>1. Introdução</h2>
              <p>
                Bem-vindo ao ChickenTale. Respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais.
                Esta política de privacidade informará como cuidamos de seus dados pessoais quando você visitar nosso site
                e informará sobre seus direitos de privacidade e como a lei protege você.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Dados que coletamos</h2>
              <p>
                Podemos coletar, usar, armazenar e transferir diferentes tipos de dados pessoais sobre você, que agrupamos da seguinte forma:
              </p>
              <ul className={styles.list}>
                <li>Dados de identidade: inclui nome, nome de usuário ou identificador semelhante</li>
                <li>Dados de contato: inclui endereço de e-mail</li>
                <li>Dados técnicos: inclui endereço de protocolo de internet (IP), tipo e versão do navegador, configuração de fuso horário e localização</li>
                <li>Dados de uso: inclui informações sobre como você usa nosso site e serviços</li>
                <li>Dados de perfil: inclui seu nome de usuário, histórico de jogo, preferências, feedback e respostas de pesquisa</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>3. Como usamos seus dados</h2>
              <p>
                Usaremos seus dados pessoais apenas quando a lei nos permitir. Mais comumente, usaremos seus
                dados pessoais em circunstâncias como as seguintes:
              </p>
              <ul className={styles.list}>
                <li>Para registrar você como um novo usuário</li>
                <li>Para processar e entregar recursos de jogo</li>
                <li>Para gerenciar nossa relação conosco</li>
                <li>Para melhorar nosso site, produtos/serviços, marketing e relações com usuários</li>
                <li>Para recomendar conteúdo que possa ser de seu interesse</li>
                <li>Para administrar e proteger nosso negócio e site</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. Segurança de dados</h2>
              <p>
                Implementamos medidas de segurança apropriadas para evitar que seus dados pessoais sejam perdidos, usados ou acessados de forma não autorizada, alterados ou divulgados. Limitamos o acesso
                aos seus dados pessoais aos funcionários, agentes, contratantes e outras partes terceiras que têm um
                necessidade de negócio de conhecer.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Seus direitos legais</h2>
              <p>
                Em certas circunstâncias, você tem direitos sob as leis de proteção de dados em relação aos seus dados pessoais,
                incluindo o direito de solicitar acesso, correção, exclusão, restrição, transferência ou a opção de não processar.
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Links de terceiros</h2>
              <p>
                Este site pode incluir links para sites de terceiros, plug-ins e aplicativos. Clicar nesses links
                pode permitir que terceiros coletem ou compartilhem dados sobre você. Não controlamos esses sites de terceiros e
                não somos responsáveis pelas declarações de privacidade desses sites.
              </p>
            </section>

            <section className={styles.section}>
              <h2>7. Política de cookies</h2>
              <p>
                Usamos cookies para distinguir você de outros usuários do nosso site. Isso nos ajuda a fornecer uma experiência
                melhor quando você navega pelo nosso site e também nos permite melhorar nosso site.
              </p>
            </section>

            <section className={styles.section}>
              <h2>8. Mudanças nesta Política de Privacidade</h2>
              <p>
                Podemos atualizar nossa política de privacidade de tempos em tempos. Vamos notificá-lo sobre quaisquer alterações
                publicando a nova política de privacidade nesta página e atualizando a data de "Última atualização" no topo.
              </p>
            </section>

            <section className={styles.section}>
              <h2>9. Contate-nos</h2>
              <p>
                Se você tiver alguma dúvida sobre esta política de privacidade ou nossas práticas de privacidade, por favor, entre em contato conosco em:
                <br />
                <span className={styles.email}>mail@bero.land</span>
              </p>
            </section>

            <div className={styles.navButtons}>
              <Link href="/terms" className={styles.policyButton}>
                Ver Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
