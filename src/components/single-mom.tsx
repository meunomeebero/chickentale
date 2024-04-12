import { use, useCallback, useEffect, useState } from 'react';
import style from '../styles/home.module.css';

export function SingleMom({ position }: { position: 'left' | 'right'}) {
    const [containerStyle, setContainerStyle] = useState("inherit");

    // every 30 seconds set the containerStyle inherit again
    useEffect(() => {
        const interval = setInterval(() => {
            setContainerStyle("inherit");
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const onClick = useCallback(() => {
        console.log(containerStyle);
        setContainerStyle("none");
    }, [containerStyle]);

    return (
        <div
            className={position === 'left' ? style.singleMomContainerLeft : style.singleMomContainerRight}
            style={{ display: containerStyle }}
        >
            <div className={style.singleMomHeader}>
                <h2 className={style.singleMomTitle}>Mães solteiras na região</h2>
                <h2 className={style.singleMomX} onClick={onClick}>X</h2>
            </div>
            <img alt="Mãe solteira" src="/mitinho-sensual-1.png" className={style.singleMomImage}/>
        </div>
    );
}
