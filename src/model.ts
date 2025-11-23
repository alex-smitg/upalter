import { gl } from "./context";
import { attributes } from "./shader";

const BUFFER_STRIDE: number = 8

class Model {
    verticesCount = 0
    arrayBuffer: WebGLBuffer | null = null
    VAO: WebGLBuffer | null = null

    constructor(verticesBuffer: ArrayBuffer) {
        this.VAO = gl.createVertexArray() 
        gl.bindVertexArray(this.VAO)

        this.arrayBuffer = gl.createBuffer() as WebGLBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer)

        //let textArray: string[] = verticesText.split(",");
        //textArray.pop()
        //this.vertices = textArray.map(Number)


        console.log(verticesBuffer.byteLength)

        

        let fl: Float64Array = new Float64Array(verticesBuffer)
        let ar = [].slice.call(fl)
        this.verticesCount = ar.length / BUFFER_STRIDE
        let f32: Float32Array = new Float32Array(ar)

  

        gl.bufferData(gl.ARRAY_BUFFER, f32, gl.STATIC_DRAW)
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
        gl.bindVertexArray(this.VAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer)
        gl.drawArrays(gl.TRIANGLES, 0, this.verticesCount)
    }
}

export { Model }