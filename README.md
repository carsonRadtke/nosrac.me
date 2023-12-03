# nosrac.me
https://nosrac.me

### Running Locally

tl;dr:
```
$ make serve
```

There are three main components:
1. `animation/` contains the rust code that compiles to web assembley and takes care of
the logic for particles and for the particle system
2. `ui/` contains the typescript code that compiles to javascript and takes care of 
manipulating the DOM as well as initializing the canvas
3. `www/` is the site's root directory and all generated code is ultimately moved there
