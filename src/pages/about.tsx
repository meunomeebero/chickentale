import Head from "next/head";
import styles from "../styles/home.module.css"
import Link from "next/link";

export default function about() {
    return (
        <>
            <Head>
                <title>Chickentale</title>
                <meta name="description" content="Galotale é uma rinha de galo virtual" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <div className={styles.homeWrapper}>
                    <header className={styles.homeHeader}>
                        <img src={`/galo-1.png`} alt="chicken" className={styles.homeHeaderChicken}/>
                        <strong className={styles.homeTitle}>Chickentale</strong>
                        <img src={`/galo-2.png`} alt="chicken" className={styles.homeHeaderChicken}/>
                    </header>
                    <div className={styles.background}/>
                    <div className={styles.home}>
                        <div className={styles.homeTextContainer}>
                            <strong className={styles.homeText}>
                                Ola seu nogger! Venha apostar na minha rinha de galinhas não binárias e ganhe muito dinheiro =)
                                <br/>Clique em mim e vamos nos divertir!
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
