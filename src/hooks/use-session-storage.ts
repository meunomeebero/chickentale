import { useEffect, useState } from "react";

let window: Window | undefined;

export function useSessionStorage() {
    const [sessionStorage, setSessionStorage] = useState<Storage | undefined>();

    useEffect(() => {
        if (typeof window !== "undefined") {
            window = window;
            setSessionStorage(window.sessionStorage);
        }
    }, [window]);

    return { sessionStorage };
}
