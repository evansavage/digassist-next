import React from "react";
// import GoogleLogin from "react-google-login";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const GoogleSignIn = (props: any) => {
  const { clientID, accessToken, setAccessToken, scopes } = props;
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem("accessToken", tokenResponse.access_token);
    },
    scope:
      "profile email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtubepartner-channel-audit",
  });
  return <button onClick={() => login()}>Login to Google</button>;
};

export default GoogleSignIn;
