import{C as A,p as I,D as V,E as T,F as k,H,G as L,I as E,J as m,K as O,M,N as y,O as Y,Q as C,R as P,T as W,V as $,W as q,X as B,Y as F,Z as b,k as G,_ as J,c as K}from"./runtime.Cxkzd3N0.js";import{b as Q}from"./disclose-version.DE9lqZzK.js";const X=new Set,S=new Set;function v(t){var N;var r=this,o=r.ownerDocument,l=t.type,i=((N=t.composedPath)==null?void 0:N.call(t))||[],e=i[0]||t.target,u=0,c=t.__root;if(c){var d=i.indexOf(c);if(d!==-1&&(r===document||r===window)){t.__root=r;return}var f=i.indexOf(r);if(f===-1)return;d<=f&&(u=d)}if(e=i[u]||t.target,e!==r){A(t,"currentTarget",{configurable:!0,get(){return e||o}});try{for(var _,a=[];e!==null;){var s=e.parentNode||e.host||null;try{var n=e["__"+l];if(n!==void 0&&!e.disabled)if(I(n)){var[g,...p]=n;g.apply(e,[t,...p])}else n.call(e,t)}catch(w){_?a.push(w):_=w}if(t.cancelBubble||s===r||s===null)break;e=s}if(_){for(let w of a)queueMicrotask(()=>{throw w});throw _}}finally{t.__root=r,e=r}}}const Z=["wheel","mousewheel","touchstart","touchmove"];function j(t){return Z.includes(t)}function rr(t,r){r!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=r,t.nodeValue=r==null?"":r+"")}function z(t,r){const o=r.anchor??r.target.appendChild(V());return D(t,{...r,anchor:o})}function tr(t,r){T(),r.intro=r.intro??!1;const o=r.target,l=b,i=y;try{for(var e=k(o);e&&(e.nodeType!==8||e.data!==H);)e=L(e);if(!e)throw E;m(!0),O(e),M();const u=D(t,{...r,anchor:e});if(y===null||y.nodeType!==8||y.data!==Y)throw C(),E;return m(!1),u}catch(u){if(u===E)return r.recover===!1&&P(),T(),W(o),m(!1),z(t,r);throw u}finally{m(l),O(i)}}const h=new Map;function D(t,{target:r,anchor:o,props:l={},events:i,context:e,intro:u=!0}){T();var c=new Set,d=a=>{for(var s=0;s<a.length;s++){var n=a[s];if(!c.has(n)){c.add(n);var g=j(n);r.addEventListener(n,v,{passive:g});var p=h.get(n);p===void 0?(document.addEventListener(n,v,{passive:g}),h.set(n,1)):h.set(n,p+1)}}};d($(X)),S.add(d);var f=void 0,_=q(()=>(B(()=>{if(e){F({});var a=K;a.c=e}i&&(l.$$events=i),b&&Q(o,null),f=t(o,l)||{},b&&(G.nodes_end=y),e&&J()}),()=>{for(var a of c){r.removeEventListener(a,v);var s=h.get(a);--s===0?(document.removeEventListener(a,v),h.delete(a)):h.set(a,s)}S.delete(d),R.delete(f)}));return R.set(f,_),f}let R=new WeakMap;function er(t){const r=R.get(t);r==null||r()}export{tr as h,z as m,rr as s,er as u};