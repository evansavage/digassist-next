import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
} from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  Node,
  Connection,
  EdgeChange,
  Edge,
  FitViewOptions,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import CustomNode from "./CustomNode";
import axios from "axios";
import { searchArtists, getRecentArtists, recommend } from "../helpers/spotify";

export interface FlowContextInterface {
  artistSet: Set<string>;
  setArtistSet: Function;
}

export const TestContext = createContext<FlowContextInterface | null>(null);

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

const Flow = () => {
  // you can access the internal state here
  const flow = useReactFlow();
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState<any>([]);
  const [artistSet, setArtistSet] = useState<Set<string>>(new Set());
  const [discogsArtists, setDiscogsArtists] = useState([]);
  const [queryType, setQueryType] = useState("artist");
  const [nodes, setNodes] = useState<Node[]>(artists);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    setNodes(artists);
  }, [artists]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log(changes);
      setNodes((nds: any) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log(changes);
      setEdges((eds: any) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds: any) => addEdge(connection, eds));
      recommend(flow, connection);
    },
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ CustomNode: CustomNode }), []);

  return (
    <TestContext.Provider value={{ artistSet, setArtistSet }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const newArtists = await searchArtists(
            searchKey,
            queryType,
            flow,
            artistSet,
            setArtistSet
          );
          setNodes([...nodes, ...newArtists]);
        }}
      >
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
      <button
        onClick={async (e) => {
          const newArtists = await getRecentArtists(
            flow,
            artistSet,
            setArtistSet
          );
          console.log(newArtists);
          setNodes([...nodes, ...newArtists]);
        }}
      >
        Get Recent Artists
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        fitViewOptions={fitViewOptions}
      >
        <MiniMap pannable zoomable />
        <Controls />
        <Background />
      </ReactFlow>
    </TestContext.Provider>
  );
};
export default Flow;
