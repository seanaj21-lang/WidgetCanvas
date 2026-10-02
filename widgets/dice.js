// A die. Click it.
export default {
  width: 140,
  height: 140,

  mount(el) {
    const spots = {
      1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
    };
    el.style.cssText += 'display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);' +
      'padding:18px;background:#d94f3d;cursor:pointer;transition:transform .25s';
    const cells = Array.from({ length: 9 }, () => {
      const c = document.createElement('div');
      c.style.cssText = 'margin:auto;width:22px;height:22px;border-radius:50%;background:#fff';
      el.appendChild(c);
      return c;
    });
    let turn = 0;
    const roll = () => {
      const n = 1 + Math.floor(Math.random() * 6);
      cells.forEach((c, i) => (c.style.visibility = spots[n].includes(i) ? 'visible' : 'hidden'));
    };
    el.onclick = () => {
      turn += 360;
      el.style.transform = `rotate(${turn}deg)`;
      setTimeout(roll, 120);
    };
    roll();
  },
};
