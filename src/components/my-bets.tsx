import styles from "../styles/home.module.css";

type MyBetsProps = {
    c1: number;
    c2: number;
    myMoney: number;
}

export function MyBets({ c1, c2, myMoney }: MyBetsProps) {
    return (
        <div className={styles.betsContainer}>
            <div className={styles.betsContent}>
                <h1>Minhas apostas</h1>
                <div className={styles.myBets}>
                    <div className={styles.betC1}>
                        <strong className={styles.betText}>
                            c1 <br/>
                            {c1}
                        </strong>
                    </div>
                    <div className={styles.betC2}>
                        <strong className={styles.betText}>
                            c2 <br/>
                            {c2}
                        </strong>
                    </div>
                </div>
            </div>
            <div className={styles.myGains}>
                <h1>Meus ganhos</h1>
                <div className={styles.myBets}>
                    <div className={styles.betC1}>
                        <strong className={styles.betText}>
                            R$ {myMoney * 2},00
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    )
}