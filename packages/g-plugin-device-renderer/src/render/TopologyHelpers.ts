import { assert } from '../platform/utils';

export enum Topology {
  TRIANGLES,
  TRISTRIP,
  TRIFAN,
  QUADS,
  QUADSTRIP,
}

export function convertToTriangles(
  dstBuffer: Uint16Array | Uint32Array,
  dstOffs: number,
  topology: Topology,
  indexBuffer: Uint16Array | Uint32Array,
): void {
  assert(
    dstOffs + getTriangleIndexCountForTopologyIndexCount(topology, indexBuffer.length) <=
      dstBuffer.length,
  );

  let dst = dstOffs;
  if (topology === Topology.QUADS) {
    for (let i = 0; i < indexBuffer.length; i += 4) {
      dstBuffer[dst++] = indexBuffer[i + 0];
      dstBuffer[dst++] = indexBuffer[i + 1];
      dstBuffer[dst++] = indexBuffer[i + 2];
      dstBuffer[dst++] = indexBuffer[i + 0];
      dstBuffer[dst++] = indexBuffer[i + 2];
      dstBuffer[dst++] = indexBuffer[i + 3];
    }
  } else if (topology === Topology.TRISTRIP) {
    for (let i = 0; i < indexBuffer.length - 2; i++) {
      if (i % 2 === 0) {
        dstBuffer[dst++] = indexBuffer[i + 0];
        dstBuffer[dst++] = indexBuffer[i + 1];
        dstBuffer[dst++] = indexBuffer[i + 2];
      } else {
        dstBuffer[dst++] = indexBuffer[i + 1];
        dstBuffer[dst++] = indexBuffer[i + 0];
        dstBuffer[dst++] = indexBuffer[i + 2];
      }
    }
  } else if (topology === Topology.TRIFAN) {
    for (let i = 0; i < indexBuffer.length - 2; i++) {
      dstBuffer[dst++] = indexBuffer[0];
      dstBuffer[dst++] = indexBuffer[i + 1];
      dstBuffer[dst++] = indexBuffer[i + 2];
    }
  } else if (topology === Topology.QUADSTRIP) {
    for (let i = 0; i < indexBuffer.length - 2; i += 2) {
      dstBuffer[dst++] = indexBuffer[i + 0];
      dstBuffer[dst++] = indexBuffer[i + 1];
      dstBuffer[dst++] = indexBuffer[i + 2];
      dstBuffer[dst++] = indexBuffer[i + 2];
      dstBuffer[dst++] = indexBuffer[i + 1];
      dstBuffer[dst++] = indexBuffer[i + 3];
    }
  } else if (topology === Topology.TRIANGLES) {
    dstBuffer.set(indexBuffer, dstOffs);
  }
}

export function convertToTrianglesRange(
  dstBuffer: Uint16Array | Uint32Array | number[],
  dstOffs: number,
  topology: Topology,
  baseVertex: number,
  numVertices: number,
): void {
  assert(
    dstOffs + getTriangleIndexCountForTopologyIndexCount(topology, numVertices) <= dstBuffer.length,
  );

  let dst = dstOffs;
  if (topology === Topology.QUADS) {
    for (let i = 0; i < numVertices; i += 4) {
      dstBuffer[dst++] = baseVertex + i + 0;
      dstBuffer[dst++] = baseVertex + i + 1;
      dstBuffer[dst++] = baseVertex + i + 2;
      dstBuffer[dst++] = baseVertex + i + 2;
      dstBuffer[dst++] = baseVertex + i + 3;
      dstBuffer[dst++] = baseVertex + i + 0;
    }
  } else if (topology === Topology.TRISTRIP) {
    for (let i = 0; i < numVertices - 2; i++) {
      if (i % 2 === 0) {
        dstBuffer[dst++] = baseVertex + i + 0;
        dstBuffer[dst++] = baseVertex + i + 1;
        dstBuffer[dst++] = baseVertex + i + 2;
      } else {
        dstBuffer[dst++] = baseVertex + i + 1;
        dstBuffer[dst++] = baseVertex + i + 0;
        dstBuffer[dst++] = baseVertex + i + 2;
      }
    }
  } else if (topology === Topology.TRIFAN) {
    for (let i = 0; i < numVertices - 2; i++) {
      dstBuffer[dst++] = baseVertex + 0;
      dstBuffer[dst++] = baseVertex + i + 1;
      dstBuffer[dst++] = baseVertex + i + 2;
    }
  } else if (topology === Topology.QUADSTRIP) {
    for (let i = 0; i < numVertices - 2; i += 2) {
      dstBuffer[dst++] = baseVertex + i + 0;
      dstBuffer[dst++] = baseVertex + i + 1;
      dstBuffer[dst++] = baseVertex + i + 2;
      dstBuffer[dst++] = baseVertex + i + 2;
      dstBuffer[dst++] = baseVertex + i + 1;
      dstBuffer[dst++] = baseVertex + i + 3;
    }
  } else if (topology === Topology.TRIANGLES) {
    for (let i = 0; i < numVertices; i++) dstBuffer[dst++] = baseVertex + i;
  }
}

export function convertToTriangleIndexBuffer(
  topology: Topology,
  indexBuffer: Uint16Array,
): Uint16Array {
  if (topology === Topology.TRIANGLES) return indexBuffer;

  const newSize = getTriangleIndexCountForTopologyIndexCount(topology, indexBuffer.length);
  const newBuffer = new Uint16Array(newSize);
  convertToTriangles(newBuffer, 0, topology, indexBuffer);

  return newBuffer;
}

function range(start: number, length: number): Uint16Array {
  const r = new Uint16Array(length);
  for (let i = 0; i < length; i++) r[i] = start + i;
  return r;
}

export function makeTriangleIndexBuffer(
  topology: Topology,
  baseVertex: number,
  numVertices: number,
): Uint16Array {
  return convertToTriangleIndexBuffer(topology, range(baseVertex, numVertices));
}

export function getTriangleCountForTopologyIndexCount(
  topology: Topology,
  indexCount: number,
): number {
  switch (topology) {
    case Topology.TRIANGLES:
      // One triangle per every three indexes.
      return indexCount / 3;
    case Topology.TRISTRIP:
    case Topology.TRIFAN:
      // One triangle per index, minus the first two.
      return indexCount - 2;
    case Topology.QUADS:
      // Two triangles per four indices.
      return 2 * (indexCount / 4);
    case Topology.QUADSTRIP:
      // Two triangles per two indexes, minus the first two.
      return 2 * (indexCount - 2);
  }
}

export function getTriangleIndexCountForTopologyIndexCount(
  topology: Topology,
  indexCount: number,
): number {
  // Three indexes per triangle.
  return 3 * getTriangleCountForTopologyIndexCount(topology, indexCount);
}

export function filterDegenerateTriangleIndexBuffer(indexData: Uint16Array): Uint16Array {
  assert(indexData.length % 3 === 0);
  const dst = new Uint16Array(indexData.length);
  let dstIdx = 0;

  for (let i = 0; i < indexData.length; i += 3) {
    const i0 = indexData[i + 0];
    const i1 = indexData[i + 1];
    const i2 = indexData[i + 2];

    const isDegenerate = i0 === i1 || i1 === i2 || i2 === i0;
    if (!isDegenerate) {
      dst[dstIdx++] = i0;
      dst[dstIdx++] = i1;
      dst[dstIdx++] = i2;
    }
  }

  return dst.slice(0, dstIdx);
}
