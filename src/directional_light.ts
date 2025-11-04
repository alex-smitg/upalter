import { gl } from "./context"
import { uniforms } from "./shader"

class DirectionalLight {
    direction = {"x": 1, "y": 0, "z": 0}
    strength = 1
    color = {"r": 1, "g": 1, "b": 1}

    draw() {
        if (uniforms.dirLightDirection) {
            gl.uniform3f(uniforms.dirLightDirection, this.direction.x,
                 this.direction.y, this.direction.z)
        }
        if (uniforms.dirLightColor) {
            gl.uniform3f(uniforms.dirLightColor, this.color.r,
                 this.color.g, this.color.b)
        }
        if (uniforms.dirLightStrength) {
            gl.uniform1f(uniforms.dirLightStrength, this.strength)
        }
    }
}

export {DirectionalLight}