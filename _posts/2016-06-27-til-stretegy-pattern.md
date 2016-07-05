---
layout: post
title:  "TIL: Design Patterns - Stretegy Pattern"
date:   2016-06-27 00:00:00
categories: web
---

For a base class with a number of subclasses, each subclass may have different behavior for a certain action. The stretegy pattern encapsulates each action into a separate class and therefore enabling independent behavior selection at runtime.

* A family of algorithms is defined and they extend a single interface representing the action to be performed.
* The classes performing those actions maintains a reference to a specific stretegy object.
* The behavior could be updated during runtime simply by assigning another action object.
* This pattern decouples the action logic from the classes that perform those actions, reducing complexity and enabling change of behavior.
