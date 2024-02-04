import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useCallback } from 'react';
import styles from "../styles/home.module.css"

export function Login() {
  const login = useCallback((res: CredentialResponse) => {
    console.log(res.credential);
  }, []);

  return (
    <div className={styles.loginButtonContainer}>
      <GoogleLogin
        onSuccess={login}
        shape="circle"
        size='medium'
        theme='filled_black'
        text='signin'
      />
    </div>
  );
}