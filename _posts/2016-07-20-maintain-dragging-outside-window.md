---
layout: post
title:  "Maintain Dragging when Mouse is outside Browser Window"
date:   2016-06-06 00:00:00
categories: web
---

When using the `mousedown`, `mousemove`, `mouseup` events for dragging, it's sometimes annoying when the user moves the mouse outside the view, or sometimes, the browser window. For example, you have a canvas with a bunch of items drawn on it and you'd like to implement to drag-to-select feature. When the canvas does not occupy the entire screen (which is normally the case), dragging outsides the canvas would be painful.

So instead of attaching all your listeners to the canvas element itself, attach them to the `document`.

Check out this jsfiddle I made as a sample demo:

<script async src="//jsfiddle.net/yq0wq2n0/3/embed/"></script>
