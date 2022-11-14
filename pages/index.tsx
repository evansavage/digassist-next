import Head from "next/head";
import styles from "../styles/Home.module.css";
import axios from "axios";
import React, {
  useState,
  useEffect,
  MouseEventHandler,
  useContext,
  createContext,
} from "react";
import GoogleSignOut from "../components/GoogleSignOut";
import GoogleSignIn from "../components/GoogleSignIn";
import useSWR from "swr";
import SpotifySignIn from "../components/SpotifySignIn";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { GoogleOAuthProvider } from "@react-oauth/google";
import SpotifySignOut from "../components/SpotifySignOut";
import AccessDenied from "../components/AccessDenied";
import { ExecOptionsWithStringEncoding } from "child_process";
import AuthWrapper from "../components/AuthWrapper";
import SearchResults from "../components/SearchResults";

interface release {
  title: string;
  cover_image: string;
}

const getVideos = async (token: string) => {
  console.log(token);
  const response = await axios
    .get("https://www.googleapis.com/youtube/v3/channels", {
      params: {
        part: "snippet",
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => console.log(err));
  console.log(response?.data.items);
};

export default function Home(props: any) {
  const [accessToken, setAccessToken] = useState<any>("");
  const [spotifyToken, setSpotifyToken] = useState<any>(null);

  const spotifyTest = () => {
    console.log("Bruh");
  };

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setSpotifyToken(localStorage.getItem("spotifyToken"));
  }, []);

  useEffect(() => {
    if (accessToken !== "") {
      getVideos(accessToken);
    }
    if (spotifyToken) {
    }
  }, [accessToken, spotifyToken]);

  return (
    <div className="App">
      <header className="App-header">
        <AuthWrapper
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          spotifyToken={spotifyToken}
          setSpotifyToken={setSpotifyToken}
          spotifyRedirect={props.SPOTIFY_REDIRECT}
        />
      </header>
      <SearchResults />
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { SPOTIFY_REDIRECT: process.env.REDIRECT_URI },
  };
}
