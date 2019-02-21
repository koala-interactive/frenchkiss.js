# Plural Category functions

List of plural categories to handle locales plural rules. Take the one you need.

> Generated from [angular.js](https://github.com/angular/angular/blob/master/packages/common/src/i18n/localization.ts#L94) repository.

##### af, asa, az, bem, bez, bg, brx, ce, cgg, chr, ckb, ee, el, eo, es, eu, fo, fur, gsw, ha, haw, hu, jgo, jmc, ka, kk, kkj, kl, ks, ksb, ky, lb, lg, mas, mgo, ml, mn, nb, nd, ne, nn, nnh, nyn, om, or, os, ps, rm, rof, rwk, saq, seh, sn, so, sq, ta, te, teo, tk, tr, ug, uz, vo, vun, wae, xog

```js
frenchkiss.plural(lang, (n) => n === 1 ? 'one' : 'other');
```

---

##### ak, ln, mg, pa, ti

```js
frenchkiss.plural(lang, (n) => (
  (n === Math.floor(n) && n >= 0 && n <= 1) ? 'one' : 'other')
);
```

---

##### am, as, bn, fa, gu, hi, kn, mr, zu

```js
frenchkiss.plural(lang, (n) => (
  (Math.floor(Math.abs(n)) === 0 || n === 1) ? 'one' : 'other'
));
```

---

##### ar

```js
frenchkiss.plural(lang, (n) => (
  (n === 0) ? 'zero' :
  (n === 1) ? 'one' :
  (n === 2) ? 'two' : 
  (n % 100 === Math.floor(n % 100) && n % 100 >= 3 && n % 100 <= 10) ? 'few' :
  (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 99) ? 'many' :
  'other'
));
```

---

##### ast, ca, de, en, et, fi, fy, gl, it, nl, sv, sw, ur, yi

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;
  return (i === 1 && v === 0) ? 'one' : 'other';
});
```

---

##### be

```js
frenchkiss.plural(lang, (n) => (
  (n % 10 === 1 && !(n % 100 === 11)) ? 'one' :
  (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) ? 'few' :
  (n % 10 === 0 || n % 10 === Math.floor(n % 10) && n % 10 >= 5 && n % 10 <= 9 || n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 14) ? 'many' :
  'other'
));
```

---

##### br

```js
frenchkiss.plural(lang, (n) => (
  (n % 10 === 1 && !(n % 100 === 11 || n % 100 === 71 || n % 100 === 91)) ? 'one' :
  (n % 10 === 2 && !(n % 100 === 12 || n % 100 === 72 || n % 100 === 92)) ? 'two' :
  (n % 10 === Math.floor(n % 10) && (n % 10 >= 3 && n % 10 <= 4 || n % 10 === 9) &&
  !(n % 100 >= 10 && n % 100 <= 19 || n % 100 >= 70 && n % 100 <= 79 ||
    n % 100 >= 90 && n % 100 <= 99)) ? 'few' :
    (!(n === 0) && n % 1e6 === 0) ? 'many' :
  'other'
));
```

---

##### bs, hr, sr

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const nDecimal = n.toString().replace(/^[^.]*\.?/, '');
  const v = nDecimal.length;
  const f = parseInt(nDecimal, 10);

  return (
    (v === 0 && i % 10 === 1 && !(i % 100 === 11) || f % 10 === 1 && !(f % 100 === 11)) ? 'one' :
    (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 &&
    !(i % 100 >= 12 && i % 100 <= 14) || f % 10 === Math.floor(f % 10) && f % 10 >= 2 && f % 10 <= 4 && !(f % 100 >= 12 && f % 100 <= 14)) ? 'few' :
    'other'
  );
});
```

---

##### cs, sk

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;

  return (
    (i === 1 && v === 0) ? 'one' :
    (i === Math.floor(i) && i >= 2 && i <= 4 && v === 0) ? 'few' :
    (!(v === 0)) ? 'many' :
    'other'
  );
});
```

---

##### cy

```js
frenchkiss.plural(lang, (n) => (
  (n === 0) ? 'zero' :
  (n === 1) ? 'one' :
  (n === 2) ? 'two' :
  (n === 3) ? 'few' :
  (n === 6) ? 'many' :
  'other'
));
```

---

##### da

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const t = parseInt(n.toString().replace(/^[^.]*\.?|0+$/g, ''), 10) || 0;
  return ((n === 1 || !(t === 0) && (i === 0 || i === 1)) ? 'one' : 'other'));
});
```

---

##### dsb, hsb

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const nDecimal = n.toString().replace(/^[^.]*\.?/, '');
  const v = nDecimal.length;
  const f = parseInt(nDecimal, 10);

  return (
    (v === 0 && i % 100 === 1 || f % 100 === 1) ? 'one' :
    (v === 0 && i % 100 === 2 || f % 100 === 2)  ? 'two' :
    (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 ||
      f % 100 === Math.floor(f % 100) && f % 100 >= 3 && f % 100 <= 4) ? 'few' :
    'other'
  );
});
```

---

##### ff, fr, hy, kab

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  return (i === 0 || i === 1) ? 'one' : 'other'));
});
```

---

##### fil

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const nDecimal = n.toString().replace(/^[^.]*\.?/, '');
  const v = nDecimal.length;
  const f = parseInt(nDecimal, 10);

  return (
    (v === 0 && (i === 1 || i === 2 || i === 3) ||
          v === 0 && !(i % 10 === 4 || i % 10 === 6 || i % 10 === 9) ||
          !(v === 0) && !(f % 10 === 4 || f % 10 === 6 || f % 10 === 9)) ? 'one' : 'other'
  );
```

---

##### ga

```js
frenchkiss.plural(lang, (n) => (
  (n === 1) ? 'one' :
  (n === 2) ? 'two' :
  (n === Math.floor(n) && n >= 3 && n <= 6) ? 'few' :
  (n === Math.floor(n) && n >= 7 && n <= 10) ? 'many' :
  'other'
);
```

---

##### gd

```js
frenchkiss.plural(lang, (n) => (
  (n === 1 || n === 11) ? 'one' :
  (n === 2 || n === 12) ? 'two' :
  (n === Math.floor(n) && (n >= 3 && n <= 10 || n >= 13 && n <= 19)) ? 'few' :
  'other'
);
```

---

##### gv

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;

  return (
    (v === 0 && i % 10 === 1) ? 'one' :
    (v === 0 && i % 10 === 2) ? 'two' :
    (v === 0 && (i % 100 === 0 || i % 100 === 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80)) ? 'few' :
    (!(v === 0)) ? 'many' :
    'other'
  );
});
```

---

##### he

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;

  return (
    (i === 1 && v === 0) ? 'one' :
    (i === 2 && v === 0) ? 'two' :
    (v === 0 && !(n >= 0 && n <= 10) && n % 10 === 0) ? 'many' :
    'other'
  );
});
```

---

##### is

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const t = parseInt(n.toString().replace(/^[^.]*\.?|0+$/g, ''), 10) || 0;

  return (t === 0 && i % 10 === 1 && !(i % 100 === 11) || !(t === 0));
});
```

---

##### ksh

```js
frenchkiss.plural(lang, (n) => (
  (n === 0) ? 'zero' :
  (n === 1) ? 'one' :
  'other'
));
```

---

##### kw, naq, se, smn

```js
frenchkiss.plural(lang, (n) => (
  (n === 1) ? 'one' :
  (n === 2) ? 'two' :
  'other'
));
```

---

##### lag

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));

  return (
    (n === 0) ? 'zero' :
    (i === 0 || i === 1) && !(n === 0)) ? 'one' :
    'other'
  );
});
```

---

##### lt

```js
frenchkiss.plural(lang, (n) => (
  (n % 10 === 1 && !(n % 100 >= 11 && n % 100 <= 19)) ? 'one' :
  (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 9 && !(n % 100 >= 11 && n % 100 <= 19)) ? 'few' :
  (!(f === 0)) ? 'many' :
  'other'
));
```

---

##### lv, prg

```js
frenchkiss.plural(lang, (n) => {
  const nDecimal = n.toString().replace(/^[^.]*\.?/, '');
  const v = nDecimal.length;
  const f = parseInt(nDecimal, 10);

  return (
    (n % 10 === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19 ||
          v === 2 && f % 100 === Math.floor(f % 100) && f % 100 >= 11 && f % 100 <= 19) ? 'zero' :
    (n % 10 === 1 && !(n % 100 === 11) || v === 2 && f % 10 === 1 && !(f % 100 === 11) ||
          !(v === 2) && f % 10 === 1) ? 'one' :
    'other'
  );
});
```

---

##### mk

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const nDecimal = n.toString().replace(/^[^.]*\.?/, '');
  const v = nDecimal.length;
  const f = parseInt(nDecimal, 10);

  return ((v === 0 && i % 10 === 1 || f % 10 === 1) ? 'one' : 'other');
});
```


---

##### mt

```js
frenchkiss.plural(lang, (n) => (
  (n === 1) ? 'one' :
  (n === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 2 && n % 100 <= 10) ? 'few' :
  (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19) ? 'many' :
  'other'
));
```

---

##### pl

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;

  return (
    (i === 1 && v === 0) ? 'one' :
    (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) ? 'few' :
    (v === 0 && !(i === 1) && i % 10 === Math.floor(i % 10) && i % 10 >= 0 && i % 10 <= 1 ||
      v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 ||
      v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 12 && i % 100 <= 14) ? 'many' :
    'other'
  );
));
```

---

##### pt

```js
frenchkiss.plural(lang, (n) => (
  (n === Math.floor(n) && n >= 0 && n <= 2 && !(n === 2)) ? 'one' : 'other')
);
```

---

##### ro

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;

  return (
    (i === 1 && v === 0) ? 'one' :
    (!(v === 0) || n === 0 || !(n === 1) && n % 100 === Math.floor(n % 100) && n % 100 >= 1 && n % 100 <= 19) ? 'few' :
    'other'
  );
});
```

---

##### ru, uk

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;

  return (
    (v === 0 && i % 10 === 1 && !(i % 100 === 11)) ? 'one' :
    (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) ? 'few' :
    (v === 0 && i % 10 === 0 ||
      v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 ||
      v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14) ? 'many' :
    'other'
  );
});
```

---

##### shi

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));

  return (
    (i === 0 || n === 1)  ? 'one' :
    (n === Math.floor(n) && n >= 2 && n <= 10) ? 'few' :
    'other'
  );
});
```

---

##### si

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const f = parseInt(n.toString().replace(/^[^.]*\.?/, ''), 10);

  return ((n === 0 || n === 1 || i === 0 && f === 1) ? 'one' : 'other');
});
```

---

##### sl

```js
frenchkiss.plural(lang, (n) => {
  const i = Math.floor(Math.abs(n));
  const v = n.toString().replace(/^[^.]*\.?/, '').length;

  return (
    (v === 0 && i % 100 === 1) ? 'one' :
    (v === 0 && i % 100 === 2) ? 'two' :
    (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 || !(v === 0)) ? 'few' :
    'other'
  );
});
```

---

##### tzm

```js
frenchkiss.plural(lang, (n) => (
  (n === Math.floor(n) && n >= 0 && n <= 1 || n === Math.floor(n) && n >= 11 && n <= 99) ? 'one' : 'other'
));
```