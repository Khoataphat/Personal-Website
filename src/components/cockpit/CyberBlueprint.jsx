import React, { useState } from 'react';
import { soundFx } from '../../services/soundFx';
import { Cpu, Activity, Zap, Info } from 'lucide-react';

const BLUEPRINT_CONFIGS = {
  'smart-home-iot': {
    title: 'Distributed IoT Sensor Telemetry & Command Pipeline',
    nodes: [
      { id: 'sensor', label: 'ESP32 Sensor Array', x: 60, y: 110, protocol: 'MQTT / I2C', latency: '< 5ms', role: 'Hardware Publisher (Temp, Motion, Light)' },
      { id: 'broker', label: 'Mosquitto Broker', x: 210, y: 110, protocol: 'MQTT (Port 1883)', latency: '~12ms', role: 'Pub/Sub Message Bus & QoS Broker' },
      { id: 'gateway', label: 'Python Gateway', x: 360, y: 70, protocol: 'WebSockets / REST', latency: '< 18ms', role: 'State Machine & Device Sync Controller' },
      { id: 'db', label: 'Firebase DB', x: 520, y: 70, protocol: 'WSS Realtime Sync', latency: '< 35ms', role: 'Time-series Log & State Persistence' },
      { id: 'dash', label: 'React Dashboard', x: 520, y: 160, protocol: 'Socket.io Client', latency: '< 45ms', role: 'Bidirectional Control Interface' },
    ],
    edges: [
      { from: 'sensor', to: 'broker', color: '#00f2fe', dur: '1.6s' },
      { from: 'broker', to: 'gateway', color: '#00f2fe', dur: '1.4s' },
      { from: 'gateway', to: 'db', color: '#7928ca', dur: '1.8s' },
      { from: 'gateway', to: 'dash', color: '#00f2fe', dur: '1.2s' },
    ],
  },
  'warehouse-management-dsa': {
    title: 'High-Throughput Order Ingestion & Fast BST Dispatch Engine',
    nodes: [
      { id: 'input', label: 'Order Stream Ingest', x: 60, y: 110, protocol: 'Buffered File I/O', latency: '0.1ms', role: 'Batch Payload Tokenizer & Parser' },
      { id: 'bst', label: 'BST Index Engine', x: 210, y: 70, protocol: 'O(log n) Tree Traversal', latency: '< 0.05ms', role: 'Fast Stock Lookup & Inventory Binary Tree' },
      { id: 'pqueue', label: 'Priority Dispatcher', x: 360, y: 70, protocol: 'Min-Heap / Heapify', latency: '< 0.02ms', role: 'Urgent Order Prioritization' },
      { id: 'matrix', label: 'Warehouse Grid 2D', x: 520, y: 110, protocol: 'Hash Map Matrix', latency: '< 0.1ms', role: 'Shelf Slot Allocation & Route Optimizer' },
      { id: 'report', label: 'Analytics Logger', x: 360, y: 160, protocol: 'CSV / Binary Serialization', latency: '< 1ms', role: 'Fulfillment Metrics & Audit Log' },
    ],
    edges: [
      { from: 'input', to: 'bst', color: '#00f2fe', dur: '1.4s' },
      { from: 'bst', to: 'pqueue', color: '#00f2fe', dur: '1.2s' },
      { from: 'pqueue', to: 'matrix', color: '#7928ca', dur: '1.6s' },
      { from: 'input', to: 'report', color: '#7928ca', dur: '2.0s' },
    ],
  },
  'saving-sir-nghia-oop': {
    title: 'Entity Component System & Physics Collision Architecture',
    nodes: [
      { id: 'input', label: 'Input Handler', x: 60, y: 110, protocol: 'AWT KeyListener Event', latency: '16.6ms (60 FPS)', role: 'Keyboard / Joystick Event Polling' },
      { id: 'loop', label: 'Core Game Engine', x: 210, y: 110, protocol: 'State & Factory Pattern', latency: 'Fixed Delta Time', role: 'Entity Lifecycle & Finite State Machine' },
      { id: 'physics', label: 'AABB Collider', x: 360, y: 65, protocol: 'Spatial Bounding Box', latency: '< 0.8ms', role: 'Hitbox & Terrain Collision Solver' },
      { id: 'audio', label: 'Sound FX Mixer', x: 360, y: 160, protocol: 'Java Sound Clip API', latency: 'Direct Buffer', role: 'Dynamic BGM & Audio Synthesis' },
      { id: 'render', label: 'Canvas Pipeline', x: 520, y: 110, protocol: 'Double-Buffered Graphics2D', latency: '16.6ms', role: 'Sprite Animation & Frame Buffer' },
    ],
    edges: [
      { from: 'input', to: 'loop', color: '#00f2fe', dur: '1.1s' },
      { from: 'loop', to: 'physics', color: '#00f2fe', dur: '1.3s' },
      { from: 'loop', to: 'audio', color: '#7928ca', dur: '1.5s' },
      { from: 'physics', to: 'render', color: '#00f2fe', dur: '1.2s' },
    ],
  },
  'secure-voting-system': {
    title: 'Cryptographic Ballot Verification & Immutable Ledger',
    nodes: [
      { id: 'voter', label: 'Voter Terminal', x: 60, y: 110, protocol: 'HTTPS / TLS 1.3', latency: '~25ms', role: 'Voter Authentication & Session Handshake' },
      { id: 'crypto', label: 'RSA / SHA-256', x: 210, y: 110, protocol: '2048-bit Asymmetric', latency: '< 2ms', role: 'Blind Ballot Signature & Hashing' },
      { id: 'guard', label: 'Anti-Duplicate Engine', x: 360, y: 70, protocol: 'ACID Constraint Check', latency: '< 4ms', role: 'Single-Vote Enforcement Filter' },
      { id: 'db', label: 'MySQL Ledger', x: 520, y: 70, protocol: 'JDBC Hikari Pool', latency: '< 12ms', role: 'Relational Tally Storage & Trigger Log' },
      { id: 'audit', label: 'Public Auditor', x: 520, y: 160, protocol: 'Merkle Hash Verification', latency: 'Realtime', role: 'Live Ballot Verification Webhook' },
    ],
    edges: [
      { from: 'voter', to: 'crypto', color: '#00f2fe', dur: '1.3s' },
      { from: 'crypto', to: 'guard', color: '#00f2fe', dur: '1.2s' },
      { from: 'guard', to: 'db', color: '#7928ca', dur: '1.5s' },
      { from: 'crypto', to: 'audit', color: '#00f2fe', dur: '1.8s' },
    ],
  },
};

export function CyberBlueprint({ projectId }) {
  const config = BLUEPRINT_CONFIGS[projectId] || BLUEPRINT_CONFIGS['smart-home-iot'];
  const [selectedNode, setSelectedNode] = useState(config.nodes[0]);

  const handleNodeClick = (node) => {
    soundFx.playChirp();
    setSelectedNode(node);
  };

  // Find node coordinates helper
  const getNode = (id) => config.nodes.find((n) => n.id === id);

  return (
    <div className="space-y-4 font-mono select-none">
      {/* Blueprint Header Sub-bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-[#00f2fe]">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="font-bold tracking-wider">{config.title}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-bold">
          INTERACTIVE SVG FLOW
        </span>
      </div>

      {/* SVG Architecture Diagram Canvas */}
      <div className="relative w-full h-[220px] bg-black/60 rounded-xl border border-[#00f2fe]/30 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Background Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f2fe08_1px,transparent_1px),linear-gradient(to_bottom,#00f2fe08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <svg viewBox="0 0 620 220" className="w-full h-full">
          {/* Animated Connecting Edges */}
          {config.edges.map((edge, idx) => {
            const fromNode = getNode(edge.from);
            const toNode = getNode(edge.to);
            if (!fromNode || !toNode) return null;

            const pathD = `M ${fromNode.x} ${fromNode.y} C ${(fromNode.x + toNode.x) / 2} ${fromNode.y}, ${(fromNode.x + toNode.x) / 2} ${toNode.y}, ${toNode.x} ${toNode.y}`;

            return (
              <g key={`edge-${idx}`}>
                {/* Background Track Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.25"
                  strokeDasharray="4 3"
                />

                {/* Animated Energy Flowing Packet */}
                <circle r="3.5" fill={edge.color} filter="drop-shadow(0 0 6px currentColor)">
                  <animateMotion
                    path={pathD}
                    dur={edge.dur || '1.5s'}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Architecture Nodes */}
          {config.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Node Glow Halo */}
                {isSelected && (
                  <circle
                    r="24"
                    fill="none"
                    stroke="#00f2fe"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{ transformOrigin: '0 0' }}
                  />
                )}

                {/* Node Box */}
                <rect
                  x="-55"
                  y="-18"
                  width="110"
                  height="36"
                  rx="6"
                  fill={isSelected ? '#0a1628' : '#070b14'}
                  stroke={isSelected ? '#00f2fe' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isSelected ? '2' : '1'}
                  className="transition-all duration-200 group-hover:stroke-[#00f2fe]"
                />

                {/* Node Label */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize="9.5"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="monospace"
                  letterSpacing="0.02em"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Telemetry & Specification Card */}
      {selectedNode && (
        <div className="p-3.5 rounded-xl bg-black/50 border border-[#00f2fe]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,254,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
              <span className="font-bold text-white tracking-wider">{selectedNode.label}</span>
              <span className="text-[10px] text-[#00f2fe] px-1.5 py-0.2 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/30">
                {selectedNode.protocol}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">{selectedNode.role}</p>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-zinc-300 font-mono flex-shrink-0">
            <div className="p-1.5 rounded bg-white/5 border border-white/10 text-center">
              <div className="text-[9px] text-zinc-500">LATENCY</div>
              <div className="text-[#00f2fe] font-bold">{selectedNode.latency}</div>
            </div>
            <div className="p-1.5 rounded bg-white/5 border border-white/10 text-center">
              <div className="text-[9px] text-zinc-500">STATUS</div>
              <div className="text-emerald-400 font-bold">OPERATIONAL</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
