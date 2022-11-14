import Head from "next/head";
import styles from "../styles/Home.module.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import GoogleSignOut from "./components/GoogleSignOut";
import GoogleSignIn from "./components/GoogleSignIn";
import useSWR from "swr";
import SpotifySignIn from "./components/SpotifySignIn";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { GoogleOAuthProvider } from "@react-oauth/google";
import SpotifySignOut from "./components/SpotifySignOut";
import AccessDenied from "./components/AccessDenied";
import { ExecOptionsWithStringEncoding } from "child_process";
import AuthWrapper from "./components/AuthWrapper";
import SearchResults from "./components/SearchResults";

export const discogsToken = "JqlUbPXscGqXqAuzphAKIsAUTPsLWNVciqXeiPsF";

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
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [discogsArtists, setDiscogsArtists] = useState([]);
  const [queryType, setQueryType] = useState("artist");

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

  const searchArtists = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
      params: {
        q: queryType === "label" ? "label:" + searchKey : searchKey,
        type:
          queryType === "release"
            ? "album"
            : queryType === "label"
            ? "album"
            : queryType,
      },
    });
    const discogsData = await axios
      .get("https://api.discogs.com/database/search", {
        headers: {},
        params: {
          q: searchKey,
          token: discogsToken,
          type: queryType,
          per_page: 20,
          page: 1,
        },
      })
      .catch((err) => console.log(err));

    const myProfile = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    // console.log(data);
    // console.log(discogsData);

    setDiscogsArtists(discogsData?.data?.results);
    if (queryType === "release") {
      setArtists(
        data.albums.items.map((data: any, index: number) => {
          return {
            id: index.toString(),
            position: { x: 0, y: index * 50 },
            type: "CustomNode",
            data: {
              label: data.name,
              ...data,
              token: spotifyToken,
              nodeID: index.toString(),
            },
          };
        })
      );
    } else if (queryType === "artist") {
      setArtists(
        data.artists.items.map((data: any, index: number) => {
          return {
            id: index.toString(),
            position: { x: 0, y: index * 50 },
            type: "CustomNode",
            data: {
              label: data.name,
              ...data,
              token: spotifyToken,
              nodeID: index.toString(),
            },
          };
        })
      );
    } else {
      setArtists(
        data.albums.items.map((data: any, index: number) => {
          return {
            id: index.toString(),
            position: { x: 0, y: index * 50 },
            type: "CustomNode",
            data: {
              label: data.name,
              ...data,
              token: spotifyToken,
              nodeID: index.toString(),
            },
          };
        })
      );
    }
  };

  useEffect(() => {
    console.log(artists);
  }, [artists]);

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
      <form onSubmit={searchArtists}>
        <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
        <select
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
        >
          <option value="artist">Artist</option>
          <option value="release">Release</option>
          <option value="label">Label</option>
        </select>
        <button type={"submit"}>Search</button>
      </form>
      <SearchResults artists={artists} discogsArtists={discogsArtists} />
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { SPOTIFY_REDIRECT: process.env.REDIRECT_URI },
  };
}
