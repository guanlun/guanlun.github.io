---
layout: post
title:  "TIL: Pushing Data from Server to Client"
date:   2014-12-18 00:00:00
categories: web
---

* HTTP server push: The server does not terminate a connection after response data has been served. It leaves the connection open and if any event occurs, it can send data out immediately.
* Long polling: The client requests data from server, and if the server does not have any information available to send to the client, when the poll is received, it holds the request open and wait for response information to be available.
* Comet: Long-held HTTP request allows the server to push data to the client.
