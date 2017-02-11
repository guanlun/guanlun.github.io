---                                                                                                                     
layout: post
title:  "Simple JS Script to Watch Changes and Rsync"
date:   2017-02-10 00:00:00
categories: web
---

I created a simple Node.js script to watch local file changes and rsync it to a remote server (I'm too lazy to figure out how to use stuff like "inotifywait" :P).

It's for a C++ project that I have to do on a remote server because I couldn't get it compiled locally after hours. Although I was once (maybe 5 years ago) addicted to using vanilla vim for C++ coding and finding syntax errors in the long long list of g++ output, I have to admit that my C++ skills (and my patience) are no longer what they're used to be when I was a college freshman. (Ouch)

While I can't compile it locally, it doesn't stop me from using the other IDE features. So I downloaded the code as well as the headers and set it up in a local IDE so that I can have all the goodies, like being told I've passed a reference to a pointer instead of pointer to a pointer. (Ouch) And then sync those files to the server.

It isn't complicated at all, is it?

<script src="https://gist.github.com/guanlun/8442bf9ecb8b2f3b645392e9beaf11d2"></script>
