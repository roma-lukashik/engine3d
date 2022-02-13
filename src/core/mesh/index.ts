import { Program } from "../program"

type MeshProps = {
  gl: WebGL2RenderingContext;
  program: Program;
  shape: {
    position: { size: number; data: Float32Array };
    normal: { size: number; data: Float32Array };
    uv: { size: number; data: Float32Array };
    index: { data: Uint16Array | Uint32Array };
  };
}

export type Mesh = {
  render: () => void;
}

export const createMesh = ({
  gl,
  program,
  shape,
}: MeshProps): Mesh => {
  const attr = Object.fromEntries(Object.entries(shape).map(([key, value]) => {
    return [key, addAttribute(gl, key, value)]
  }))

  return {
    render: () => render(gl, program, attr),
  }
}

const addAttribute = (gl: WebGL2RenderingContext, key: string, value: MeshProps['shape'][keyof MeshProps['shape']]) => {
  const attr = {
    ...value,
    type: value.data.constructor === Float32Array
      ? gl.FLOAT
      : value.data.constructor === Uint16Array
        ? gl.UNSIGNED_SHORT
        : gl.UNSIGNED_INT,
    normalized: false,
    stride: 0,
    offset: 0,
    divisor: 0,
    target: key === 'index' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER,
    count: value.data.length / ('size' in value ? value.size : 1),
    buffer: gl.createBuffer(),
  }
  updateAttribute(gl, attr)
  return attr
}

const updateAttribute = (gl: WebGL2RenderingContext, attr: ReturnType<typeof addAttribute>) => {
  gl.bindBuffer(attr.target, attr.buffer)
  gl.bufferData(attr.target, attr.data, gl.STATIC_DRAW)
}

const render = (gl: WebGL2RenderingContext, program: Program, attr: Record<string, any>) => {
  program.use()
  program.getAttributeLocations().forEach((location, { name, type }) => {
    const attribute = attr[name]
    gl.bindBuffer(attribute.target, attribute.buffer)

    // For matrix attributes, buffer needs to be defined per column
    let numLoc = 1
    if (type === 35674) numLoc = 2 // mat2
    if (type === 35675) numLoc = 3 // mat3
    if (type === 35676) numLoc = 4 // mat4

    const size = attribute.size / numLoc
    const stride = numLoc === 1 ? 0 : numLoc * numLoc * numLoc
    const offset = numLoc === 1 ? 0 : numLoc * numLoc

    for (let i = 0; i < numLoc; i++) {
      gl.vertexAttribPointer(
        location + i,
        size,
        attribute.type,
        attribute.normalized,
        attribute.stride + stride,
        attribute.offset + i * offset,
      )
      gl.enableVertexAttribArray(location + i)
    }
  })

  if (attr.index) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attr.index.buffer)
    gl.drawElements(gl.TRIANGLES, attr.index.count, attr.index.type, attr.index.offset)
  } else {
    gl.drawArrays(gl.TRIANGLES, 0, attr.position.count)
  }
}
