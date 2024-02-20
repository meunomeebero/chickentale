import { useCallback, useState } from "react";
import styles from "../styles/home.module.css"

type BuyTicketParams = {
    handleBuyTicket: (quantity: number) => void
}

export function BuyTicket({ handleBuyTicket }: BuyTicketParams) {
    const [quantity, setQuantity] = useState(0);

    const handler = useCallback(() => {
        handleBuyTicket(quantity)
    }, [handleBuyTicket, quantity]);

    return (
        <div className={styles.buyTicketContainer}>
            <input
                type="number"
                className={styles.buyTicketInput}
                onChange={e => setQuantity(Number(e.target.value))}
            />
            <button className={styles.buyTicketButton} onClick={handler}>
             <p className={styles.buttonText}>Comprar tickets</p>
            </button>
        </div>
    );
}
