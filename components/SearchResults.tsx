import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Node, Edge, ReactFlowProvider } from "reactflow";
import Flow from "./Flow";

import useWindowSize, { Size } from "../helpers/useWindowSize";

interface SearchResults {
  artists: Node[];
  discogsArtists: object[];
}

function SearchResults() {
  const size: Size = useWindowSize();

  return (
    <div style={{ height: size.height !== undefined ? size.height - 115 : 0 }}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}

export default SearchResults;
