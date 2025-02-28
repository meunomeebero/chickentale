import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useCallback } from 'react';
import styles from "../styles/header.module.css"
import axios from "axios";
import { Users } from '@prisma/client';
import { getErrorMessage } from '@/utils/get-error-message';

export type HandleLoginReturn = {
  user: Users;
  token: string;
}

type LoginProps = {
  handleLogin: (data: HandleLoginReturn) => void;
  user: Users | undefined;
}

export enum SessionStorage {
    USER = '@chickentale:user',
    TOKEN = '@chickentale:token',
}

export function Login({ handleLogin, user }: LoginProps) {
  const login = useCallback(async (res: CredentialResponse) => {
    try {
        const { data } = await axios.post("/api/users/login", {}, {
            headers: {
                Authorization: "Bearer " + res.credential,
            }
        });

        sessionStorage?.setItem(SessionStorage.USER, JSON.stringify(data));
        sessionStorage?.setItem(SessionStorage.TOKEN, String(res.credential));

        handleLogin({ user: data, token: res.credential as string });
    } catch (err) {
        alert("Erro ao realizar o login: " + getErrorMessage(err))
    }
  }, [handleLogin]);

  return !user ? (
    <div className={styles.loginButtonContainer}>
      <GoogleLogin
        onSuccess={login}
        shape="circle"
        size='medium'
        theme='filled_black'
        text='signin'
      />
    </div>
  ) : undefined
}
