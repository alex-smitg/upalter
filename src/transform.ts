import { mat4 } from "gl-matrix";

class Transform {
    position = {"x": 0, "y": 0, "z": 0}
    rotation = {"x": 0, "y": 0, "z": 0}
    scale = {"x": 1, "y": 1, "z": 1}

    getMatrix(): mat4 {
        let matrix = mat4.create()

        mat4.translate(matrix, matrix, [this.position.x, this.position.y, this.position.z])

        mat4.rotate(matrix, matrix, this.rotation.x, [1.0, 0.0, 0.0])
        mat4.rotate(matrix, matrix, this.rotation.y, [0.0, 1.0, 0.0])
        mat4.rotate(matrix, matrix, this.rotation.z, [0.0, 0.0, 1.0])

        mat4.scale(matrix, matrix, [this.scale.x, this.scale.y, this.scale.z])
        

        return matrix
    }
}

export {Transform}