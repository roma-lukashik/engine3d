import { Program } from "../program"

type MeshProps = {
  gl: WebGL2RenderingContext;
  program: Program;
  shape: {
    position: { size: number; data: Float32Array };
    normal: { size: number; data: Float32Array };
    uv: { size: number; data: Float32Array };
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
    return [key, addAttribute(gl, value)]
  }))

  return {
    render: () => render(gl, program, attr),
  }
}

const addAttribute = (gl: WebGL2RenderingContext, value: MeshProps['shape'][keyof MeshProps['shape']]) => {
  const attr = {
    ...value,
    type: gl.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0,
    divisor: 0,
    target: gl.ARRAY_BUFFER,
    count: value.data.length / value.size,
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

  gl.drawArrays(gl.TRIANGLES, 0, attr.position.count)
}
