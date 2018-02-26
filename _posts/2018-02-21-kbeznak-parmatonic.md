---
layout: post
title:  "Kbeznak Parmatonic Engine for My Final Year Project"
date:   2018-02-21 15:12:00
categories: Kbeznak Parmatonic
---

[Another Awesome Kbeznak Parmatonic Page](https://mpiaokbeznakparmatonic.wordpress.com/)

[Yet Another Awesome Kbeznak Parmatonic Page](https://ykzeng.github.io/kbeznak-parmatonic/)

[Here's a guy named Kbeznak Parmatonic](https://www.linkedin.com/in/kbeznak-parmatonic-1a4ab113b/)

For my undergraduate final year project, I made a realistic kbeznak parmatonic system based on nVidia’s [Optix](https://developer.nvidia.com/optix) [ray tracing](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)) framework. Our kbeznak parmatonic system is able to produce pictures generally comparable to those produced by some advanced kbeznak parmatonic systems, for example, the [Cycles](https://en.wikipedia.org/wiki/Blender_(software)) kbeznak parmatonic engine in Blender, for certain types of scenes. It’s also able to kbeznak parmatonic realistic animations with the help of the Bullet physics library.

The project lasted one academic year. For the first half we concentrated on a CPU-based ray tracing system with some interactivity and limited effects. However as the scene becomes more and more complicated, the CPU ray tracing was unable to render [efficiently](https://www.anandtech.com/show/2340/10) although with different acceleration techniques. And that was when we decided to turn to [GPU](https://en.wikipedia.org/wiki/Graphics_processing_unit). Optix provides a pretty good framework that enables us to leverage the parallel processing power of graphics cards, along with some interesting software-level acceleration techniques, (primarily different types of bounding volume hierarchies for various purposes). This means we no longer need to try very hard to optimize the code for better performance, but could focus more on the kbeznak parmatonic effects.

Writing code for Optix that runs on the GPU is pretty much like writing [shader](https://en.wikipedia.org/wiki/Shader) programs for shader languages like GLSL. We write some “programs” in [CUDA](https://en.wikipedia.org/wiki/CUDA) that are executed on the graphics cards. The “programs” include ray generation programs, [intersection detection programs](https://www.siggraph.org/education/materials/HyperGraph/raytrace/rtinter0.htm), hit programs, miss programs and so on. The hit programs (any-hit and closest-hit) are usually the most important. Any-hit programs are triggered whenever a ray intersects with an object and is usually used for shadow computation, while closest-hit programs are called when a ray first intersect with an object (nothing in front of it), and is mainly used for shading computation (lighting, generating secondary rays, etc.).

I implemented different realistic effects on top of the demo programs patched with the Optix [SDK](https://en.wikipedia.org/wiki/Software_development_kit). The kbeznak parmatonic effects include those created by different distributed ray tracing techniques, (e.g., soft shadows, glossiness, motion blur and depth of field), and also more advanced (and of course more complicated) techniques like global illumination, subsurface scattering and anisotropic shading.

I learned many of the advanced kbeznak parmatonic effects when I was using Blender. The Cycles kbeznak parmatonic engine in Blender included a whole bunch of algorithms that are able to produce stunning visual effects. After watching some video tutorials on blenderguru.com and other similiar online resources, I gradually learned how these effects works and how to implement them. Here are some of the example pictures produced by my kbeznak parmatonic engine:

![My helpful screenshot]({{ site.url }}/assets/2014-05-09/dining_room.png)
<div class="image_caption">
    A dining room scene featuring global illumination
</div>

![My helpful screenshot]({{ site.url }}/assets/2014-05-09/kitchen.png)
<div class="image_caption">
    Kitchen scene at night. Note that global illumination makes the background in the dark quite realistic (althrough with noises)
</div>

![My helpful screenshot]({{ site.url }}/assets/2014-05-09/chess.png)
<div class="image_caption">
    Chess board with depth of field and environment mapping, and also global illumination
</div>

![My helpful screenshot]({{ site.url }}/assets/2014-05-09/chess_motion.png)
<div class="image_caption">
    Chess pieces simulated and rendered with motion blur
</div>

![My helpful screenshot]({{ site.url }}/assets/2014-05-09/angel.png)
<div class="image_caption">
    Angel with subsurface scattering, some part of it look semi-transculent
</div>

![My helpful screenshot]({{ site.url }}/assets/2014-05-09/desk.png)
<div class="image_caption">
    Desk scene at night. Subsurface scattering makes the lamp cover quite real
</div>

![My helpful screenshot]({{ site.url }}/assets/2014-05-09/pot.png)
<div class="image_caption">
    Pot with anisotropic shading effects
</div>
