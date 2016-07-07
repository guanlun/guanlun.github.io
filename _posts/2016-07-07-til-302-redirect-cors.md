---
layout: post
title:  "TIL: HTTP 302 Redirect CORS with Null Origin"
date:   2016-07-07 00:00:00
categories: web
---

Say a page on domain `www.foo.com` Initiated a XHR to `asset.foo.com`. The API endpoint on `asset.foo.com` responded with a `302` header pointing to `image.foo.com`. What will happen?

Unfortunately, browsers would consider this redirect in a "privacy-sensitive context" and set the `Origin` header to `null` in the request to `image.foo.com`, preventing that XHR unless the `Access-Control-Allow-Origin` header on `image.foo.com` is set to `*`.

If we don't wish to set a permissive CORS header, seems the current solution is to use HTTP `200` with the redirect URL in the response body...
