import{X as D,Y as H,Z as Q,_ as V,$ as I,w as P,a0 as p,a1 as E,m as h,Q as W,a2 as X,a3 as J,y as k,a4 as Z,h as S,b as $,a5 as ee,a6 as re,G as ne,F as K,a7 as M,P as N,a8 as L,I as z,a9 as ie,aa as te,ab as ae,k as q,z as se,ac as fe,ad as ue,ae as le,af as ce,W as Y,ag as oe,ah as C,ai as de,aj as _e,ak as ve,v as pe,al as B,am as A,i as T,g as he}from"./runtime.HYkY6oFU.js";function g(e,r=null,a){if(typeof e!="object"||e===null||D in e)return e;const s=J(e);if(s!==H&&s!==Q)return e;var t=new Map,u=k(e),v=I(0),_;return new Proxy(e,{defineProperty(f,n,i){(!("value"in i)||i.configurable===!1||i.enumerable===!1||i.writable===!1)&&V();var l=t.get(n);return l===void 0?(l=I(i.value),t.set(n,l)):P(l,g(i.value,_)),!0},deleteProperty(f,n){var i=t.get(n);return i===void 0?n in f&&t.set(n,I(p)):(P(i,p),U(v)),!0},get(f,n,i){var b;if(n===D)return e;var l=t.get(n),o=n in f;if(l===void 0&&(!o||(b=E(f,n))!=null&&b.writable)&&(l=I(g(o?f[n]:p,_)),t.set(n,l)),l!==void 0){var c=h(l);return c===p?void 0:c}return Reflect.get(f,n,i)},getOwnPropertyDescriptor(f,n){var i=Reflect.getOwnPropertyDescriptor(f,n);if(i&&"value"in i){var l=t.get(n);l&&(i.value=h(l))}else if(i===void 0){var o=t.get(n),c=o==null?void 0:o.v;if(o!==void 0&&c!==p)return{enumerable:!0,configurable:!0,value:c,writable:!0}}return i},has(f,n){var c;if(n===D)return!0;var i=t.get(n),l=i!==void 0&&i.v!==p||Reflect.has(f,n);if(i!==void 0||W!==null&&(!l||(c=E(f,n))!=null&&c.writable)){i===void 0&&(i=I(l?g(f[n],_):p),t.set(n,i));var o=h(i);if(o===p)return!1}return l},set(f,n,i,l){var x;var o=t.get(n),c=n in f;if(o===void 0?(!c||(x=E(f,n))!=null&&x.writable)&&(o=I(void 0),P(o,g(i,_)),t.set(n,o)):(c=o.v!==p,P(o,g(i,_))),u&&n==="length")for(var b=i;b<f.length;b+=1){var O=t.get(b+"");O!==void 0&&P(O,p)}var w=Reflect.getOwnPropertyDescriptor(f,n);if(w!=null&&w.set&&w.set.call(l,i),!c){if(u&&typeof n=="string"){var m=t.get("length");if(m!==void 0){var y=Number(n);Number.isInteger(y)&&y>=m.v&&P(m,y+1)}}U(v)}return!0},ownKeys(f){h(v);var n=Reflect.ownKeys(f).filter(o=>{var c=t.get(o);return c===void 0||c.v!==p});for(var[i,l]of t)l.v!==p&&!(i in f)&&n.push(i);return n},setPrototypeOf(){X()}})}function U(e,r=1){P(e,e.v+r)}function Re(){throw new Error("invalid_default_snippet")}function be(e){throw new Error("lifecycle_outside_component")}function ge(e,r,a,s=null,t=!1){S&&$();var u=e,v=null,_=null,f=null,n=t?ie:0;Z(()=>{if(f===(f=!!r()))return;let i=!1;if(S){const l=u.data===ee;f===l&&(u=re(),ne(u),K(!1),i=!0)}f?(v?M(v):v=N(()=>a(u)),_&&L(_,()=>{_=null})):(_?M(_):s&&(_=N(()=>s(u))),v&&L(v,()=>{v=null})),i&&K(!0)},n),S&&(u=z)}function xe(e,r,a){S&&$();var s=e,t,u;Z(()=>{t!==(t=r())&&(u&&(L(u),u=null),t&&(u=N(()=>a(s,t))))}),S&&(s=z)}function F(e,r){return e===r||(e==null?void 0:e[D])===r}function Ee(e={},r,a,s){return te(()=>{var t,u;return ae(()=>{t=u,u=[],q(()=>{e!==a(...u)&&(r(e,...u),t&&F(a(...t),e)&&r(null,...t))})}),()=>{se(()=>{u&&F(a(...u),e)&&r(null,...u)})}}),e}const ye={get(e,r){if(!e.exclude.includes(r))return h(e.version),r in e.special?e.special[r]():e.props[r]},set(e,r,a){return r in e.special||(e.special[r]=Pe({get[r](){return e.props[r]}},r,C)),e.special[r](a),B(e.version),!0},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},deleteProperty(e,r){return e.exclude.includes(r)||(e.exclude.push(r),B(e.version)),!0},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function Se(e,r){return new Proxy({props:e,exclude:r,special:{},version:I(0)},ye)}const we={get(e,r){let a=e.props.length;for(;a--;){let s=e.props[a];if(A(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s)return s[r]}},getOwnPropertyDescriptor(e,r){let a=e.props.length;for(;a--;){let s=e.props[a];if(A(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s){const t=E(s,r);return t&&!t.configurable&&(t.configurable=!0),t}}},has(e,r){for(let a of e.props)if(A(a)&&(a=a()),a!=null&&r in a)return!0;return!1},ownKeys(e){const r=[];for(let a of e.props){A(a)&&(a=a());for(const s in a)r.includes(s)||r.push(s)}return r}};function Oe(...e){return new Proxy({props:e},we)}function Pe(e,r,a,s){var x;var t=(a&de)!==0,u=(a&ce)!==0,v=(a&_e)!==0,_=(a&ve)!==0,f=e[r],n=(x=E(e,r))==null?void 0:x.set,i=s,l=!0,o=()=>(_&&l&&(l=!1,i=q(s)),i);f===void 0&&s!==void 0&&(n&&u&&fe(),f=o(),n&&n(f));var c;if(u)c=()=>{var d=e[r];return d===void 0?o():(l=!0,d)};else{var b=(t?Y:oe)(()=>e[r]);b.f|=ue,c=()=>{var d=h(b);return d!==void 0&&(i=void 0),d===void 0?i:d}}if(!(a&C))return c;if(n){var O=e.$$legacy;return function(d,R){return arguments.length>0?((!u||!R||O)&&n(R?c():d),d):c()}}var w=!1,m=pe(f),y=Y(()=>{var d=c(),R=h(m);return w?(w=!1,R):m.v=d});return t||(y.equals=le),function(d,R){var G=h(y);if(arguments.length>0){const j=R?h(y):u&&v?g(d):d;return y.equals(j)||(w=!0,P(m,j),h(y)),d}return G}}function Ae(e){T===null&&be(),T.l!==null?me(T).m.push(e):he(()=>{const r=q(e);if(typeof r=="function")return r})}function me(e){var r=e.l;return r.u??(r.u={a:[],b:[],m:[]})}export{g as a,Ee as b,xe as c,Re as d,ge as i,Se as l,Ae as o,Pe as p,Oe as s};