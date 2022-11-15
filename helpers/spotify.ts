import axios from "axios";
import { resolve } from "path";
import { convertCompilerOptionsFromJson, Set } from "typescript";
import Flow from "../components/Flow";
import { FlowContextInterface } from "../components/Flow";

export const discogsToken = "JqlUbPXscGqXqAuzphAKIsAUTPsLWNVciqXeiPsF";

const updateArtistSet = (
  artists: any,
  artistSet: Set<string>,
  callback: Function
) => {
  artists.forEach((artist: any, index: number) => {
    if (!artistSet.has(artist.id)) {
      artistSet.add(artist.id);
      callback();
    }
  });
};

export const searchArtists = async (
  searchKey: string,
  queryType: string,
  flow: any,
  artistSet: Set<string>,
  setArtistSet: Function
) => {
  const nodesLength = flow.getNodes().length;
  var i = 0;
  var artists: any[] = [];

  const { data } = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
    },
    params: {
      q: queryType === "label" ? "label:" + searchKey : searchKey,
      type:
        queryType === "release"
          ? "album"
          : queryType === "label"
          ? "album"
          : queryType,
      limit: 5,
    },
  });
  if (queryType === "release") {
    data.albums.items.forEach((data: any, index: number) => {
      if (!artistSet.has(data.id)) {
        artistSet.add(data.id);
        artists.push({
          id: data.id,
          position: { x: 0, y: index * 50 },
          type: "CustomNode",
          data: {
            label: data.name,
            ...data,
            nodeID: data.id,
          },
        });
        i += 1;
      }
    });
  } else if (queryType === "artist") {
    data.artists.items.forEach((data: any, index: number) => {
      if (!artistSet.has(data.id)) {
        artistSet.add(data.id);
        artists.push({
          id: data.id,
          position: { x: 0, y: index * 50 },
          type: "CustomNode",
          data: {
            label: data.name,
            ...data,
            nodeID: data.id,
          },
        });
        i += 1;
      }
    });
  } else {
    data.albums.items.forEach((data: any, index: number) => {
      if (!artistSet.has(data.id)) {
        artistSet.add(data.id);
        artists.push({
          id: data.id,
          position: { x: 0, y: index * 50 },
          type: "CustomNode",
          data: {
            label: data.name,
            ...data,
            nodeID: data.id,
          },
        });
        i += 1;
      }
    });
  }
  console.log(artists);
  console.log(artistSet);
  setArtistSet(artistSet);
  return artists;
};

export const getRecentArtists = async (
  flow: any,
  artistSet: Set<string>,
  setArtistSet: Function
) => {
  var artists: any[] = [];
  var nodesLength = await flow.getNodes().length;
  var i = 0;
  var resultsArr: any[] = [];

  const recentPlays = await axios
    .get("https://api.spotify.com/v1/me/player/recently-played", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
      },
      params: {
        before: Date.now(),
        limit: 50,
      },
    })
    .then((res) => res.data);
  console.log(recentPlays);
  await recentPlays.items.forEach(async (track: any, index: number) => {
    await track.track.artists.forEach(async (artist: any, index: number) => {
      if (!artistSet.has(artist.id)) {
        artistSet.add(artist.id);
        artists.push(
          axios.get("https://api.spotify.com/v1/artists/" + artist.id, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
            },
          })
        );
      }
    });
  });
  await Promise.all(artists).then((res) => {
    res.forEach((obj, index) => {
      resultsArr.push({
        id: obj.data.id,
        position: {
          x: 0,
          y: index * 50,
        },
        type: "CustomNode",
        data: {
          label: obj.data.name,
          ...obj.data,
          nodeID: obj.data.id,
        },
      });
    });
  });
  return resultsArr;
};

export const recommend = async (flow: any, connection: any) => {
  const srcNode = flow.getNode(connection.source);
  const destNode = flow.getNode(connection.target);
  console.log(srcNode, destNode);
  const { data } = await axios.get(
    "https://api.spotify.com/v1/recommendations" +
      `?seed_artists=${srcNode.data.id},${destNode.data.id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
      },
    }
  );
  console.log(data);
};

export const playArtist = async (
  id: string,
  context: FlowContextInterface | null
) => {
  const players = await axios.get(
    "https://api.spotify.com/v1/me/player/devices",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
      },
    }
  );
  const device = players.data.devices[0].id;
  console.log(device);

  await axios
    .put(
      `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
      {
        context_uri: `spotify:artist:${id}`,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
        },
      }
    )
    .then(() => {
      setTimeout(async () => {
        const currentlyPlaying = await axios.get(
          `https://api.spotify.com/v1/me/player/currently-playing`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
            },
          }
        );
        if (currentlyPlaying.data?.item !== null) {
          context?.setCurrentlyPlaying(
            currentlyPlaying.data.item.name +
              " - " +
              currentlyPlaying.data.item.artists
                .map((artist: any) => artist.name)
                .join(", ")
          );
        }
      }, 2000);
    });
};
