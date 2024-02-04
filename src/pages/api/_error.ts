import { NextApiResponse } from "next";

export class HTTPError extends Error {
    readonly message: string;
    readonly statusCode: number;

    constructor({ message, code }: { message: string, code: number }) {
        super();
        this.message = message;
        this.statusCode = code;    
    }
}

export const handleHTTPError = (res: NextApiResponse, error: any) => {
    if (error instanceof HTTPError) {
        return res.status(error.statusCode).json({
            message: error.message,
            status: error.statusCode,
        })
    } else {
        return res.status(500).json({ message: "internal server error" });
    }
}