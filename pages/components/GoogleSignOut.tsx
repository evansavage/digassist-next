import React from "react";
import { googleLogout, GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleSignOut(props: any) {
  const { clientID, setAccessToken } = props;

  const logout = () => {
    googleLogout();
    setAccessToken(null);
    localStorage.setItem("accessToken", "");
  };

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <button onClick={() => logout()}>Logout of Google</button>
    </GoogleOAuthProvider>
  );
}
