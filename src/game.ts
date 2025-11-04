import { overlay } from "./context"


const Type: Record<string, number> = Object.freeze({
    ROUTES: 0,
    LOCATION_INFO: 1,
    LISTENING: 2,
    LOOK: 3,
    FIGHT: 4,


})


const Out: Record<string, number> = Object.freeze({
    NONE: 0,
    WIN: 1,
    DIED: 2,
    STUPID_DEATH: 3
})


class Game {
    battleDiv: HTMLDivElement
    textElement: HTMLSpanElement


    type = Type.LOCATION_INFO
    message = ""

    out = Out.NONE

    locations: Record<string, {
        name: string, where: string, routes: string[], actions:
        Record<string, () => void>
    }> = {
            forest: {
                name: "лес",
                where: "ночь. Я стою в лесу\nСквозь ветки можно увидеть лунный свет",
                routes: ["facBuilding", "lake"],
                actions: {

                }
            },

            lake: {
                name: "озеро",
                where: "я стою у озера\nНа нём иногда виднеются странные силуэты...",
                routes: ["forest"],
                actions: {
                }

            },

            facBuilding: {
                name: "заброшенный завод",
                where: "я стою у заброшенного завода\nИм уже давно не пользовались...",
                routes: ["mainHall", "forest"],
                actions: {
                }
            },

            mainHall: {
                name: "главный коридор",
                where: "я в главном коридоре\nЕсть лестница на второй этаж и выход в цех",
                routes: ["section", "floorTwo", "facBuilding"],
                actions: {
                }
            },
            section: {
                name: "цех",
                where: "я в цеху\nКрышу давно съела ржавчина. Возможно я найду здесь что-нибудь полезное",
                routes: ["mainHall"],
                actions: {
                    "взять нож": () => {
                        delete this.locations.section?.actions["взять нож"]
                        this.type = Type.LOCATION_INFO
                        this.itemHand = "knife"
                        this.update()

                    }
                }
            },
            floorTwo: {
                name: "второй этаж",
                where: "я на втором этаже\nВ полу видны огромные дыры и следы присутствия",
                routes: ["cab", "mainHall"],
                actions: {
                }
            },
            cab: {
                name: "кабинет директора",
                where: "я в кабинете директора\nДует холодный ветерок",
                routes: ["floorTwo"],
                actions: {
                    "выпрыгнуть в окно": () => {
                        this.playerHealth -= 4
                        this.type = Type.MESSAGE
                        this.message = "Я выпрыгнул в окно. Зачем?"
                        this.currentLocation = "facBuilding"
                        this.update()
                    }

                }
            }
        }

    items: Record<string, { name: string, inHand: string }> = {
        none: { name: "", inHand: "в руке ничего не держу" },
        knife: { name: "нож", inHand: "в руке я держу нож" }
    }


    playerHealth = 12
    currentLocation: string = "forest"
    itemHand: string = "none"


    constructor() {
        this.battleDiv = document.createElement("div")
        this.battleDiv.style.display = "flex"
        this.battleDiv.style.flexDirection = "column"
        this.battleDiv.style.gap = "20px"
        this.battleDiv.classList.add("battle")
        this.textElement = document.createElement("span")
        this.textElement.textContent = "Я нашёл его."
        this.textElement.style.fontSize = "30px"



        this.battleDiv.append(this.textElement)

        overlay?.append(this.battleDiv)

        this.update()

    }

    getPlayerStatus(): string {
        let status = ""
        if (this.playerHealth >= 10) status = "чувствую себя хорошо"
        if (this.playerHealth < 10) status = "болят ноги";
        if (this.playerHealth < 8) status = "небольшой перелом...";
        if (this.playerHealth < 5) status = "я истекаю кровью";
        if (this.playerHealth < 2) status = "...п-п-помогите...";

        return status
    }

    getLocationName(): string {
        let locationName = this.locations[this.currentLocation!]?.where ?? ""
        return locationName
    }

    getItem(): string {
        let item = this.items[this.itemHand!]?.inHand ?? ""
        if (this.itemHand == "none") {
            item = ""
        }
        return item
    }

    capitalize(val: string) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1)
    }


    getLocationInfo() {
        let text = ""
        text += `${this.capitalize(this.getLocationName())}\n`
        text += `${this.capitalize(this.getPlayerStatus())}\n`
        text += `${this.capitalize(this.getItem())}\n`

        return text
    }
    getRoutesInfo() {
        return "Куда я пойду?"
    }

    getRoutesActions(): Record<string, () => void> {
        let actions: Record<string, () => void> = {}
        let routes = this.locations[this.currentLocation!]?.routes ?? []

        for (let i in routes) {
            actions[
                this.capitalize(this.locations[routes[i]!]?.name!)!] = () => {
                    this.currentLocation = routes[i]!
                    this.type = Type.LOCATION_INFO
                    this.update()
                }
        }
        actions["Никуда"] = () => {
            this.type = Type.LOCATION_INFO
            this.update()
        }
        return actions

    }

    update() {
        if (this.playerHealth <= 0) {
            this.out = Out.STUPID_DEATH
            return
        }
        let text = ""
        let curActions: Record<string, () => void>
        switch (this.type) {
            case (Type.LOCATION_INFO):
                text = this.getLocationInfo()
                curActions = {}
                curActions["переместиться ☇ "] = () => {
                    this.type = Type.ROUTES
                    this.update()
                }
                curActions["прислушаться ⚟"] = () => {
                    this.type = Type.LISTENING
                    this.update()
                }
                curActions["осмотреться ⛭"] = () => {
                    this.type = Type.LOOK
                    this.update()
                }
                break
            case (Type.ROUTES):
                text = this.getRoutesInfo()
                curActions = this.getRoutesActions()
                break
            case (Type.LISTENING):
                if (this.currentLocation == "lake") {
                    text = "Я слышу странные звуки"

                    curActions = {
                        "Подойти ближе": () => {
                            this.type = Type.FIGHT
                            this.update()
                        },
                        "Убежать": () => {
                            this.currentLocation = "forest"
                            this.type = Type.LOCATION_INFO
                            this.update()
                        }
                    }
                } else {

                    text = "Я ничего не слышу"
                    curActions = {
                        "Хорошо": () => {
                            this.type = Type.LOCATION_INFO
                            this.update()
                        }
                    }
                }
                break
            case (Type.LOOK):
                curActions = this.locations[this.currentLocation!]?.actions ?? {}
                curActions[
                    "Ладно"] = () => {
                        this.type = Type.LOCATION_INFO
                        this.update()
                    }

                if (Object.keys(curActions).length == 1) {
                    text = "Ничего не нашёл"
                } else {
                    text = "Что-то есть"
                    curActions = this.locations[this.currentLocation!]?.actions ?? {}
                }

                break
            case (Type.MESSAGE):
                text = this.message
                curActions = {
                    "Ладно": () => {
                        this.type = Type.LOCATION_INFO
                        this.update()
                    }
                }
                this.message = ""
                break
            case (Type.FIGHT):
                text = ".@#2П.*\nW#@о.5/&о.#ги@т._е/=+_$#\n"
                curActions = {
                    "Убить": () => {
                        if (this.itemHand !== "none") {
                            this.out = Out.WIN
                        } else {
                            this.out = Out.DIED
                        }
                    }
                }
                break

        }
        let prevActions = overlay?.getElementsByClassName("action")
        for (let i = prevActions?.length ?? 0; i >= 0; i--) {
            prevActions?.item(i)?.remove()
        }


        animateText(text, () => {



            let actions = curActions ///?
            for (let action in actions) {
                let actionElement = document.createElement("span")


                actionElement.classList.add("action")


                actionElement.textContent = this.capitalize(action)
                actionElement.onclick = () => {
                    (actions[action] ?? (() => { }))()
                }
                this.battleDiv?.append(actionElement)

            }
        }, this.textElement)



    }
    detach() {
        this.battleDiv.remove()
    }



}

function animateText(text: string, onFinished: () => void, textElement: HTMLSpanElement) {
    let start = Date.now()
    let duration = text.length * 10

    requestAnimationFrame(function animate() {
        let progress = (Date.now() - start) / duration


        if (progress >= 1) {
            progress = 1
            onFinished()
        }
        textElement.textContent = text.slice(0, text.length * progress)

        if (progress < 1) {
            requestAnimationFrame(animate)
        }
    })

}



export { Game, Type, Out }