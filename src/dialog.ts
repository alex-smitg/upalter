import { dialog, dialogCharacterElement, dialogTextElement } from "./context"
import { scenes } from "./scene_manager"



let characters: Record<string, string> = {
    "voice1": "Голос 1",
    "in": "",
    "voice2": "Голос 2",
    "ch": "Павел Демидович",

}


let lines: string[] = [
    "SAY:voice1:Ты что творишь с моим экспериментом?!",
    "SAY:voice2:Расслабься, никто не заметит...",
    "SAY:voice1:Это неправильно...",
    "SAY:voice2:ЕЩЁ ОДНО СЛОВО — и ты окажешься на его месте.",
    "SAY:voice1:Кх...",
    "SAY:'':(...)",
    "SAY:voice2:Я начинаю!",
    "TOGGLE:::",
    "SCENE:wiresScene",
    "TOGGLE:::",
    "SAY:'':Почему именно я?", //10
    "TOGGLE:::",
    "WAIT:3000",
    "SCENE:coreScene",
    "TOGGLE:::",
    "SAY:'':Весь мир такой же, как и прежде...",
    "SAY:'':Но теперь я вижу больше.",
    "SAY:'':Я чувствую что оно здесь. В этом лесу.",
    "SAY:'':Я должен избавиться от него.",
    "TOGGLE:::",
    "SCENE:gameScene",
    "TOGGLE:::", //BAD ENDING: DIED
    "SAY:'':Я не успел.",
    "SAY:'':Если бы у меня было хоть какое-то оружие...",
    "SAY:'':Что-то холодное и мерзкое обхватило моё тело.",
    "SAY:'':Сильная боль",
    `SAY:'':"П-почему я?.."`,
    "SAY:'':Я больше ничего не чувствую.",
    "SAY:'':...",
    "SAY:'':Спустя некоторое время.",
    "SAY:voice2:Он хорошо себя показал.",
    "SAY:ch:Да, отличный образец.",
    "SAY:ch:Жаль, но нам придётся найти другого.",
    "SAY:voice1:А что нам с ним делать?",
    `SAY:ch:Отправьте куски его тела в «холодильник», мы ещё найдём им применение.`,
    "SAY:ch:Только аккуратно.",
    "SAY:voice2:Будет сделано.",
    "TOGGLE:::",
    "SCENE:gameEndScene",
    "TOGGLE:::", //BAD ENDING: STUPID_DEATH 39
    "SAY:'':Каким же надо было быть дурнем.",
    "SAY:'':Чтобы случайно выпасть из окна три раза.",
    "SAY:'':Больно.",
    `SAY:'':"П-почему я?.."`,
    "SAY:'':...",
    "SAY:'':Спустя некоторое время.",
    "SAY:voice2:М-да.",
    "SAY:ch:...кретины.",
    `SAY:ch:Отправьте его в «холодильник».`,
    "SAY:ch:И больше не попадайтесь мне на глаза.",
    "SAY:voice2:Есть!",
    "SAY:voice2:(Я ненавижу свою работу)",
    "TOGGLE:::",
    "SCENE:gameEndScene",
    "TOGGLE:::", //GOOD ENDING
    "SAY:'':...",
    "SAY:'':Я смог.",
    "SAY:'':Получилось!",
    "SAY:'':Я изрезал его на кусочки.",
    "SAY:'':Но это ещё не конец.",
    "SAY:'':Я чувствую — они рядом",
    "SAY:'':По крайней мере она будет жить...",
    "TOGGLE:::",
    "SCENE:gameEndScene"

]

let isTextAnimating = false

let skipText = false
let canMoveLine = false

function enableLineMovement(bool: boolean) {
    canMoveLine = bool
}

function getLineMovement() {
    return canMoveLine
}

function setSkipText(bool: boolean) {
    skipText = bool
}



function dialogSay(characterCode: string, text: string) {
    isTextAnimating = true
    let start = Date.now()
    let duration = text.length * 30

    dialogCharacterElement.textContent = characters[characterCode]!

    requestAnimationFrame(function animate() {
        let progress = (Date.now() - start) / duration

        if (skipText) {
            skipText = false
            progress = 1
        }

        if (progress >= 1) {
            progress = 1
            isTextAnimating = false;
        }
        dialogTextElement.textContent = text.slice(0, text.length * progress)

        if (progress < 1) {
            requestAnimationFrame(animate)
        }
    })
}



export { enableLineMovement, lines, dialogSay, getLineMovement, setSkipText, isTextAnimating }