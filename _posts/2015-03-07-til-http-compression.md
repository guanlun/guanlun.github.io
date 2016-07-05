---
layout: post
title:  "TIL: HTTP Compression"
date:   2015-03-07 00:00:00
categories: web
---

* Web clients send HTTP requests to servers with a list of supported compression schemes in the `Accept-Encoding` header (e.g. `gzip, deflate`).
* If the server supports one of the compression schemes, it compresses the data using that algorithm and specify that in the response `Content-Encoding` header.
