import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useCallback } from 'react';
import styles from "../styles/home.module.css"
import axios from "axios";
import { Users } from '@prisma/client';

export type HandleLoginReturn = {
  user: Users;
  token: string;
}

type LoginProps = {
  handleLogin: (data: HandleLoginReturn) => void;
  user: Users | undefined;
}

export function Login({ handleLogin, user }: LoginProps) {
  const login = useCallback(async (res: CredentialResponse) => {
    const { data } = await axios.post("/api/users/login", {}, {
      headers: {
        Authorization: "Bearer " + res.credential,
      }
    })

    handleLogin({ user: data, token: res.credential as string });
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