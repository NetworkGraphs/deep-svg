import * as svgm from "./js_comp.js";

class DeepSvg extends HTMLElement{
    constructor(){
        console.log("constructor");
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        this.body = document.createElement("body");
        shadowRoot.appendChild(this.body);
        this.svg = null;
        this.ready = false;
    }
    load_src(){
        let enable = true;
        if(this.hasAttribute("enable")){
            enable = this.getAttribute("enable");
        }
        if(this.hasAttribute("src")){
            const src = this.getAttribute("src");
            console.log(`load src : ${src}`);
            if(this.svg != null){
                this.body.removeChild(this.svg);
                console.log("non null svg");
            }
            //same id concept
            svgm.createElement(this.body,{src:src,enable:enable,id:this.id})
            //svgm.createElement(this.body,{src:src,enable:enable,id:`svg_${this.id}`})
            .then((svg)=>{
                this.svg = svg;
                this.ready = true;
                //function encapsulation to keep "this" as the class not the event launcher "svg"
                this.svg.addEventListener("text_click",(e)=>{this.text_click(e)});
            })
        }
    }
    connectedCallback(){
        console.log("connected");
        this.addEventListener("highlightText",this.highlightText);
        this.load_src();
    }
    static get observedAttributes() {
        return ['src','enable'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(!this.ready){
            return;
        }
        switch (name) {
            case 'src':
                this.load_src();
                break;
            case 'enable':
                svgm.setProperty(this.svg,{enable:newValue});
                break;
        }
    }
    highlightText(text){
        svgm.highlightText(this.svg,text);
    }
    text_click(e){
        const wbc_evt = new CustomEvent(e.type,{detail:e.detail});
        this.dispatchEvent(wbc_evt);
    }
}

window.customElements.define('deep-svg',DeepSvg);
