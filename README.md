# Circles

## Warnings
- **Some of the possible configurations can result in strobe-like effects.**
- This program can easily overload the browser and freeze it.

## About
I programmed this for fun while listening to Mac Miller's new Circles album. This was a great opportunity to learn about the Canvas and Classes in JavaScript. I had a lot of fun making this and am really happy with the various effects this tool can create. 

## Questions / Issues
- Additional runs seem to increase the speed. Almost seem like it's animating faster since new circles are being created with speeds in the same bounds (see console logs). Haven't found an issue with my logic yet but I must be doing something wrong. The easiest way to see this is set the minSpeed to 0 and the maxSpeed to 0.01. Only possible speeds are 0 and 0.01 in this case. If you reload and then click start 10 times rapidly you should notice a large absolute speed jump in subsequent runs.
- clearRect sets pixels to transparent black so I'm using a fillRect with solid black instead; does this matter since I've already set alpha: false on the context?
- how can I reverse the arc direction? Subtracting speed instead of adding it seems to have the equivalent effect as using the counterclockwise bool in arc. The effect does not reverse in the manner I expect. Confused what's actually happening.
- Very easy to crash. How can I improve performance?
    - speed is adjusted by #.## and then drawn which requires sub-pixel calcs. I reduced the floats to 2 decimals but I think I need to use ints for optimal speed. That limits my min speed though. 
    - what impact does not clearing the canvas have (I did add a clear inside init, is this needed or is a new context created?)
    - should I be rendering on an off screen canvas? Since every arc changes every time I'm not sure this would add a benefit?
    - should I use multiple canvas layers? I saw this talked about but I'm not sure if it would impact my program
- How is array colorMultipliers being set (all should be 1, 1, 1) and colors being set to floats (I'm requesting ints) in init()? Stepped through and it appears to be setting correctly so maybe the console log is happening after the animation has already happened a few times? I tried console logging from draw and it doesn't appear until after the array is init and printed so pretty confused here.
- Colors seem to fade to lighter or darker together. Not sure if this is the canvas overloading or something else.

## TODO
- enable scroll on menu and add hide button


