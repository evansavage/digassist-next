import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Node, Edge, ReactFlowProvider } from "reactflow";
import Flow from "./Flow";

import useWindowSize from "../helpers/useWindowSize";

interface SearchResults {
  artists: Node[];
  discogsArtists: object[];
}

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

function SearchResults({ artists, discogsArtists }: SearchResults) {
  const initialNodes: Node[] = [
    {
      id: "1",
      data: { label: "Node 1" + Math.random() },
      type: "CustomNode",
      position: { x: 5, y: 5 },
    },
    {
      id: "2",
      data: { label: "Node 2" },
      type: "CustomNode",
      position: { x: 5, y: 100 },
    },
  ];

  const size = useWindowSize();

  useEffect(() => {
    setNodes(artists);
  }, [artists]);

  const [nodes, setNodes] = useState<Node[]>(artists);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  return (
    <div style={{ height: size?.height - 90 }}>
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
