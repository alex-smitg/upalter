import { gl } from "./context";
import type { Model } from "./model";
import { uniforms } from "./shader";
import { Transform } from "./transform";


class Mesh {
    transform: Transform = new Transform()
    model: Model | undefined
    texture: WebGLTexture | undefined

    specularEnabled = true
    lightEnabled = true


    draw() {
        gl.uniform1i(uniforms.lightEnabled!, Number(this.lightEnabled))
        gl.uniform1i(uniforms.specularEnabled!, Number(this.specularEnabled))

        if (uniforms.uModelMatrix != null) {
            gl.uniformMatrix4fv(uniforms.uModelMatrix, false, this.transform.getMatrix())
        }

        if (this.texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
        }

        if (this.model) {
            this.model.draw()
        }
    }
}

export { Mesh }