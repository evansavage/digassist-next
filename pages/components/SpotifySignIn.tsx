import React, { useEffect } from "react";
// import GoogleLogin from "react-google-login";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const SPOTIFY_CLIENT_ID = "e7d2ff66c7054a389f0c5c65db30bf46";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

interface SignIn {
  spotifyToken: string;
  setSpotifyToken: Function;
}

const SpotifySignIn = (props: SignIn) => {
  const { spotifyToken, setSpotifyToken } = props;

  useEffect(() => {
    const hash: any = window.location.hash;
    let token: any = window.localStorage.getItem("spotifyToken");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem: string) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      localStorage.setItem("spotifyToken", token);
    }

    setSpotifyToken(token);
  }, []);

  return (
    <a
      href={`${AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
    >
      Login to Spotify
    </a>
  );
};

export default SpotifySignIn;
