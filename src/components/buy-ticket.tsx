import { useCallback, useState } from "react";
import styles from "../styles/home.module.css"
import { useQuery } from "react-query";
import axios from "axios";

type TicketPrice = {
    value: number;
    currency: string;
};

type BuyTicketParams = {
    handleBuyTicket: (quantity: number) => void
}

const TICKET_PRICE = 1;

export function BuyTicket({ handleBuyTicket }: BuyTicketParams) {
    const [quantity, setQuantity] = useState(0);

    const handler = useCallback(() => {
        if (quantity <= 0) {
            alert('Por favor, informe uma quantidade válida de tickets');
            return;
        }
        handleBuyTicket(quantity);
    }, [handleBuyTicket, quantity]);

    // Calcular o preço total baseado na quantidade
    const totalPrice = TICKET_PRICE && quantity > 0
        ? (TICKET_PRICE * quantity).toFixed(2).replace('.', ',')
        : '0,00';

    return (
        <div className={styles.buyTicketContainer}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex' }}>
                    <input
                        type="number"
                        className={styles.buyTicketInput}
                        onChange={e => setQuantity(Number(e.target.value))}
                        min="1"
                        value={quantity}
                    />
                    <button className={styles.buyTicketButton} onClick={handler}>
                        <p className={styles.buttonText}>Comprar tickets</p>
                    </button>
                </div>
                <p className={styles.ticketPriceText}>
                    Preço pelos tickets: R$ {totalPrice}
                </p>
            </div>
        </div>
    );
}
