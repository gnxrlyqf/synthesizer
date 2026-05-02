# amine
- [x] when u right click elsewhere the old menu should disappear
- [x] make the context menu fixed to the module (changed the position to fixed and made the overflow visible for it o chi 7wayj okhrin)
- [x] make the menu pop up wherever rightclicked inside the module  (misplacement of the menu config inside the div, DOM things)
- [x] ghost module refuses to let the module gets created (because it catches the click o ma3ndo ta handler)
- [x] ghost module randomly spawns at 0,0 (because when the ghost is created and ready for render it doesnt take the mouse coords since the mouse didnt move yet)
- [x] radio button are weirdly connected to each other and doesnt work across all the modules (because they used the same name now they are seperated by the uid of the module)
- [x] ghost dimensions were hardcoded now they depend on the value used in the implementation
- [x] when i right clicked in the grid the menu should disappear

- [ ] implement zoom in and out
- [ ] bridging the frontend with the audio (inform ysf)
- [ ] make the values in each module inputs

# keyboard
ghadi ykon keyboard 3rid
fih 2 octaves dyal lkeys
fih 2 outputs wa7d dyal lfrequency, which outputs a single constant value, o wa7d dyal trigger li only outputs 1 wla 0 based on whether something is pressed
fih wa7d toggle dyal free wla hold, ila kan free y9d l user yclicki 3la ay note bach tplaya, o yreleasi bach t7bs o ila kan hold rah katkon wa7d note selected o katb9a mwrka dima
fih 5 radio selectors with the following values -4, -2, 0, +2, +4 for changing octaves 
mixer o splitter which are self explanatory

# yousef

- [ ] filter makhdaminch fih cables and distortion they are not consistant mra ykhdmo mra no