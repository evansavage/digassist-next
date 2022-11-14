import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Node, Edge, ReactFlowProvider } from "reactflow";
import Flow from "./Flow";

// import useWindowSize, { WindowSize } from "../helpers/useWindowSize";

interface SearchResults {
  artists: Node[];
  discogsArtists: object[];
}

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

function SearchResults({ artists, discogsArtists }: SearchResults) {
  // const size: WindowSize = useWindowSize();
  // console.log(size);

  useEffect(() => {
    setNodes(artists);
  }, [artists]);

  const [nodes, setNodes] = useState<Node[]>(artists);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  return (
    <div style={{ height: 700 }}>
      <ReactFlowProvider>
        <Flow
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default SearchResults;
