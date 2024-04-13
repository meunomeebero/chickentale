import styles from '../styles/home.module.css';

export function ConversationBox() {
    return (
        <div className={styles.cbContainer}>
            <div className={styles.cbContent}>
                <img src="" alt="" />
                <strong className={styles.cbText}>
                    Parece que vc perdeu, que peninha, tente novamente, eu tenho certeza que dessa vez vai dar certo!
                </strong>
            </div>
        </div>
    )
}
