// A stopwatch with one button. Tap to start, tap to stop, double-tap to reset.
export default {
  width: 200,
  height: 90,

  mount(el) {
    el.style.cssText += 'background:#20242b;color:#9fe870;display:flex;align-items:center;' +
      'justify-content:center;font:600 30px/1 ui-monospace,monospace;cursor:pointer';
    let start = 0, elapsed = 0, timer = null;
    const show = (ms) => {
      const s = ms / 1000;
      el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(2).padStart(5, '0')}`;
    };
    el.onclick = () => {
      if (timer) {
        cancelAnimationFrame(timer);
        timer = null;
        elapsed += performance.now() - start;
      } else {
        start = performance.now();
        const tick = () => { show(elapsed + performance.now() - start); timer = requestAnimationFrame(tick); };
        tick();
      }
    };
    el.ondblclick = () => {
      cancelAnimationFrame(timer);
      timer = null;
      elapsed = 0;
      show(0);
    };
    show(0);
  },
};
