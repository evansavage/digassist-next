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
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
} from "reactflow";
import CustomNode from "./CustomNode";
import Player from "./Player";
import axios from "axios";
import {
  searchArtists,
  getRecentArtists,
  recommend,
  getDeviceID,
  recommendArtists,
} from "../helpers/spotify";

export interface CurrentlyPlayingInterface {
  track: string;
  artists: object[];
}

export interface FlowContextInterface {
  artistSet: Set<string>;
  setArtistSet: Function;
  currentlyPlaying: CurrentlyPlayingInterface;
  setCurrentlyPlaying: Function;
  deviceID: string;
  setDeviceID: Function;
  playerThumbnail: string;
  setPlayerThumbnail: Function;
  checkStateTime: number;
  setCheckStateTime: Function;
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
  const [nodes, setNodes] = useNodesState<Node[]>(artists);
  const [edges, setEdges] = useEdgesState<Edge[]>(initialEdges);
  const [currentlyPlaying, setCurrentlyPlaying] = useState({
    track: "",
    artists: [],
  });
  const [deviceID, setDeviceID] = useState("");
  const [playerThumbnail, setPlayerThumbnail] = useState("");
  const [checkStateTime, setCheckStateTime] = useState(0);

  const dragRef = useRef<any>(null);
  const [target, setTarget] = useState<any>(null);
  const [grouped, setGrouped] = useState(false);

  const onNodeDragStart = (evt: any, node: any) => {
    dragRef.current = node;
  };

  useEffect(() => {
    setNodes(artists);
  }, [artists]);

  useEffect(() => {
    const onLoad = async () => {
      setDeviceID(await getDeviceID());
    };

    onLoad();
  }, []);

  useEffect(() => {
    if (grouped) {
    }
  }, [grouped]);

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.type !== "group") {
          if (node.id === target?.id) {
            console.log(node);
            node.style = { ...node.style, backgroundColor: "grey" };
          } else if (node.id === dragRef.current?.id && target) {
            node.style = {
              ...node.style,
              backgroundColor: "white",
              opacity: 0.5,
            };
          } else {
            node.style = {
              ...node.style,
              backgroundColor: "white",
              opacity: 1,
            };
          }
        }
        return node;
      })
    );
  }, [target]);

  const onNodeDrag = (evt: any, node: any) => {
    // calculate the center point of the node from position and dimensions
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

    // find a node where the center point is inside
    const targetNode = nodes.find(
      (n: any) =>
        centerX > n.position.x &&
        centerX < n.position.x + n.width &&
        centerY > n.position.y &&
        centerY < n.position.y + n.height &&
        n.id !== node.id &&
        n.type !== "group" &&
        node.type !== "group" &&
        !n.parentNode &&
        !node.parentNode // this is needed, otherwise we would always find the dragged node
    );

    setTarget(targetNode);
  };

  const onNodeDragStop = async (evt: any, node: any) => {
    // on drag stop, we swap the colors of the nodes
    const nodeColor = node?.data?.label;
    const targetColor = target?.data.label;
    // Nodes are overlapping
    if (target) {
      console.log(node, target);
      const parentID = "group-" + (Math.random() + 1).toString(36).substring(7);
      node.parentNode = parentID;
      node.extent = "parent";
      node.position = {
        x: 0,
        y: 0,
      };
      target.parentNode = parentID;
      target.position = {
        x: 300,
        y: 0,
      };
      target.extent = "parent";

      setNodes([
        ...nodes,
        node,
        {
          id: parentID,
          type: "group",
          data: { label: null },
          position: {
            x: Math.min(node.position.x, target.position.x),
            y: Math.min(node.position.y, target.position.y),
          },
          style: {
            width: 600,
            height: 600,
            zIndex: 0,
          },
        },
      ]);
      const newArtists = await recommendArtists(
        [target.id, node.id],
        artistSet,
        parentID
      );
      console.log(newArtists);
      setNodes((nodes) => [...nodes, ...newArtists]);
    }

    setTarget(null);
    dragRef.current = null;
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change, index) => {
        if (change.type === "remove") {
          artistSet.delete(flow.getNode(change.id)?.data?.id);
        }
      });
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
    <TestContext.Provider
      value={{
        artistSet,
        setArtistSet,
        currentlyPlaying,
        setCurrentlyPlaying,
        deviceID,
        setDeviceID,
        playerThumbnail,
        setPlayerThumbnail,
        checkStateTime,
        setCheckStateTime,
      }}
    >
      <Player currentlyPlaying={currentlyPlaying} />
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
          const recentArtists = await getRecentArtists(
            flow,
            artistSet,
            setArtistSet
          );
          setNodes([...nodes, ...recentArtists]);
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
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
      >
        <MiniMap pannable zoomable />
        <Controls />
        <Background />
      </ReactFlow>
    </TestContext.Provider>
  );
};
export default Flow;
