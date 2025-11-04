import { gl } from "./context";
import { Transform } from "./transform";
import { mat4 } from "gl-matrix";

class Camera {
    transform: Transform = new Transform() //camera transform must be inverted

    #fov = (70 * Math.PI) / 180
    #aspect = gl.canvas.width / gl.canvas.height;
    #zNear = 0.1;
    #zFar = 600.0

    projMatrix = mat4.create()

    constructor() {
        this.recreateMatrix()
    }

    recreateMatrix() {
        mat4.perspective(this.projMatrix, this.#fov, this.#aspect, this.#zNear, this.#zFar)
    }

    setFov(fovAngle: number) {
        this.#fov = (fovAngle * Math.PI) / 180
        this.recreateMatrix()
    }

}

export { Camera }