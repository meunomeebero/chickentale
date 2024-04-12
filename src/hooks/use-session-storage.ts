import { useMemo } from "react";

let window: Window | undefined;

export function useSessionStorage() {
    const sessionStorage = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.sessionStorage;
        }
    }, [window]);

    return { sessionStorage };
}
