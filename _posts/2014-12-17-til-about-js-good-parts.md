---
layout: post
title:  "TIL: Some Javascript Good Parts"
date:   2014-12-17 20:53:00
categories: web
---

### Javascript Prototypal Inheritance
Javascript has a half-prototypal-half-classical OOP paradigm. `new Foo()` creates an object that inherits not from `Foo` but from `Foo.prototype`.

### Javascript Function Invocation Patterns:
A method is a function as a property of an object. When a method is invoked, `this` is bound to the object.
When a function (not an object method) is invoked with this pattern, `this` is bound to the global object, rather than the `this` variable of the outer function.
