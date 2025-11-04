class Scene {
    onAttach: (() => void) | null = null
    onDetach: (() => void) | null = null
    onUpdate: (() => void) | null = null
    onDraw: (() => void) | null = null
    
    attach() {
        this.onAttach?.()
    }

    update() {
        this.onUpdate?.()
    }

    draw() {
        this.onDraw?.()
    }

    detach() {
        this.onDetach?.()
    }
}

export {Scene}