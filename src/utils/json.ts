export const json = (data: Record<string, unknown>) => {
    return JSON.parse(JSON.stringify(data));
}