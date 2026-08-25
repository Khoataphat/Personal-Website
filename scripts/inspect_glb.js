import fs from 'fs';
import path from 'path';

const glbPath = path.resolve('public/models/avatar.glb');
const buffer = fs.readFileSync(glbPath);

const jsonChunkLength = buffer.readUInt32LE(12);
const jsonBuffer = buffer.subarray(20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonBuffer.toString('utf8'));

// Find mesh for Hand_Hand_0
const handMesh = gltf.meshes.find(m => m.name === 'Hand_Hand_0');
console.log('Hand mesh primitives:', JSON.stringify(handMesh.primitives, null, 2));

const posAccessorIndex = handMesh.primitives[0].attributes.POSITION;
const posAccessor = gltf.accessors[posAccessorIndex];
console.log('Hand POSITION Accessor min/max:', {
  min: posAccessor.min,
  max: posAccessor.max,
  count: posAccessor.count,
});

// Also inspect Maze position accessor
const mazeMesh = gltf.meshes.find(m => m.name === 'Maze_Maze_0');
const mazePosAcc = gltf.accessors[mazeMesh.primitives[0].attributes.POSITION];
console.log('Maze POSITION Accessor min/max:', {
  min: mazePosAcc.min,
  max: mazePosAcc.max,
  count: mazePosAcc.count,
});
