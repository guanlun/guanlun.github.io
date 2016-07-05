---
layout: post
title:  "TIL: ES6 Object Initialization with Expressions"
date:   2016-06-06 00:00:00
categories: web
---

We can actually do this in ES6:

```
const key = 'foo';
const obj = {
        [key]: 'bar'
};
```

instead of having to do:

```
const key = 'foo';
const obj = {};
obj[key] = 'bar';
```
