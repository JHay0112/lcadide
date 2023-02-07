import{c as $,a as p,p as m,i as _,F as L,s as g,u as N,S as x,t as a,b as y,d as P,e as w,f as C,g as R}from"./index-90c59c3f.js";const M=a('<section class="w-full h-full bg-primary text-primary p-3 overflow-y-scroll font-mono"><section class="w-full whitespace-pre-wrap"><p>Python (Pyodide 0.22.1) Shell</p><br></section><form action="javascript:void(0)" class="flex"><label class="h-primary text-bold float-left flex-none">&gt;&gt;&gt;&nbsp;</label><input type="text" class="bg-primary text-primary float-left border-b-2 border-white border-solid outline-none flex-1" value=""><input type="submit" class="invisible" value=""></form></section>'),E=a("<p>Loading Pyodide Shell...</p>"),T=a("<p></p>");function A(){let s,t;const[u,e]=$([]);return p(x,{get when(){return!m.loading},get fallback(){return E.cloneNode(!0)},get children(){const o=M.cloneNode(!0),c=o.firstChild;c.firstChild.nextSibling;const r=c.nextSibling,d=r.firstChild,l=d.nextSibling,f=t;typeof f=="function"?N(f,o):t=o,_(c,p(L,{get each(){return u()},children:(h,b)=>(()=>{const v=T.cloneNode(!0);return _(v,h),v})()}),null),r.addEventListener("submit",()=>{switch(s.value){case"exit()":break;case"clear()":e([]);break;default:e([...u(),">>> ".concat(s.value)]);try{m.latest.runPython(s.value);let h=m.latest.runPython("sys.stdout.getvalue()");h!=""&&e([...u(),h])}catch(h){e([...u(),h.message])}m.latest.runPython("sys.stdout = io.StringIO()")}s.value="",t.scrollTop=t.scrollHeight}),g(d,"for",s);const i=s;return typeof i=="function"?N(i,l):s=l,o}})}const D=a('<section class="h-full md:h-1/2 w-full">Components list...</section>'),O=a('<section class="h-full md:h-1/2 w-full dark"></section>');function V(){return[D.cloneNode(!0),(()=>{const s=O.cloneNode(!0);return _(s,p(A,{})),s})()]}var I=(s=>(s[s.VERTICAL=0]="VERTICAL",s[s.HORIZONTAL=1]="HORIZONTAL",s))(I||{});const H=a('<svg height="75" width="50" class="hover:cursor-grab"><path></path></svg>'),F=a('<aside class="bg-primary rounded-md p-3 drop-shadow-md text-left"><button class="w-full hover:opacity-80">Delete</button><button class="w-full hover:opacity-80">Rotate</button></aside>');class k{static _nextId=0;constructor(t){this.sheet=t,[this._value,this._setValue]=$(""),[this._id,this._setId]=$(String(k._nextId++)),[this._color,this._setColor]=$("#252525"),[this._position,this._setPosition]=$([-255,-255]),[this._orientation,this._setOrientation]=$(I.VERTICAL)}forDisplay(){let[t,u]=$(!1),[e,o]=$([0,0]),c=this.sheet.toPixels(this.position);c[0]+=this.nodes[0][0],c[1]+=this.nodes[0][1];const n=this;return[(()=>{const r=H.cloneNode(!0),d=r.firstChild;return r.$$click=()=>{n.delete(),n.sheet.activeComponent=n},r.$$contextmenu=l=>{o([l.clientX,l.clientY]),u(!0),l.preventDefault()},y(l=>{const f=`
                    stroke: ${n.color}; 
                    stroke-width: 2; 
                    fill: none;
                    position: absolute;
                    top: ${c[1]}px;
                    left: ${c[0]}px;
                    rotate: ${90*n.orientation}deg;
                `,i=n.path;return l._v$=P(r,f,l._v$),i!==l._v$2&&g(d,"d",l._v$2=i),l},{_v$:void 0,_v$2:void 0}),r})(),p(x,{get when(){return t()},get children(){const r=F.cloneNode(!0),d=r.firstChild,l=d.nextSibling;return r.addEventListener("mouseleave",()=>{u(!1)}),d.$$click=()=>{n.delete()},l.$$click=()=>{n.orientation++},y(f=>P(r,`
                        position: absolute;
                        top: ${e()[1]-3}px;
                        left: ${e()[0]-3}px;
                    `,f)),r}})]}forSidebar(){return[]}forLcapy(){return this.name}delete(){this.sheet.deleteComponent(this)}get id(){return this._id()}set id(t){this._setId(t)}get value(){return this._value()}set value(t){this._setValue(t)}get color(){return this._color()}set color(t){this._setColor(t)}get position(){return this._position()}set position(t){this._setPosition(t)}get orientation(){return this._orientation()}set orientation(t){this._setOrientation(t)}}w(["contextmenu","click"]);class U extends k{name="R";path=`
        M 25 , 0
        L 25 , 20
        l 20 , 5
        l -40, 5
        l 40 , 5
        l -40, 5
        l 40 , 5
        l -40, 5
        l 20 , 5
        L 25, 75
    `;nodes=[[25,0],[25,75]]}const X=a('<section class="text-secondary bg-secondary absolute inset-x-0 bottom-0 w-full md:w-2/3 text-center"><button class="px-4 py-2 transition-all hover:bg-primary hover:text-primary mx-2">R</button></section>');function Y(s){const[t,u]=C(s,["sheet"]);let e=t.sheet;return(()=>{const o=X.cloneNode(!0),c=o.firstChild;return c.$$click=()=>{e.activeComponent=new U(e)},o})()}w(["click"]);const Z=a('<section><svg class="h-full w-full"><defs><pattern id="grid" patternUnits="userSpaceOnUse"><path fill="none" stroke="gray" stroke-width="1"></path></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"></rect></svg></section>');function j(s){const[t,u]=C(s,["sheet"]);let e=t.sheet;function o(n){e.active&&(e.activeComponent.position=e.toGrid([n.clientX,n.clientY]))}function c(n){e.active&&e.placeActiveComponent()}return[(()=>{const n=Z.cloneNode(!0),r=n.firstChild,d=r.firstChild,l=d.firstChild,f=l.firstChild;return n.$$click=c,n.$$mousemove=o,_(n,p(x,{get when(){return e.active},get children(){return e.activeComponent.forDisplay()}}),null),_(n,p(L,{get each(){return e.components},children:i=>i.forDisplay()}),null),y(i=>{const h=`h-full w-full overflow-scroll ${e.active?"cursor-grabbing":"cursor-auto"}`,b=e.gridSpacing,v=e.gridSpacing,S=`M ${e.gridSpacing} 0 L 0 0 0 ${e.gridSpacing}`;return h!==i._v$&&R(n,i._v$=h),b!==i._v$2&&g(l,"width",i._v$2=b),v!==i._v$3&&g(l,"height",i._v$3=v),S!==i._v$4&&g(f,"d",i._v$4=S),i},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),n})(),p(Y,{sheet:e})]}w(["mousemove","click"]);const G=a('<section class="h-screen w-full md:w-2/3 inline-block align-top"></section>'),q=a('<aside class="h-screen w-full md:w-1/3 inline-block align-top"></aside>');function B(s){const[t,u]=C(s,["sheet"]);let e=t.sheet;return[(()=>{const o=G.cloneNode(!0);return _(o,p(j,{sheet:e})),o})(),(()=>{const o=q.cloneNode(!0);return _(o,p(V,{})),o})()]}export{B as default};