---
layout: post
title:  "TIL: AWS S3 and CloudFront"
date:   2015-07-05 00:00:00
categories: web
---

buting static assets for a website, use S3 or CloudFront to reduce the load on your own server.

Use CloudFront to serve assets that require fast delivery (e.g. css and javascript files) and S3 to serve relatively large files that are not requested so ofter and less significant to the web performance (e.g. videos, sounds).

S3 charges according to how much data you store while CloudFront charges mainly by how much data is transmitted.

CloudFront can be used to serve asset on S3.
