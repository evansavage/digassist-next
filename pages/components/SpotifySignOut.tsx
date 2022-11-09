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

const SpotifySignOut = (props: SignIn) => {
  const { setSpotifyToken } = props;

  const logout = () => {
    console.log("bruh");
    setSpotifyToken(null);
    localStorage.removeItem("spotifyToken");
  };

  return <button onClick={() => logout()}>Logout of Spotify</button>;
};

export default SpotifySignOut;
