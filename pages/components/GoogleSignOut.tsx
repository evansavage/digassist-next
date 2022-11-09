import React from "react";
import { googleLogout } from "@react-oauth/google";

export default function GoogleSignOut(props: any) {
  const { setAccessToken } = props;

  const logout = () => {
    googleLogout();
    setAccessToken(null);
    localStorage.setItem("accessToken", "");
  };

  return <button onClick={() => logout()}>Logout of Google</button>;
}
