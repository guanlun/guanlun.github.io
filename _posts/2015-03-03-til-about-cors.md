---
layout: post
title:  "TIL: Cross Origin Resource Sharing (CORS)"
date:   2015-03-03 00:00:00
categories: web
---

Resources like images, styles and scripts can be embeded from any other domain. But AJAX requests to other domains are limited due to the same origin policy.

CORS works by sending the `Origin` header in the HTTP request, e.g., `Origin: http://example.com` and setting the `Access-Control-Allow-Origin` for the server.
