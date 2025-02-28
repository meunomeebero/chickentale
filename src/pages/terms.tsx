import Head from 'next/head';
import styles from '../styles/policy.module.css';
import Header from '@/components/Header';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>ChickenTale - Termos de Uso</title>
        <meta name="description" content="ChickenTale termos de uso" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h1 className={styles.title}>Termos de Uso</h1>
            <p className={styles.lastUpdated}>Última atualização: 28/02/2025</p>

            <section className={styles.section}>
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o ChickenTale ("o Serviço"), você aceita e concorda em estar vinculado aos termos e disposições deste acordo.
                Se você não concordar com estes termos, por favor, não utilize nosso Serviço.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Elegibilidade</h2>
              <p>
                Você deve ter pelo menos 18 anos de idade para usar este Serviço. Ao usar este Serviço e concordar com estes termos,
                você declara e garante que tem pelo menos 18 anos de idade.
              </p>
            </section>

            <section className={styles.section}>
              <h2>3. Contas de Usuário</h2>
              <p>
                Quando você cria uma conta conosco, deve fornecer informações precisas, completas e atualizadas. O não cumprimento
                constitui uma violação dos Termos, o que pode resultar no encerramento imediato da sua conta.
              </p>
              <p>
                Você é responsável por proteger a senha que utiliza para acessar o Serviço e por quaisquer atividades
                ou ações realizadas com sua senha.
              </p>
              <p>
                Você concorda em não divulgar sua senha a terceiros. Você deve nos notificar imediatamente ao tomar conhecimento
                de qualquer violação de segurança ou uso não autorizado de sua conta.
              </p>
            </section>

            <section className={styles.section}>
              <h2>4. Moeda Virtual e Itens do Jogo</h2>
              <p>
                O Serviço pode incluir moeda virtual ("Tickets") e itens virtuais que podem ser comprados com dinheiro real
                ou ganhos durante o jogo. Estes bens virtuais são licenciados para você e não possuem valor no mundo real.
              </p>
              <p>
                Reservamo-nos o direito de gerenciar, regular, controlar, modificar ou eliminar bens virtuais a nosso exclusivo critério,
                e não teremos nenhuma responsabilidade perante você ou terceiros se exercermos esses direitos.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Conduta do Usuário</h2>
              <p>
                Você concorda em não usar o Serviço para:
              </p>
              <ul className={styles.list}>
                <li>Violar quaisquer leis ou regulamentos</li>
                <li>Infringir os direitos de terceiros</li>
                <li>Envolver-se em atividades comerciais não autorizadas</li>
                <li>Carregar ou transmitir vírus ou códigos maliciosos</li>
                <li>Tentar interferir ou interromper o Serviço</li>
                <li>Personificar qualquer pessoa ou entidade</li>
                <li>Manipular identificadores para disfarçar a origem do conteúdo</li>
                <li>Realizar qualquer uso automatizado do sistema</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>6. Propriedade Intelectual</h2>
              <p>
                O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva
                do ChickenTale e seus licenciadores. O Serviço é protegido por direitos autorais, marca registrada e outras leis.
              </p>
              <p>
                Nossas marcas registradas e identidade visual não podem ser usadas em conexão com qualquer produto ou serviço sem o prévio
                consentimento por escrito do ChickenTale.
              </p>
            </section>

            <section className={styles.section}>
              <h2>7. Encerramento</h2>
              <p>
                Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo,
                incluindo, sem limitação, se você violar os Termos.
              </p>
              <p>
                Após o encerramento, seu direito de usar o Serviço cessará imediatamente. Se desejar encerrar sua conta,
                você pode simplesmente descontinuar o uso do Serviço.
              </p>
            </section>

            <section className={styles.section}>
              <h2>8. Limitação de Responsabilidade</h2>
              <p>
                Em nenhum caso o ChickenTale, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por
                quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados,
                uso, boa vontade ou outras perdas intangíveis, resultantes do seu acesso ou uso ou incapacidade de acessar ou usar o Serviço.
              </p>
            </section>

            <section className={styles.section}>
              <h2>9. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material,
                tentaremos fornecer um aviso de pelo menos 30 dias antes que quaisquer novos termos entrem em vigor.
              </p>
            </section>

            <section className={styles.section}>
              <h2>10. Contate-nos</h2>
              <p>
                Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em:
                <br />
                <span className={styles.email}>mail@bero.land</span>
              </p>
            </section>

            <div className={styles.navButtons}>
              <Link href="/privacy" className={styles.policyButton}>
                Ver Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
