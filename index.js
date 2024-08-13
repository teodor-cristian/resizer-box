var t="width",e="height",n="max-width",i="min-width",o="max-height",r="min-height",s="resize-right",a="resize-bottom",h="resize-top",l="resize-left",d="resize-bottom-right",c="resize-bottom-left",p="resize-top-left",u="resize-top-right",g="200px",b="200px",v="right",m="left",w="bottom",f="top",x="bottom-right",H="bottom-left",z="top-left",_="top-right";class C{#t=null;#e=null;onChange=null;constructor(t,e){if(!t)throw new Error('resize-observer-manager: Missing "container" argument');if(!e)throw new Error('resize-observer-manager: Missing "onChange" argument');this.#t=t,this.onChange=e}subscribe(){this.#e=new ResizeObserver((t=>this._onResize.call(this,t))),this.#e.observe(this.#t)}unsubscribe(){this.#e.disconnect()}_onResize(t){if(!t||!t[0])return;const{width:e,height:n}=t[0].contentRect,i={width:e,height:n};this.onChange(i)}}function R(t){return/[0-9]+(?:\.[0-9]+)?(?=px)/.test(t)}class B extends HTMLElement{#t=null;#e=null;static observedAttributes=[t,e,s,a,l,h,p,c,u,d];handlesAddMethodMap={[s]:this._addRightHandle,[a]:this._addBottomHandle,[d]:this._addBottomRightHandle,[l]:this._addLeftHandle,[c]:this._addBottomLeftHandle,[p]:this._addTopLeftHandle,[u]:this._addTopRightHandle,[h]:this._addTopHandle};attributesToPositionMap={[s]:v,[a]:w,[d]:x,[l]:m,[c]:H,[p]:z,[u]:_,[h]:f};constructor(){super()}connectedCallback(){const n=this.attachShadow({mode:"open"}),i=document.createElement("template");i.innerHTML='<div class="resizer" data-cy="resizer-container">\n            <style>\n            :host {\n                --box-width: 20px;\n                --box-overflow: calc(var(--box-width) / 2);\n            }            \n            \n            .resizer {\n                position: relative;\n            }\n            \n            .handle {\n                position: absolute;\n            }\n\n            .handle:hover {\n                background-color: #83c0e975;\n            }\n            \n            .handle.right {\n                cursor: col-resize;\n                width: var(--box-width);\n                height: 100%;\n                right: calc(-1 * var(--box-overflow));\n                top: 0;\n            }\n            \n            .handle.left {\n                cursor: col-resize;\n                width: var(--box-width);\n                height: 100%;\n                left: calc(-1 * var(--box-overflow));\n                top: 0;\n            }\n            \n            .handle.bottom {\n                cursor: row-resize;\n                height: var(--box-width);\n                width: 100%;\n                bottom: calc(-1 * var(--box-overflow));\n            }\n            \n            .handle.top {\n                cursor: row-resize;\n                height: var(--box-width);\n                width: 100%;\n                top: calc(-1 * var(--box-overflow));\n            }\n            \n            .handle.bottom-right {\n                z-index: 10;\n                cursor: se-resize;\n                height: var(--box-width);\n                width: var(--box-width);\n                bottom: calc(-1 * var(--box-overflow));\n                right: calc(-1 * var(--box-overflow));\n            }\n            \n            .handle.bottom-left {\n                z-index: 10;\n                cursor: sw-resize;\n                height: var(--box-width);\n                width: var(--box-width);\n                bottom: calc(-1 * var(--box-overflow));\n                left: calc(-1 * var(--box-overflow));\n            }\n            \n            .handle.top-left {\n                z-index: 10;\n                cursor: nw-resize;\n                height: var(--box-width);\n                width: var(--box-width);\n                top: calc(-1 * var(--box-overflow));\n                left: calc(-1 * var(--box-overflow));\n            }\n            \n            .handle.top-right {\n                z-index: 10;\n                cursor: ne-resize;\n                height: var(--box-width);\n                width: var(--box-width);\n                top: calc(-1 * var(--box-overflow));\n                right: calc(-1 * var(--box-overflow));\n            }\n            </style>\n            <slot name="content"></slot>\n        </div>',n.appendChild(i.content.cloneNode(!0)),this.#t=n.querySelector(".resizer"),this.#e=new C(this.#t,(t=>this.dispatch("resize",t))),this.#e.subscribe();const o=this.getAttribute(t);o&&R(o)?this.#t.style.width=o:(this.#t.style.width=g,console.error(`Please set a ${t} attribute to the resizer tag.`));const r=this.getAttribute(e);r&&R(r)?this.#t.style.height=r:(this.#t.style.height=b,console.error(`Please set a ${e} attribute to the resizer tag.`)),this._addResizeHandles()}disconnectedCallback(){this.#e.unsubscribe()}attributeChangedCallback(n,i,o){null!==i&&(n!==t&&n!==e?B.observedAttributes.includes(n)&&(this.attributeIsValid(n)?this.handlesAddMethodMap[n].call(this):this._removeResizeHandle(this.attributesToPositionMap[n])):this.#t.style[n]=o)}dispatch(t,e){this.dispatchEvent(new CustomEvent(t,{bubbles:!0,cancelable:!1,detail:e}))}get maxWidth(){const t=this.getAttribute(n);return R(t)?parseInt(t,10):0}get minWidth(){const t=this.getAttribute(i);return R(t)?parseInt(t,10):0}get maxHeight(){const t=this.getAttribute(o);return R(t)?parseInt(t,10):0}get minHeight(){const t=this.getAttribute(r);return R(t)?parseInt(t,10):0}attributeIsValid(t){if(!this.hasAttribute(t))return!1;const e=this.getAttribute(t);return""===e||"true"===e}_addResizeHandles(){for(const[t,e]of Object.entries(this.handlesAddMethodMap))this.attributeIsValid(t)&&e.call(this)}_removeResizeHandle(t){const e=this.#t.querySelector(`.handle.${t}`);this.#t.removeChild(e)}_createHandle(t){let e=`<div class='handle ${t}' part='handle handle-${t}' data-cy='handle-${t}'></div>`;this.#t.insertAdjacentHTML("beforeend",e);return this.#t.querySelector(`.handle.${t}`)}_addRightHandle(){const t=this._createHandle(v);t.onpointerdown=e=>{e.preventDefault();const n=e.clientX-t.getBoundingClientRect().left;t.setPointerCapture(e.pointerId),t.onpointermove=t=>this._setWidth(t.clientX,n,"right"),t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_addLeftHandle(){const t=this._createHandle(m);t.onpointerdown=e=>{e.preventDefault();const n=e.clientX-t.getBoundingClientRect().right;t.setPointerCapture(e.pointerId),t.onpointermove=t=>this._setWidth(t.clientX,n,"left"),t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_addBottomHandle(){const t=this._createHandle(w);t.onpointerdown=e=>{e.preventDefault();const n=e.clientY-t.getBoundingClientRect().top;t.setPointerCapture(e.pointerId),t.onpointermove=t=>this._setHeight(t.clientY,n,"bottom"),t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_addTopHandle(){const t=this._createHandle(f);t.onpointerdown=e=>{e.preventDefault();const n=e.clientY-t.getBoundingClientRect().bottom;t.setPointerCapture(e.pointerId),t.onpointermove=t=>this._setHeight(t.clientY,n,"top"),t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_addBottomRightHandle(){const t=this._createHandle(x);t.onpointerdown=e=>{e.preventDefault();const n=e.clientX-t.getBoundingClientRect().left,i=e.clientY-t.getBoundingClientRect().top;t.setPointerCapture(e.pointerId),t.onpointermove=t=>{this._setWidth(t.clientX,n,"right"),this._setHeight(t.clientY,i,"bottom")},t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_addBottomLeftHandle(){const t=this._createHandle(H);t.onpointerdown=e=>{e.preventDefault();const n=e.clientX-t.getBoundingClientRect().left,i=e.clientY-t.getBoundingClientRect().top;t.setPointerCapture(e.pointerId),t.onpointermove=t=>{this._setWidth(t.clientX,n,"left"),this._setHeight(t.clientY,i,"bottom")},t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_addTopLeftHandle(){const t=this._createHandle(z);t.onpointerdown=e=>{e.preventDefault();const n=e.clientX-t.getBoundingClientRect().left,i=e.clientY-t.getBoundingClientRect().top;t.setPointerCapture(e.pointerId),t.onpointermove=t=>{this._setWidth(t.clientX,n,"left"),this._setHeight(t.clientY,i,"top")},t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_addTopRightHandle(){const t=this._createHandle(_);t.onpointerdown=e=>{e.preventDefault();const n=e.clientX-t.getBoundingClientRect().left,i=e.clientY-t.getBoundingClientRect().bottom;t.setPointerCapture(e.pointerId),t.onpointermove=t=>{this._setWidth(t.clientX,n,"right"),this._setHeight(t.clientY,i,"top")},t.onpointerup=()=>{t.onpointermove=null,t.onpointerup=null}},t.ondragstart=()=>!1}_setHeight=(t,e,n)=>{let i=t-e-this.#t.getBoundingClientRect()[{bottom:"top",top:"bottom"}[n]];i="top"===n?-i:i,this.maxHeight&&i>=this.maxHeight&&(i=this.maxHeight),this.minHeight&&i<=this.minHeight&&(i=this.minHeight),this.#t.style.height=`${i}px`};_setWidth=(t,e,n)=>{let i=t-e-this.#t.getBoundingClientRect()[{left:"right",right:"left"}[n]];i="left"===n?-i:i,this.maxWidth&&i>=this.maxWidth&&(i=this.maxWidth),this.minWidth&&i<=this.minWidth&&(i=this.minWidth),this.#t.style.width=`${i}px`}}customElements.define("resizer-box",B);
