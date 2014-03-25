---
layout: post
title:  "Blender Script Hacking for Custom .obj File Output"
date:   2014-03-24 23:42:33
categories: graphics
---

While I was working on my undergraduate final year project on computer graphics, I found Blender to be a awesome 3D modeling software. Creating scenes, making textures, applying lighting are easily done in Blender and it’s completely free. However, it was a nightmare when I needed to output my scenes in blender and render them in the render engine I built. Hoping to make use of the default .blend file for interfacing with my renderer, I spent around a month trying to crack the Blender source code for saving and loading .blend files. And that was such a PAIN.

The .blend files consists of not only objects, material, textures and lighting, which are basically what I needed, but – hundreds of other random and strange staff, including animation (which I didn’t need), node data (nodes are great, indeed, but not what I wanted), and window layout (uh!). And not surprisingly, the file components are interconnected with each other, which took me forever to understand the file structure.

That’s when I realized it would be a entire final year project to build a Blender file reader and I decided to give up and try other file formats. Wavefront obj files seemed a good candidate compared to other exotic (not really) formats.

Wavefront obj files are pretty simple, which includes vertex data, geometry primitives, material information, etc. But I wanted more. I wanted more material information than just those basic parameters usually for Phong shading. I wanted glossiness, index of refraction and subsurface scattering. I also wanted normal maps and specular maps which Blender failed to output in the way I liked.

It did not take me too long to find that Blender actually used Python instead of native code to handle file export, which saved me from recompiling the whole code base each time I make changes (I actually was prepared to build the entire Blender application and got the source code built on my computer in Xcode). The file was located in this directory:

	/Applications/Blender/blender.app/Contents/MacOS/2.68
	/scripts/addons/io_scene_obj/export_obj.py

Hacking the code was not very straightforward, since when dealing with a material object in the scripts I did not have any information about its attributes. Therefore my only solution was to write the properties into the output file using Python’s runtime self-introspection, object by object to find out which objects contained which properties. It was a painful and boring process but finally I located the mat object contained information like `mat.raytrace_transparency.ior`, `mat.raytrace_mirror.gloss_factor`, `mat.subsurface_scattering.scale` and so on. Then I was able to write out these properties to my custom .obj file and load them in the parse I wrote to connect it to my renderer.