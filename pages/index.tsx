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

const SPOTIFY_CLIENT_ID = "e7d2ff66c7054a389f0c5c65db30bf46";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const clientID =
  "170771151462-8im6g61eldsjhl4f1qbv5bf70gg5q76e.apps.googleusercontent.com";
const googleScopes =
  "profile email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtubepartner-channel-audit";

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

const GoogleAuthWrapper = ({
  clientID,
  children,
}: {
  clientID: string;
  children: any;
}) => {
  return (
    <GoogleOAuthProvider clientId={clientID}>{children}</GoogleOAuthProvider>
  );
};

export default function Home(props: { data: any }) {
  // console.log(data);
  const [accessToken, setAccessToken] = useState<any>("");
  const [spotifyToken, setSpotifyToken] = useState<any>(null);
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [discogsArtists, setDiscogsArtists] = useState([]);
  const [queryType, setQueryType] = useState("artist");
  const { data: session, status } = useSession();

  const spotifyTest = () => {
    console.log("Bruh");
  };

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setSpotifyToken(localStorage.getItem("spotifyToken"));
    console.log(session);
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
    console.log(discogsData);

    setDiscogsArtists(discogsData?.data?.results);
    if (queryType === "release") {
      setArtists(data.albums.items);
    } else if (queryType === "artist") {
      setArtists(data.artists.items);
    } else {
      setArtists(data.albums.items);
    }
  };

  useEffect(() => {
    console.log(artists);
  }, [artists]);

  if (status !== "authenticated") {
    return <AccessDenied />;
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 20px",
            }}
          >
            <p>DigAssist</p>
            <div>
              <GoogleAuthWrapper clientID={clientID}>
                {accessToken !== "" ? (
                  <GoogleSignOut
                    clientID={clientID}
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    scopes={googleScopes}
                  />
                ) : (
                  <GoogleSignIn
                    scopes={googleScopes}
                    clientID={clientID}
                    setAccessToken={setAccessToken}
                  />
                )}
              </GoogleAuthWrapper>
              {spotifyToken !== null ? (
                <SpotifySignOut
                  spotifyToken={spotifyToken}
                  setSpotifyToken={setSpotifyToken}
                />
              ) : (
                <SpotifySignIn
                  spotifyToken={spotifyToken}
                  setSpotifyToken={setSpotifyToken}
                />
              )}
            </div>
          </div>
        </header>
      </div>
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

      <div style={{ display: "flex" }}>
        <div>
          {artists.map((artist: any) => {
            return (
              <div key={artist.id}>
                {artist.images.length ? (
                  <Image
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                    src={artist.images[0].url}
                    alt={artist.name + artist.id}
                  />
                ) : (
                  <div style={{ width: 100, height: 100 }}>No Image</div>
                )}
                {artist.name}
              </div>
            );
          })}
        </div>
        <div>
          {discogsArtists.map((release: release, index: number) => {
            return (
              <div key={index}>
                <Image
                  src={release.cover_image}
                  alt={release.title}
                  style={{ objectFit: "cover" }}
                  width={100}
                  height={100}
                />
                {release.title}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const test = () => {
    console.log("bruh");
  };

  const auth: any = await axios
    .get("https://api.discogs.com/database/search", {
      params: {
        q: "Nirvana",
        token: discogsToken,
        type: "release",
      },
    })
    .catch((err) => console.log(err));

  const releaseInfo = await axios
    .get(`https://api.discogs.com/masters/${auth.data.results[0].master_id}`)
    .catch((err) => console.log(err));

  // console.log(releaseInfo);

  return {
    props: { data: auth?.data },
  };
}
