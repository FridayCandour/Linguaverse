class DOM_TTS {
    index = 0;
    nodes = [];
    engine = {
        speak(text) {
            const speechSynthesis = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
            utterance.onend = () => {
                // @ts-ignore
                this.iterate();
            };
        },
    };
    constructor(engine) {
        if (engine) {
            this.engine = engine;
        }
    }
    static Map_PUB = (wrap) => {
        const result = [];
        for (let i = 0; i < wrap.length; i++) {
            const element = wrap[i];
            if (element.textContent) {
                result.push(element);
            }
        }
        return result;
    };
    static Map_CONT = (wrap) => {
        const result = [];
        for (let i = 0; i < wrap.length; i++) {
            const element = wrap[i];
            if (element.className !== "pub") {
                result.push(...this.Map_CONT(Array.from(element.childNodes)));
            }
            else {
                result.push(element);
            }
        }
        return result;
    };
    wrap(WRAP_POINT) {
        this.nodes = DOM_TTS.Map_CONT(Array.from(WRAP_POINT.children)).filter((node) => node.nodeName !== "#text");
    }
    iterate() {
        const [p1, p2] = [
            this.nodes[this.index],
            this.nodes[this.index - 1],
        ];
        if (p2) {
            p2.classList.remove("dom-tts");
        }
        if (p1) {
            if (p1.className === "pub") {
                const results = DOM_TTS.Map_PUB(Array.from(p1.childNodes));
                this.nodes.splice(this.index, 1);
                this.nodes.push(...results);
                this.iterate();
                return;
            }
            this.engine.speak.call(this, p1.textContent.trim());
            p1.classList.add("dom-tts");
            p1.scrollIntoView({ behavior: "smooth", block: "center" });
            this.index += 1;
        }
        else {
            this.index = 0;
        }
    }
    pause() {
        this.index = 0;
        const speechSynthesis = window.speechSynthesis;
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }
    }
}
export const Domtts = new DOM_TTS();
