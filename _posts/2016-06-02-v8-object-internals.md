---
layout: post
title:  "TIL: How V8 Handles Javascript Objects Internally"
date:   2016-06-02 00:00:00
categories: web
---

TIL that V8 handles Javascript objects in a quite static way. Instead of creating a table that computes the keys' hash values and look up the dictionary for that hash code, it actually creates internal "classes" for faster object access.

When creating a new object and augmenting this object by adding / deleting properties, V8 creates a book-keeping class that uses static offsets to locate each fields. This saves the hash code computation during lookup and greatly improves performance when a lot of object key accesses are performed.
