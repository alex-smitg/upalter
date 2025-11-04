const canvas = document.getElementById("canvas") as HTMLCanvasElement
const dialog = document.getElementById("dialog") as HTMLDivElement
const dialogTextElement = dialog.getElementsByClassName("text")[0] as HTMLParagraphElement
const dialogCharacterElement = dialog.getElementsByClassName("ch_name")[0] as HTMLSpanElement

const overlay = document.getElementById("overlay")

const gl = canvas.getContext("webgl2") as WebGL2RenderingContext
const audioContext = new AudioContext()



export { gl, audioContext, overlay, dialog, dialogCharacterElement, dialogTextElement}