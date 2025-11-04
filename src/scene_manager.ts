import { gl } from "./context";
import { Camera } from "./camera";
import { dialog, overlay } from "./context";
import { dialogSay, enableLineMovement, getLineMovement, isTextAnimating, lines, setSkipText } from "./dialog";
import { Mesh } from "./mesh";
import type { Model } from "./model";
import { Scene } from "./scene";
import { DirectionalLight } from "./directional_light";
import { Game, Out, Type } from "./game";
import { playMusic } from "./audio";


let scenes: Record<string, Scene | null> = {
    "menuScene": null,
    "firstScene": null,
    "wiresScene": null,
    "lepScene": null,
    "coreScene": null,
    "forestScene": null,
    "gameScene": null,
    "deathScene": null,
    "winScene": null,
    "gameEndScene": null,
    "stupidDeathScene": null
}

let camera: Camera = new Camera()
let dirLight: DirectionalLight = new DirectionalLight()

class SceneManager {
    currentScene: Scene | null = null
    ending = Out.NONE

    initScenes(
        textures: Record<string, WebGLTexture>, //TODO: add types instead records
        models: Record<string, Model>,
        music: Record<string, AudioBuffer>) { //TODO: split scenes to files

        let storyPosition: number = 0 //hack - this should't be inside this class
        let timeout: number = -1;

        const nextLine = () => {
            let line = lines[storyPosition]
            let data = line?.split(":")
            let type = data![0]
            console.log(`[SCENE_MANAGER:DIALOG_TYPE] ${type} ${storyPosition}`)
            switch (type) {
                case "SAY":
                    dialogSay(data![1] ?? "ERROR", data![2] ?? "UNDEFINED")
                    break
                case "TOGGLE":
                    dialog.classList.toggle("hidden")
                    dialogSay("", "")

                    timeout = setTimeout(() => {
                        nextLine()
                    }, 800)
                    break
                case "SCENE":
                    this.setScene(scenes[data![1] ?? "menuScene"]!)
                    enableLineMovement(false)
                    break
                case "WAIT":
                    enableLineMovement(false)
                    setTimeout(() => {
                        enableLineMovement(true)
                        nextLine()
                    }, parseInt(data![1]!))
                    break

            }
            storyPosition += 1
        }


        function clickNextLine() {
            if (!getLineMovement()) return;
            if (!isTextAnimating) {
                if (timeout >= 0) {
                    clearTimeout(timeout)
                    timeout = -1
                }

                nextLine()
            }
            else {
                setSkipText(true)
            }
        }


        document.addEventListener("click", () => {
            clickNextLine()
        })
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.code == "Space") {
                clickNextLine()
            }
        })




        const menuScene = new Scene()
        menuScene.onAttach = () => {
            let a: Mesh = new Mesh()
            a.model = models.game_name
            a.texture = textures.meat

            let textElement = document.createElement("span")
            textElement.style.color = "white"
            textElement.textContent = "Click to start"
            textElement.style.fontSize = "32px"
            textElement.style.height = "100%"
            textElement.style.width = "100%"
            textElement.style.alignContent = "center"
            textElement.style.textAlign = "center"
            textElement.style.display = "block"
            overlay?.append(textElement)

            camera.transform.position.z = -2.3
            camera.transform.position.y = 0.5
            camera.setFov(90)

            let time = 0

            const click = (event: PointerEvent) => {
                this.setScene(scenes.firstScene!)
            }

            document.addEventListener("click", click)

            dirLight.direction.z = 0.2
            dirLight.direction.y = -1
            dirLight.direction.x = 0
            dirLight.color.r = 1
            dirLight.color.g = 0
            dirLight.color.b = 0
            dirLight.strength = 0.5


            const code = (e: KeyboardEvent) => {
                if (e.key >= "0" && e.key <= "9") {
                    inputCode += e.key

                } else if (e.key === "Enter") {
                    if (inputCode === "3621") {
                        inputCode = ""
                        console.log(`Верный код`)
                        playMusic(music.delta)
                        this.setScene(scenes.gameScene!)
                    } else {
                        console.log(`Неверный код ${inputCode}`)
                        inputCode = ""
                    }

                }
            }

            let inputCode = ""
            document.addEventListener("keydown", code)

            menuScene.onUpdate = () => {

                camera.transform.rotation.y += Math.sin(time / 100.0) / 500.0
                camera.transform.rotation.z += Math.sin(time / 100.0) / 1000.0
                time += 1
            }

            menuScene.onDraw = () => {
                dirLight.draw()
                a.draw()
            }
            menuScene.onDetach = () => {
                document.removeEventListener("click", click)
                overlay?.removeChild(textElement)
                document.removeEventListener("keydown", code)
            }
        }
        scenes.menuScene = menuScene


        //firstScene
        const firstScene = new Scene()
        firstScene.onAttach = () => {
            camera.transform.rotation.x = 0.0
            camera.transform.rotation.y = 0.0
            camera.transform.rotation.z = 0.0
            
            nextLine()
            dialog.classList.toggle("hidden")
            enableLineMovement(true)



            firstScene.onUpdate = () => {

            }



            firstScene.onDraw = () => {

            }
            firstScene.onDetach = () => {

            }
        }
        scenes.firstScene = firstScene

        //wires
        const wiresScene = new Scene()
        wiresScene.onAttach = () => {
            let mesh: Mesh = new Mesh()
            mesh.model = models.she
            mesh.texture = textures.meat
            let time = 0

            playMusic(music.delta)
            dirLight.direction.z = 0.5
            dirLight.direction.y = 0.2
            dirLight.direction.x = 1.0
            dirLight.color.r = 1
            dirLight.color.g = 0
            dirLight.color.b = 0
            dirLight.strength = 1.1

            camera.transform.rotation.x = 0.9
            camera.setFov(49)
            camera.transform.position.z = -36.0
            camera.transform.rotation.y = -0.5

            setTimeout(() => {
                this.setScene(scenes["lepScene"]!)
            }, 6000)



            wiresScene.onDraw = () => {
                gl.clearColor(1.0, 0.0, 0.0, 1.0)
                gl.clearDepth(1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

                dirLight.draw()
                mesh.draw()
            }

            wiresScene.onUpdate = () => {
                camera.transform.rotation.x += Math.sin(time / 100.0) / 500.0
                camera.transform.position.z += 0.01
                camera.transform.rotation.y += 0.001
                time += 1
            }
        }
        scenes.wiresScene = wiresScene

        //lep
        const lepScene = new Scene()
        lepScene.onAttach = () => {
            let mesh: Mesh = new Mesh()
            mesh.model = models.isee
            mesh.texture = textures.meat

            camera.transform.position.y = -0.5
            camera.transform.position.x = 0.2

            camera.transform.rotation.y = 1.9
            camera.transform.rotation.x = -0.4
            camera.transform.position.z = 0.0
            camera.setFov(60)

            enableLineMovement(true)
            nextLine()

            lepScene.onDraw = () => {
                gl.clearColor(1.0, 0.0, 0.0, 1.0)
                gl.clearDepth(1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
                mesh.draw()
            }



            lepScene.onUpdate = () => {
                if (camera.transform.rotation.x >= -0.7) {
                    camera.transform.rotation.x -= 0.0004
                }
            }
        }
        scenes.lepScene = lepScene



        const coreScene = new Scene()
        coreScene.onAttach = () => {
            let mesh: Mesh = new Mesh()
            mesh.model = models.core
            mesh.texture = textures.meat

            let eye: Mesh = new Mesh()
            eye.model = models.eyeModel
            eye.texture = textures.eye

            camera.transform.position.x = 0
            camera.transform.position.y = 0
            camera.transform.position.z = -4
            camera.transform.rotation.x = 0
            camera.transform.rotation.y = 0
            camera.transform.rotation.z = 0.0

            dirLight.color.r = 1
            dirLight.color.g = 0.5
            dirLight.color.b = 0.5
            dirLight.direction.x = -1.0
            dirLight.direction.z = -0.2
            dirLight.direction.y = 0.1
            dirLight.strength = 0.0


            let time = 0

            setTimeout(() => {
                enableLineMovement(true) //WHY
                nextLine() //?????
                this.setScene(scenes["forestScene"]!)

            }, 11000)

            eye.transform.position.z = -0.2

            coreScene.onUpdate = () => {
                if (camera.transform.position.z < -3) {
                    camera.transform.position.z += 0.001
                }

                dirLight.direction.x += 0.0004
                dirLight.direction.z += 0.0004
                dirLight.strength += 0.002
                mesh.transform.scale.x += Math.sin(time / 10.0) / 1000.0

                mesh.transform.scale.y += Math.sin(time / 20.0) / 1000.0
                eye.transform.scale.x += Math.sin(time / 10.0) / 1000.0

                eye.transform.scale.y += Math.sin(time / 20.0) / 1000.0
                time += 1
            }

            coreScene.onDraw = () => {
                dirLight.draw()
                mesh.draw()
                eye.draw()

            }
        }
        scenes.coreScene = coreScene


        const forest = new Scene()
        forest.onAttach = () => {


            camera.transform.position.x = 0
            camera.transform.position.y = -1
            camera.transform.position.z = -2
            camera.transform.rotation.x = -1.2
            camera.transform.rotation.y = 0
            camera.transform.rotation.z = 0.0
            camera.setFov(30)



            dirLight.direction.z = 0.5
            dirLight.direction.y = 0.2
            dirLight.direction.x = 0.5
            dirLight.color.r = 0.7
            dirLight.color.g = 0.7
            dirLight.color.b = 0.5
            dirLight.strength = 1.1

            let mesh: Mesh = new Mesh()
            mesh.model = models.tree
            mesh.texture = textures.wood
            mesh.specularEnabled = false

            let mesh2: Mesh = new Mesh()
            mesh2.model = models.tree
            mesh2.texture = textures.wood
            mesh2.transform.position.z = -2
            mesh2.transform.position.x = 2
            mesh2.specularEnabled = false

            let mesh3: Mesh = new Mesh()
            mesh3.model = models.tree
            mesh3.texture = textures.wood
            mesh3.transform.position.z = -3
            mesh3.transform.position.x = -2
            mesh3.specularEnabled = false

            let cloudMesh: Mesh = new Mesh()
            cloudMesh.model = models.sky_plane
            cloudMesh.texture = textures.clouds
            cloudMesh.transform.position.y = 53
            cloudMesh.lightEnabled = false
            cloudMesh.specularEnabled = false

            forest.onDraw = () => {
                gl.clearColor(0.4, 0.6, 0.8, 1.0)
                gl.clearDepth(1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

                dirLight.draw()
                mesh.draw()
                mesh2.draw()
                mesh3.draw()
                cloudMesh.draw()
            }

            forest.onUpdate = () => {
                if (camera.transform.position.y > -2) {

                    camera.transform.position.y -= 0.001
                }

            }
        }
        scenes.forestScene = forest



        const gameScene = new Scene()
        gameScene.onAttach = () => {
            let game = new Game()


            camera.transform.position.x = 3
            camera.transform.position.y = -1
            camera.transform.position.z = -18
            camera.transform.rotation.x = 0.2
            camera.transform.rotation.y = 0
            camera.transform.rotation.z = 0.0
            camera.setFov(40)



            dirLight.direction.z = 0.01
            dirLight.direction.y = -0.5
            dirLight.direction.x = 0.1


            let mesh: Mesh = new Mesh()
            mesh.model = models.hum
            mesh.texture = textures.meat

            mesh.transform.rotation.x = 0.9
            mesh.transform.rotation.z = 0.2

            gameScene.onDraw = () => {

                switch (game.type) {
                    case Type.FIGHT:
                        dirLight.color.r = 1.0
                        dirLight.color.g = 0.1
                        dirLight.color.b = 0.1
                        dirLight.strength = 5

                        dirLight.draw()

                        mesh.draw()
                        mesh.transform.rotation.x += 0.7
                        mesh.transform.rotation.z += 0.7
                        mesh.transform.rotation.y += 0.7
                        mesh.draw()
                        mesh.transform.rotation.x -= 0.7
                        mesh.transform.rotation.z -= 0.7
                        mesh.transform.rotation.y -= 0.7
                        break
                }
            }

            let time = 0

            gameScene.onUpdate = () => {
                switch (game.type) {
                    case Type.FIGHT: {
                        mesh.transform.scale.x += Math.sin(time / 40.0) / 400.0
                        mesh.transform.scale.z += Math.sin(time / 40.0) / 400.0
                        mesh.transform.scale.y += Math.cos(time / 40.0) / 400.0
                        mesh.transform.rotation.y -= 0.001
                    }

                }



                mesh.transform.rotation.x += 0.001

                mesh.transform.rotation.z += 0.001

                time += 1

                if (game.out == Out.DIED) {
                    this.ending = game.out
                    this.setScene(scenes["deathScene"]!)

                }
                if (game.out == Out.WIN) {
                    this.ending = game.out
                    this.setScene(scenes["winScene"]!)
                }
                if (game.out == Out.STUPID_DEATH) {
                    this.ending = game.out
                    console.log("WHY")
                    this.setScene(scenes["stupidDeathScene"]!)
                }
            }

            gameScene.onDetach = () => {
                game.detach()
            }
        }
        scenes.gameScene = gameScene


        const deathScene = new Scene
        deathScene.onAttach = () => {
            storyPosition = 21
            enableLineMovement(true)
            nextLine()
        }
        scenes.deathScene = deathScene

        const gameEndScene = new Scene()
        gameEndScene.onAttach = () => {
            let h = 0

            let mesh: Mesh = new Mesh()
            mesh.model = models.triModel
            mesh.texture = textures.tri


            camera.transform.position.x = 0
            camera.transform.position.y = 0
            camera.transform.position.z = -5

            camera.transform.rotation.x = 0
            camera.transform.rotation.y = 0
            camera.transform.rotation.z = 0

            dirLight.direction.z = 1.0
            dirLight.direction.y = 1.0
            dirLight.direction.x = -1.0
            dirLight.strength = 3.0
            dirLight.color.r = 1.0
            dirLight.color.g = 1.0
            dirLight.color.b = 1.0


            const wavyText = document.createElement("div")
            wavyText.classList.add("wavy_text")
            let text = "Спасибо за игру :)"
            let spans: HTMLSpanElement[] = []
            for (let ch of text) {
                let span = document.createElement("span")
                span.textContent = ch
                span.classList.add("wavy_char")
                wavyText.append(span)
                spans.push(span)
            }

            let fadeElement = document.createElement("div")
            fadeElement.classList.add("fade_screen")
            overlay?.append(fadeElement)
            setTimeout(() => {
                fadeElement.classList.add("hidden")
            }, 50)

            overlay?.append(wavyText)

            playMusic(music.screen)

            let goBackText = document.createElement("span")

            // goBackText.classList.add("action")
            goBackText.style = "position: absolute; top:0; left:0; font-size:15px; color: white"
            goBackText.textContent = `ENDING ${this.ending}, RELOAD PAGE -> CLICK -> 3621 + ENTER`
            // goBackText.textContent = "назад"
            // goBackText.onclick = () => {
            //     this.setScene(scenes.gameScene!)
            // }

            document.getElementsByTagName("body")[0]!.append(goBackText)

            gameEndScene.onDraw = () => {



                wavyText.style.transform = `translateY(70%) translateX(${Math.sin(h * 5.0) * 10.0}px)`

                const r = Math.sin(h / 3.0 * Math.PI * 2) * 0.5 + 0.5;
                const g = Math.sin(h / 3.0 * Math.PI * 2 + 2 * Math.PI / 3) * 0.5 + 0.5;
                const b = Math.sin(h / 3.0 * Math.PI * 2 + 4 * Math.PI / 3) * 0.5 + 0.5;

                for (let i = 0; i < spans.length; i++) {
                    spans.at(i)!.style = `color:RGBA(255.0, 255.0, 255.0, 255.0); display: inline-block; transform: translateY(${(Math.sin((i / 2 + h * 10.0)) * 0.5 + 0.5) * 50.0}px)`

                }

                gl.clearColor(r, g, b, 1.0)
                gl.clearDepth(1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

                dirLight.draw()
                mesh.draw()

            }
            gameEndScene.onUpdate = () => {
                h += 0.008

                camera.transform.rotation.x -= Math.sin(h / 1.0) / 50.0
                camera.transform.position.z += Math.sin(h) / 100.0

                mesh.transform.rotation.x += Math.sin(h / 1.0) / 50.0
                mesh.transform.rotation.z += 0.02
                mesh.transform.rotation.y += Math.cos(h / 1.0) / 50.0
            }

            gameEndScene.onDetach = () => {
                fadeElement.remove()
                wavyText.remove()
                // goBackText.remove()
            }


        }
        scenes.gameEndScene = gameEndScene

        const stupidDeathScene = new Scene
        stupidDeathScene.onAttach = () => {
            storyPosition = 39
            enableLineMovement(true)
            nextLine()
        }

        scenes.stupidDeathScene = stupidDeathScene

        //win
        const winScene = new Scene
        winScene.onAttach = () => {
            storyPosition = 54
            enableLineMovement(true)
            nextLine()


            camera.transform.position.x = 0
            camera.transform.position.y = 0
            camera.transform.position.z = -5

            camera.transform.rotation.x = 0
            camera.transform.rotation.y = 0
            camera.transform.rotation.z = 0
            console.log(JSON.parse(JSON.stringify(camera.transform)));

            dirLight.direction.z = 1.0
            dirLight.direction.y = 1.0
            dirLight.direction.x = -1.0
            dirLight.strength = 3.0
            dirLight.color.r = 1.0
            dirLight.color.g = 1.0
            dirLight.color.b = 1.0

            let mesh: Mesh = new Mesh()
            mesh.model = models.sphere
            mesh.texture = textures.white

            mesh.transform.scale.x = 0.1
            mesh.transform.scale.y = 0.1
            mesh.transform.scale.z = 0.1
            mesh.transform.position.y = 2.5
            mesh.transform.position.x = 2


            let tree: Mesh = new Mesh()
            tree.model = models.tree
            tree.texture = textures.wood
            tree.specularEnabled = false
            tree.transform.rotation.x = -1.8
            tree.transform.position.z = 5.5
            tree.transform.position.x = 0.4


            let tree2: Mesh = new Mesh()
            tree2.model = models.tree
            tree2.texture = textures.wood
            tree2.specularEnabled = false
            tree2.transform.rotation.x = -1.8
            tree2.transform.position.z = 5.5
            tree2.transform.position.x = -3
            tree2.transform.position.y = 1

            winScene.onDraw = () => {
                dirLight.draw()
                tree.draw()
                tree2.draw()
                
                mesh.draw()
            }
        }

        scenes.winScene = winScene
    }

    updateCurrentScene() {
        if (this.currentScene) {
            this.currentScene.update()
        }
    }

    drawCurrentScene() {
        if (this.currentScene) {
            this.currentScene.draw()
        }
    }

    setScene(scene: Scene) {
        if (this.currentScene) {
            console.log("[SCENE_MANAGER] Scene detached")
            this.currentScene.detach()
        }
        this.currentScene = scene
        this.currentScene.attach()

    }
}

export { SceneManager, scenes, camera }
