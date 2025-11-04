import { audioContext } from "./context"

let currentMusicSource: AudioBufferSourceNode | null = null
let currentGainNode: GainNode | null = null

document.addEventListener("click", async () => {
    if (audioContext.state === "suspended") {
        await audioContext.resume()
    }
})

function playMusic(audioBuffer: AudioBuffer | undefined) {
    if (!audioBuffer) {
        console.error("Audio buffer not loaded")
        return
    }
    

    const source = audioContext.createBufferSource()
    const gain = audioContext.createGain()
    const now = audioContext.currentTime

    source.buffer = audioBuffer
    source.loop = true
    source.connect(gain)
    gain.connect(audioContext.destination)

    let fade = 6.0

    if (currentGainNode && currentMusicSource) {
        currentGainNode.gain.cancelScheduledValues(now)
        currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now)
        currentGainNode.gain.linearRampToValueAtTime(0, now + fade)
        currentMusicSource.stop(now + fade)
    }

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(1, now + fade)

    

    source.start(now)



    currentGainNode = gain
    currentMusicSource = source
}

export {playMusic}