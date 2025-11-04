import { uniforms } from "./shader";
import { gl, overlay } from "./context";
import { Mesh } from "./mesh";
import { Model } from "./model";
import { mat4 } from "gl-matrix";
import { AssetManager } from "./asset_manager";
import { playMusic } from "./audio";
import { SceneManager, scenes, camera } from "./scene_manager";



let lastTime: number = performance.now()


let assetManager: AssetManager = new AssetManager

const urls = {
    //models
    "game_name": "./models/game_name.model",
    "cube": "./models/cube.model",
    "she": "./models/she.model",
    "sphere": "./models/sphere.model",
    "isee": "./models/isee.model",
    "core": "./models/core.model",
    "tree": "./models/tree.model",
    "sky_plane": "./models/sky_plane.model",
    "eyeModel": "./models/eye.model",
    "hum": "./models/hum.model",
    "triModel": "./models/tri.model",

    //textures
    "placeholder": "./images/placeholder.png",
    "question": "./images/question.png",
    "black": "./images/black.png",
    "white": "./images/white.png",
    "meat": "./images/meat.png",
    "wood": "./images/wood.png",
    "clouds": "./images/clouds.png",
    "eye": "./images/eye.png",
    "tri": "./images/tri.png",


    "screen": "./music/screen.mp3",
    "delta": "./music/delta.mp3"
} as const

//for debugging 
// document.addEventListener("keydown", (event) => {
//     let input = { "x": 0, "y": 0 }
//     if (event.code == "KeyW" || event.code == "ArrowUp") {
//         input.x = 1
//     }
//     if (event.code == "KeyS" || event.code == "ArrowDown") {
//         input.x = -1
//     }
//     if (event.code == "KeyA" || event.code == "ArrowLeft") {
//         input.y = -1
//     }
//     if (event.code == "KeyD" || event.code == "ArrowRight") {
//         input.y = 1
//     }
//     camera.transform.position.z += input.x
//     camera.transform.position.x -= input.y
// })


main()


async function main() {
    let progress = document.createElement("div")
    progress.className = "progress"
    overlay?.append(progress)

    let progressText = document.createElement("span")
    overlay?.append(progressText)

    const { textures, models, music } = await assetManager.loadAssets(urls, (loaded, total, name) => {
        console.log(`${loaded}/${total} - ${name}`)
        if (overlay) {
            progressText.textContent = `[FETCHING] ${name} - ${loaded}/${total}`
            progress.style.width = `${loaded/total * 100}%`
        }
    });
    
    
    progressText.textContent = "[SCENES INIT]"
    const sceneManager: SceneManager = new SceneManager()
    progressText.textContent = "LEFT CLICK TO START GAME"
    sceneManager.initScenes(textures, models, music)
    //sceneManager.setScene(scenes.menuScene!)
    

    document.onclick = () => {
        progress.remove()
        progressText.remove()
        sceneManager.setScene(scenes.menuScene!)

        document.onclick = () => {}
        
    }




    //webgl
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    

    function loop(now: number) {
        const delta = (now - lastTime) / 1000.0
        lastTime = now

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)


        if (uniforms.uProjectionMatrix) {
            gl.uniformMatrix4fv(uniforms.uProjectionMatrix, false, camera.projMatrix)
        }
        if (uniforms.uViewMatrix) {
            gl.uniformMatrix4fv(uniforms.uViewMatrix, false, camera.transform.getMatrix())
        }

        sceneManager.updateCurrentScene()
        sceneManager.drawCurrentScene()

        requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
}

