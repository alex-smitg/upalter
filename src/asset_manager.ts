import { gl, audioContext } from "./context";
import { Model } from "./model";


class AssetManager {
    async loadAssets(urls: Record<string, string>,
        onProgress: (loaded: number, total: number, url: string) => void) {

        let textures: Record<string, WebGLTexture> = {}
        let models: Record<string, Model> = {}
        let music: Record<string, AudioBuffer> = {}

        const entries = Object.entries(urls)

        let loaded = 0
        const total = entries.length

        console.log("Fetching assets")

        for (const [name, url] of entries) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error loading ${url}`)
               
            }
            const buffer = await response.arrayBuffer();

            let type = url.split(".").pop()?.toLowerCase()

            switch (type) {
                case ("model"):
                    const model = new Model(buffer)
                    models[name] = model
                    break
                case ("png"):
                    const texture = await this.createTextureFromImage(buffer)
                    textures[name] = texture
                    break
                case ("mp3"):
                    const audioBuffer = await audioContext.decodeAudioData(buffer)
                    music[name] = audioBuffer
                    break


            }

            loaded++
            onProgress(loaded, total, name)


        }

        return { textures, models, music }
    }

    createTextureFromImage(buffer: ArrayBuffer): Promise<WebGLTexture> {
        return new Promise((resolve, reject) => {
            const blob = new Blob([buffer])
            const _url = URL.createObjectURL(blob)
            const image = new Image()

            image.onload = () => {
                const texture = gl.createTexture()
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
                URL.revokeObjectURL(_url)
                gl.generateMipmap(gl.TEXTURE_2D)
                resolve(texture)
            }

            image.onerror = () => reject(new Error("Promise texture error"))
            image.src = _url

        })
    }
}

export { AssetManager }