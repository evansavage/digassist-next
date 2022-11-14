import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
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

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const recommend = async (flow: any, connection: any) => {
  const srcNode = flow.getNode(connection.source);
  const destNode = flow.getNode(connection.target);
  console.log(srcNode, destNode);
  const { data } = await axios.get(
    "https://api.spotify.com/v1/recommendations" +
      `?seed_artists=${srcNode.data.id},${destNode.data.id}`,
    {
      headers: {
        Authorization: `Bearer ${srcNode.data.token}`,
      },
    }
  );
  console.log(data);
};

const Flow = ({ nodes, edges, setNodes, setEdges }: any) => {
  // you can access the internal state here
  // const flow = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: any) => applyNodeChanges(changes, nds)),
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
      // recommend(flow, connection);
    },
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ CustomNode: CustomNode }), []);

  return (
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
  );
};
export default Flow;
