import { SessionStorage } from "@/components/login";
import { Users } from "@prisma/client";
import { useState, useEffect } from "react";

type state = {
    user: Users;
    token: string;
}

const useSessionStorage = (data?: any) => {
  const [session, setSession] = useState({} as state)

  useEffect(() => {
    const user = sessionStorage?.getItem(SessionStorage.USER);
    const token = sessionStorage?.getItem(SessionStorage.TOKEN);
    if (!user || !token) return;
    setSession({ user: JSON.parse(user), token: token });
  }, [data]);

  return { session, setSession }
}

export default useSessionStorage
