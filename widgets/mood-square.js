// A square that changes color as you move across it.
export default {
  width: 180,
  height: 180,

  mount(el) {
    el.style.cssText += 'background:hsl(200 60% 70%);transition:background .2s';
    el.onpointermove = (e) => {
      const r = el.getBoundingClientRect();
      const hue = ((e.clientX - r.left) / r.width) * 360;
      const light = 30 + ((e.clientY - r.top) / r.height) * 50;
      el.style.background = `hsl(${hue} 70% ${light}%)`;
    };
  },
};
