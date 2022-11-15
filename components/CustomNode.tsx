import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import axios from "axios";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import { TestContext, FlowContextInterface } from "./Flow";
// import { playArtist } from "../helpers/spotify";

const handleStyle = { left: 20 };

interface GenreInt {
  nodeData: any;
  genre: string;
  flow: any;
  context: FlowContextInterface | null;
}

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

  await axios.put(
    `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
    {
      context_uri: `spotify:artist:${id}`,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
      },
    }
  );
  const playerState = await axios.get(`https://api.spotify.com/v1/me/player/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
    },
  });
  console.log(context);
  console.log(playerState);
  context?.setCurrentlyPlaying(
    playerState.data.item.name +
      " - " +
      playerState.data.item.artists.map((artist: any) => artist.name).join(", ")
  );
};

const AddNodesGenreButton = ({ nodeData, genre, flow, context }: GenreInt) => {
  const getGenreArtists = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
      },
      params: {
        q: 'genre:"' + genre + '"',
        type: "artist",
        limit: 5,
      },
    });
    console.log(nodeData);
    var nodesLength = flow.getNodes().length;
    var i = 0;
    data?.artists?.items?.forEach((artist: any, index: number) => {
      var refNode = flow.getNode(nodeData.nodeID);
      if (!context?.artistSet.has(artist.id)) {
        context?.artistSet.add(artist.id);
        flow.addNodes({
          id: artist.id,
          position: {
            x: refNode.position.x,
            y: parseInt(refNode.position.y) + index * 50,
          },
          type: "CustomNode",
          data: {
            label: artist.name,
            ...artist,
            nodeID: artist.id,
          },
        });
        i += 1;
      }
    });
    context?.setArtistSet(context?.artistSet);
  };

  return (
    <button
      style={{
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 10,
        height: 18,
        textAlign: "center",
        border: "none",
        backgroundColor: "lightblue",
      }}
      onClick={() => getGenreArtists()}
    >
      +
    </button>
  );
};

function CustomNode({ data }: any) {
  const [artistData, setArtistData] = useState<any>({});

  const flowContext = useContext(TestContext);

  const getArtistData = async () => {
    const artistData = await axios.get(
      "https://api.spotify.com/v1/artists/" + data.id,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotifyToken")}`,
        },
      }
    );
    // console.log(artistData);
    setArtistData(artistData?.data);
  };
  const flow = useReactFlow();

  useEffect(() => {
    // getArtistData();
  }, [data]);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          padding: 20,
          border: "1px solid black",
          borderRadius: 20,
          backgroundColor: "white",
          maxWidth: 300,
        }}
      >
        <Image
          src={
            data?.images[0]
              ? data?.images[0]?.url
              : "/images/artist_placeholder.jpeg"
          }
          alt="yes"
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
        <div style={{ marginBottom: 10 }}>{data?.label}</div>
        <button onClick={() => playArtist(data?.id, flowContext)}>Play</button>
        <div>
          {artistData?.genres?.map((genre: string, index: number) => (
            <span key={index}>
              {genre}
              <AddNodesGenreButton
                nodeData={data}
                genre={genre}
                flow={flow}
                context={flowContext}
              />
            </span>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}

export default CustomNode;
