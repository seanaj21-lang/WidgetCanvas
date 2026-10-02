// Copy this file to start a new widget, then add its name to list.js.
//
// width / height: the widget's size in pixels.
// mount(el): build the widget inside `el`. Use plain DOM, canvas, SVG,
// whatever you like. Keep styles inside `el` so they don't leak out.

export default {
  width: 160,
  height: 160,

  mount(el) {
    const button = document.createElement('button');
    button.textContent = '?';
    button.style.cssText = 'width:100%;height:100%;font-size:48px;border:0;background:#eee;cursor:pointer';
    button.onclick = () => (button.textContent = '!');
    el.appendChild(button);
  },
};
