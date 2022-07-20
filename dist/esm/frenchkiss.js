/**
 * @license frenchkiss 0.3.0
 * Copyright (c) 2018-2022 Koala Interactive, Inc.
 * License: MIT
 */
var n=/^\s*\w+\s*$/,t=/^\s*(\w+)\s*,\s*(select|plural)\s*,/i,e=JSON.stringify,r=function(n){return'(p["'+n+'"]||(p["'+n+'"]=="0"?0:"'+n+'" in p?"":v("'+n+'",k,l)))'};function u(n){for(var t={},u=function n(t,u){var o=[];var f=t.length;for(var i=0;i<f;++i){var c=t[i],a=c[0],s=c[1],l="";if(0===a&&s)l=e(s);else if(1===a)l=r(s.trim());else if(2===a){for(var v=c[2],p=c[3],h=c[4],g=p.length,b=0;b<g;++b)h?"="===p[b][0][0]?l+='p["'+v+'"]=='+e(p[b][0].substr(1)):(u[v]=1,l+='m["'+v+'"]=='+e(p[b][0])):l+='p["'+v+'"]=='+e(p[b][0]),l+="?"+n(p[b][1],u)+":";l="("+l+n(s,u)+")"}l&&o.push(l)}return o.join("+")||'""'}(o(n),t),f=Object.keys(t),i=f.length,c=[],a=0;a<i;++a)c[a]=f[a]+':f(p["'+f[a]+'"])';return Function("a","f","k","l","v","var p=a||{}"+(i?",m=f?{"+c+"}:{}":"")+";return "+u)}function o(e){for(var r=0,u="",o=e.length,f=[],i=0;i<o;++i){var a=e[i],s=void 0;"{"===a?r++||(s=[0,u]):"}"===a&&(--r||(s=n.test(u)?[1,u]:t.test(u)?c(u):[0,u])),s?(f.push(s),u=""):u+=a}return f.push([0,u]),f}function f(n,t,e,r){return n.slice(0,e)+t+n.slice(r)}function i(n,t){for(var e=-1;-1!==(e=n.indexOf("#",e+1));)"'"===n[e-1]&&"'"===n[e+1]?n=f(n,"#",e-1,e+2):(n=f(n,"{"+t+"}",e,e+1),e+=t.length+2);return n}function c(n){for(var e=n.match(t),r=e[1],u="p"===e[2][0].toLowerCase(),f=o(n.replace(t,"")),c=f.length,a=[],s=[0,""],l=0;l<c-1;){var v=f[l++][1].trim(),p=f[l++][1];u&&(p=i(p,r));var h=o(p);"other"===v?s=h:u&&"="===v[0]?a.unshift([v,h]):a.push([v,h])}return[2,s,r,a,u]}var a={},s={},l={},v="",p="",h=function(n){return n},g=function(){return""},b=function(n,t){return a[t]&&a[t][n]||s[t]&&"string"==typeof s[t][n]&&(a[t][n]=u(s[t][n]))},d=function n(t,e,r){for(var u=Object.keys(e),o=u.length,f=0;f<o;++f){var i=u[f],c=r+i;"object"==typeof e[i]?(n(t,e[i],c+"."),delete t[i]):t[c]=e[i]+""}},y=function n(t,e,r,u){for(var o=Object.keys(r),f=o.length,i=0;i<f;++i){var c=o[i],a=u+c;"object"==typeof r[c]?n(t,e,r[c],a+"."):t[a]!==r[c]&&(delete e[a],t[a]=r[c]+"")}};export default{cache:a,store:s,t:function(n,t,e){var r,u=e||v;return u&&(r=b(n,u))?r(t,l[u],n,u,g):(u=p)&&(r=b(n,u))?r(t,l[u],n,u,g):h(n,t,e||v)},onMissingKey:function(n){h=n},onMissingVariable:function(n){g=n},locale:function(n){return n&&(v=n),v},fallback:function(n){return n&&(p=n),p},set:function(n,t){d(t,t,""),a[n]={},s[n]=t},unset:function(n){delete a[n],delete s[n]},extend:function(n,t){s[n]||(s[n]={}),a[n]||(a[n]={}),y(s[n],a[n],t,"")},plural:function(n,t){l[n]=t}};
