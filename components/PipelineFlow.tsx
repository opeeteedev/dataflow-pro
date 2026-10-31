"use client";

import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  type Node,
  type BuiltInEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type CustomNodeData = { title: string; subtext?: string };

function CustomNode({ data }: { data: CustomNodeData }) {
  return (
    <div className="w-[280px] p-4 bg-[#0F1523] border border-gray-700 rounded-lg">
      <Handle type="target" position={Position.Left} className="!bg-orange-500" />
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
        <div>
          <p className="whitespace-nowrap text-base font-bold text-white">{data.title}</p>
          {data.subtext && (
            <p className="whitespace-nowrap text-sm text-gray-400">{data.subtext}</p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-orange-500" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

const initialNodes: Node[] = [
  { id: "s1", type: "custom", position: { x: 0, y: 0 }, data: { title: "Web Scraper", subtext: "Product Data" } },
  { id: "s2", type: "custom", position: { x: 0, y: 100 }, data: { title: "API Scraper", subtext: "Price Data" } },
  { id: "s3", type: "custom", position: { x: 0, y: 200 }, data: { title: "Review Scraper", subtext: "Review Data" } },
  { id: "s4", type: "custom", position: { x: 0, y: 300 }, data: { title: "Social Media Scraper", subtext: "Social Data" } },
  { id: "e1", type: "custom", position: { x: 350, y: 0 }, data: { title: "Data Extraction", subtext: "Extraction" } },
  { id: "e2", type: "custom", position: { x: 350, y: 100 }, data: { title: "Schema Validation", subtext: "Validation" } },
  { id: "t1", type: "custom", position: { x: 700, y: 0 }, data: { title: "Data Cleaning", subtext: "Cleaning" } },
  { id: "t2", type: "custom", position: { x: 700, y: 100 }, data: { title: "Data Enrichment", subtext: "Enrichment" } },
  { id: "t3", type: "custom", position: { x: 700, y: 200 }, data: { title: "Data Normalization", subtext: "Normalization" } },
  { id: "d1", type: "custom", position: { x: 1050, y: 0 }, data: { title: "Cleaned Dataset", subtext: "Dataset" } },
  { id: "d2", type: "custom", position: { x: 1050, y: 100 }, data: { title: "Analytics Warehouse", subtext: "Warehouse" } },
  { id: "d3", type: "custom", position: { x: 1050, y: 200 }, data: { title: "Data Lake", subtext: "Storage" } },
];

const initialEdges: BuiltInEdge[] = [
  { id: "e-s1-e1", source: "s1", target: "e1", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-s2-e1", source: "s2", target: "e1", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-s3-e1", source: "s3", target: "e1", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-s4-e1", source: "s4", target: "e1", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-e1-e2", source: "e1", target: "e2", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-e2-t1", source: "e2", target: "t1", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-e2-t2", source: "e2", target: "t2", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-e2-t3", source: "e2", target: "t3", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-t1-d1", source: "t1", target: "d1", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-t2-d2", source: "t2", target: "d2", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
  { id: "e-t3-d3", source: "t3", target: "d3", type: "smoothstep", pathOptions: { borderRadius: 10 }, style: { stroke: "#FF6B00", strokeWidth: 2 } },
];

export default function PipelineFlow() {
  return (
    <ReactFlowProvider>
      <div className="w-full h-[500px] bg-[#0B0F19]">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1, minZoom: 0.85 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          className="bg-[#0B0F19]"
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </ReactFlowProvider>
  );
}