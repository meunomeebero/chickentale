import { useMemo } from "react";

export function useSessionStorage() {
    const sessionStorage = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.sessionStorage;
        }
    }, [window]);

    return { sessionStorage };
}
