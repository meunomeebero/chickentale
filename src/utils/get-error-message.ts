import { SessionStorage } from "@/components/login";

export const getErrorMessage = (error: any) => {
    const message: string = error?.response?.data?.message ?? "Vish, nem eu sei qual erro aconteceu";

    if (message.includes("invalid_token")) {
        sessionStorage.removeItem(SessionStorage.TOKEN);
        sessionStorage.removeItem(SessionStorage.USER);
        window.location.reload();
        return "Sessão finalizada"
    }

    return message;
}
