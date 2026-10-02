// Tally marks. Click to add one, right-click to take one away.
export default {
  width: 220,
  height: 120,

  mount(el) {
    el.style.cssText += 'background:#f6f1e3;cursor:pointer;display:flex;' +
      'flex-wrap:wrap;align-content:center;justify-content:center;gap:4px 14px;padding:10px';
    let count = 0;
    const draw = () => {
      el.textContent = '';
      for (let g = 0; g < Math.ceil(count / 5); g++) {
        const n = Math.min(5, count - g * 5);
        const group = document.createElement('span');
        group.style.cssText = 'position:relative;font:28px/1 monospace;letter-spacing:-2px;color:#333';
        group.textContent = '|'.repeat(Math.min(n, 4));
        if (n === 5) {
          const slash = document.createElement('span');
          slash.style.cssText = 'position:absolute;left:-4px;right:-4px;top:50%;height:2px;' +
            'background:#333;transform:rotate(-25deg)';
          group.appendChild(slash);
        }
        el.appendChild(group);
      }
    };
    el.onclick = () => { count = Math.min(count + 1, 60); draw(); };
    el.oncontextmenu = (e) => { e.preventDefault(); count = Math.max(0, count - 1); draw(); };
  },
};
