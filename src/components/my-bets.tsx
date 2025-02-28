import styles from "../styles/home.module.css";

type MyBetsProps = {
    c1: number;
    c2: number;
    myTickets: number;
    myMoney: number;
    isLoading?: boolean;
}

export function MyBets({ c1, c2, myMoney, myTickets, isLoading = false }: MyBetsProps) {
    // Formatação dos ganhos para o formato brasileiro de moeda
    const formattedMoney = myMoney.toFixed(2).replace('.', ',');

    return (
        <div className={styles.betsContainer}>
            <div className={styles.betsContent}>
                <h1>Minhas apostas</h1>
                <div className={styles.myBets}>
                    <div className={styles.betC1}>
                        <strong className={styles.betText}>
                            c1 <br/>
                            {isLoading ? <span className={styles.loadingText}>Carregando...</span> : c1}
                        </strong>
                    </div>
                    <div className={styles.betC2}>
                        <strong className={styles.betText}>
                            c2 <br/>
                            {isLoading ? <span className={styles.loadingText}>Carregando...</span> : c2}
                        </strong>
                    </div>
                </div>
            </div>
            <div className={styles.betsContent}>
                <h1>Ganhos e Tickets</h1>
                <div className={styles.myBets}>
                    <div className={styles.betC1}>
                        <strong className={styles.betText}>
                            Ganhos <br/>
                            {isLoading ? <span className={styles.loadingText}>Carregando...</span> : `${formattedMoney} G`}
                        </strong>
                    </div>
                    <div className={styles.betC2}>
                        <strong className={styles.betText}>
                            Tickets <br/>
                            {isLoading ? <span className={styles.loadingText}>Carregando...</span> : `${myTickets} und`}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    )
}
