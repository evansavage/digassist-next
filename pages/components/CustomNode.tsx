import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import axios from "axios";
import { useReactFlow } from "reactflow";

const handleStyle = { left: 20 };

interface GenreInt {
  nodeData: any;
  genre: string;
  token: string;
  // flow: any;
}

const AddNodesGenreButton = ({ nodeData, genre, token }: GenreInt) => {
  // const getGenreArtists = async () => {
  //   const { data } = await axios.get("https://api.spotify.com/v1/search", {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     params: {
  //       q: 'genre:"' + genre + '"',
  //       type: "artist",
  //       limit: 5,
  //     },
  //   });
  //   console.log(nodeData);
  //   var nodesLength = flow.getNodes().length;
  //   data?.artists?.items?.forEach((artist: any, index: number) => {
  //     var refNode = flow.getNode(nodeData.nodeID);
  //     flow.addNodes({
  //       id: (nodesLength + index).toString(),
  //       position: {
  //         x: refNode.position.x,
  //         y: parseInt(refNode.position.y) + index * 50,
  //       },
  //       type: "CustomNode",
  //       data: {
  //         label: artist.name,
  //         ...artist,
  //         token: token,
  //         nodeID: (nodesLength + index).toString(),
  //       },
  //     });
  //   });
  // };

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
      // onClick={() => getGenreArtists()}
    >
      +
    </button>
  );
};

function CustomNode({ data }: any) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);
  const [artistData, setArtistData] = useState<any>({});
  // const flow = useReactFlow();

  const getArtistData = async () => {
    const artistData = await axios.get(
      "https://api.spotify.com/v1/artists/" + data.id,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    // console.log(artistData);
    setArtistData(artistData?.data);
  };

  useEffect(() => {
    getArtistData();
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
        <div style={{ marginBottom: 10 }}>{data.label}</div>
        <div>
          {artistData?.genres?.map((genre: string, index: number) => (
            <span key={index}>
              {genre}
              <AddNodesGenreButton
                nodeData={data}
                genre={genre}
                token={data.token}
                // flow={flow}
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
