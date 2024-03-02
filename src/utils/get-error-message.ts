export const getErrorMessage = (error: any) => {
    return error?.response?.data?.message ?? "Vish, nem eu sei qual erro aconteceu";
}
