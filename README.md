# WidgetCanvas

An endless canvas of unlabeled widgets. Drag to pan, scroll or pinch to zoom,
grab a widget's border to move it. Poke at things and find out what they do.

It's a plain static site: no build step, no backend.

## Adding a widget

1. Copy `widgets/_template.js` to `widgets/your-widget.js`.
2. Set its `width` and `height`, and build it inside `mount(el)`.
3. Add `'your-widget'` to `widgets/list.js`.

That's it. Widgets get scattered in random spots on every visit.

## Running it locally

Any static file server works, for example:

    python3 -m http.server

then open http://localhost:8000.

## Publishing on GitHub Pages

Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
The site appears at https://seanaj21-lang.github.io/WidgetCanvas/.
