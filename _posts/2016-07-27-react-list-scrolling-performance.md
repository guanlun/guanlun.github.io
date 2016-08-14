---                                                                                                                     
layout: post
title:  "React List Scrolling Performance Tips"
date:   2016-07-27 00:00:00
categories: web
---

Say you have a list / grid with thousands of items, what can you do to keep the scrolling smooth? Recently at work we encountered a problem with an asset explorer that contained around 6,000 assets and we expect the user would scroll up and down all the time to find the assets they want. That makes scrolling performance critical to the user experience. A simple test that renders all the items at once quickly ruled out the brute-force approach.

Let's take a deeper look at the use case first. The asset grid is a child of the asset explorer. Above the list we have some fancy graphics that changes as the user scrolls down (some sort of parallax scrolling stuff) so we need the `onWheel` listener at the `container` level.

![A Simple Illustration]({{ site.url }}/assets/2016-07-27/scroll-view.png)

We then took a look at rendering only the visible items by adding a container component (let's call it `ViewportScrollProxy`). We put the item inside the `ViewportScrollProxy` and based on its relative position, and render `null` if the item is out of the viewport.

Does it work? Well, partially. After applying this change the scrolling is still a bit janky so I opened the chrome devtools and did a timeline profiling. It seemed that checking which of the 6,000 are within the viewport every time a `scroll` event is fired is putting some serious load on the CPU. How do we effectively reduce the load when scrolling then? List virtualization comes to rescue.

List virtualization means we do not have a DOM element for each item to display. Instead, we only maintain a handful of `<div>`s enough to fill in our grid view. For our asset explorer we're going to call them `GridItem`s. the `GridItem`s are reused to display different asset thumbnails. As we're scrolling up and down, the items get updated and rendered in the grid view.

There are a few nice libraries available for virtualized lists and grids in react, e.g. `react-virtualized`. However it comes with default stlyes that we don't want. Besides, it's quite a heavy-weight library and we'd not like to see additional MBs added to our already large codebase to slow down our app loading time even further. So why not do it ourselves? It's just a list view that listens to the `scroll` event, updates some position properties and re-populates the child components, right?

So that's what we have. Based on the height of the container we determine the number of `GridItem`s needed to fill it. Say its height is 1000px with 180x180 items (which means we need `Math.ceil(1000 / 180) + 1 = 7` rows and `7 * 3` items). `Explorer` listens to the `wheel` event, update the fancy landing graphics and passes the `scrollTop` prop to the `GridView`. `GridView` takes a look at `scrollTop`, determines how many rows have been scrolled (i.e. number of rows above the first visible row, we call it `numRowsAbove`) and applies a `paddingTop` css property to position itself inside the viewport. If each row has 3 items and 4 rows are above, we start from the 13th item and populate 21 items into the `GridItem`s.

<script src="https://gist.github.com/guanlun/a56af3e643114bc7596f0713465b130e.js"></script>

Can we do it better? Do we need to re-render `GridView` for every `wheel` event? Looks like we don't. The only thing we need to update in `GridView` is  `paddingTop`. That essentially means we should not pass `props` to `GridView` upon each `wheel`. We simply need to dispatch an action `ExplorerAction.scrollExplorer`which calls `ExplorerStore.scrollExplorer` which emits `EXPLORER_SCROLL_EVENT` which is listened by `GridView` (phew~). And its the `handleExplorerScroll` function, we calculate `numRowsAbove` and call `setState` (notes that we used to do that in `render`!). This essentially saves us from invalidating the current view every single frame. Now we only re-render the `GridView` and re-populate the children every time we scroll past an entire row (of course we need to use `shallowCompare` to skip the unnecessary updates).

<script src="https://gist.github.com/guanlun/dd769a327a6f53be80864887c15695d5.js"></script>

The result is encouraging. We're now able to reach around 60FPS!

One additional and probably subtle performance improvement could be realized by replacing the `paddingTop: 100px` with `transform: translateY(100px)`. However we'd need to controll the offset ourselves then, since we might scroll beyond the bound. I'm not going to elaborate in this article.
