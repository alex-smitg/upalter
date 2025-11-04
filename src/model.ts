import { gl } from "./context";
import { attributes } from "./shader";

const BUFFER_STRIDE: number = 8

class Model {
    vertices: number[] = []
    arrayBuffer: WebGLBuffer | null = null
    VAO: WebGLBuffer | null = null

    constructor(verticesText: String) {
        this.VAO = gl.createVertexArray() 
        gl.bindVertexArray(this.VAO)

        this.arrayBuffer = gl.createBuffer() as WebGLBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer)

        let textArray: string[] = verticesText.split(",");
        textArray.pop()
        this.vertices = textArray.map(Number)


        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer)


        


        if (attributes.vertexPosition != null) {
            gl.vertexAttribPointer(attributes.vertexPosition,
                3, gl.FLOAT, false, BUFFER_STRIDE * 4, 0)
            gl.enableVertexAttribArray(attributes.vertexPosition)
        }

        if (attributes.vertexTextureCoordinates != null) {
            gl.vertexAttribPointer(attributes.vertexTextureCoordinates,
                2, gl.FLOAT, false, BUFFER_STRIDE * 4, 3 * 4)
            gl.enableVertexAttribArray(attributes.vertexTextureCoordinates)
        }

        if (attributes.vertexNormal != null) {
            gl.vertexAttribPointer(attributes.vertexNormal,
                3, gl.FLOAT, false, BUFFER_STRIDE * 4, 5 * 4)
            gl.enableVertexAttribArray(attributes.vertexNormal)
        }

        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

 

    }

    draw() {
        const vertexCount = this.vertices.length / BUFFER_STRIDE
        gl.bindVertexArray(this.VAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer)
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
    }
}

export { Model }