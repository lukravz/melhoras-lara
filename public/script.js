(function () {
  var PETAL = 'M0 0 C-20 -28 -16 -66 0 -92 C16 -66 20 -28 0 0Z';
  var LAYERS = [
    { fill: 'pg-back',  petals: [[-78, .9], [78, .9], [-57, .98], [57, .98]] },
    { fill: 'pg-mid',   petals: [[-38, 1], [38, 1], [-19, .96], [19, .96]] },
    { fill: 'pg-front', petals: [[0, .9], [-9, .7], [9, .7]] }
  ];
  function lotusSVG(cls) {
    var s = '<svg class="lotus ' + (cls || '') + '" viewBox="0 0 200 120" aria-hidden="true">' +
            '<ellipse class="padleaf" cx="100" cy="104" rx="74" ry="12"/><g transform="translate(100 100)">';
    LAYERS.forEach(function (l) {
      l.petals.forEach(function (p) {
        s += '<path class="pt" d="' + PETAL + '" fill="url(#' + l.fill + ')" style="--a:' + p[0] + 'deg;--s:' + p[1] + '"/>';
      });
    });
    return s + '</g></svg>';
  }

  document.getElementById('hero-lotus').outerHTML = lotusSVG('bloom');
  document.getElementById('end-lotus').outerHTML = lotusSVG('');

  /* ----- Lago ----- */
  var pond = document.getElementById('pond');
  var recado = document.getElementById('recado');
  var countEl = document.getElementById('count');
  var RECADOS = [
    'Tem gente que da as risadas mais sinceras com você. Eu sou uma delas.',
    'Você é incrível, e nada vai mudar isso.',
    'Descansar também é necessário.',
    'Vou estar aqui sempre que precisar, e quando não precisar.',
    'Nada deve ser feito de uma vez, uma coisa de cada vez.',
    'Chorar faz bem pra mente, mesmo que chore, isso não é uma fraqueza.',
    'Eu estou aqui. Hoje, amanhã e depois.',
    'Sempre que você perguntar oque tem no ovo do Leão eu vou falar "la ele".',
    'Quando quiser conversar, é só chamar. A qualquer hora.',
    'Passar tempo com você, mesmo que a gente fique calado é divertido.',
  ];
  var next = 0, total = 0, MAX = 36;

  function plant(xPct, yPct, animate) {
    var holder = document.createElement('div');
    holder.innerHTML = lotusSVG(animate ? 'bloom' : '');
    var el = holder.firstChild;
    el.style.left = xPct + '%';
    el.style.top = yPct + '%';
    el.style.width = (11 + yPct * 0.14) + '%';
    el.style.zIndex = Math.round(yPct);
    pond.appendChild(el);
    total++;
    var flowers = pond.querySelectorAll('.lotus');
    if (flowers.length > MAX) flowers[0].remove();
    countEl.textContent = total;
    if (animate) {
      var ring = document.createElement('span');
      ring.className = 'ring';
      ring.style.left = xPct + '%';
      ring.style.top = yPct + '%';
      pond.appendChild(ring);
      setTimeout(function () { ring.remove(); }, 1500);
      recado.textContent = RECADOS[next % RECADOS.length];
      next++;
    }
  }

  [[18, 38], [70, 30], [44, 58], [84, 70], [22, 82]].forEach(function (p) { plant(p[0], p[1], false); });

  pond.addEventListener('click', function (e) {
    var r = pond.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width * 100;
    var y = (e.clientY - r.top) / r.height * 100;
    if (!(e.clientX || e.clientY)) { x = 10 + Math.random() * 80; y = 25 + Math.random() * 65; }
    plant(Math.min(92, Math.max(8, x)), Math.min(94, Math.max(20, y)), true);
  });
  pond.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      plant(10 + Math.random() * 80, 25 + Math.random() * 65, true);
    }
  });

  /* ----- Respiração ----- */
  var bf = document.getElementById('breath-flower');
  bf.innerHTML = lotusSVG('');
  var flower = bf.firstChild;
  var label = document.getElementById('breath-label');
  var btn = document.getElementById('breath-btn');
  var running = false, timer = null, breaths = 0;

  function phaseIn() {
    if (!running) return;
    flower.style.setProperty('--dur', '4s');
    flower.classList.remove('closed');
    label.textContent = 'Puxe o ar devagar…';
    timer = setTimeout(phaseOut, 4000);
  }
  function phaseOut() {
    if (!running) return;
    flower.style.setProperty('--dur', '6s');
    flower.classList.add('closed');
    label.textContent = 'Solte bem devagar…';
    timer = setTimeout(function () { breaths++; phaseIn(); }, 6000);
  }
  btn.addEventListener('click', function () {
    if (running) {
      running = false;
      clearTimeout(timer);
      flower.style.setProperty('--dur', '1.2s');
      flower.classList.remove('closed');
      btn.textContent = 'Começar de novo';
      label.textContent = breaths > 0
        ? (breaths === 1 ? 'Uma respiração inteira. Muito bem.' : breaths + ' respirações. Muito bem.')
        : 'Quando quiser, é só começar.';
      return;
    }
    running = true; breaths = 0;
    btn.textContent = 'Parar';
    label.textContent = 'Solte o ar que tiver…';
    flower.style.setProperty('--dur', '1.5s');
    flower.classList.add('closed');
    timer = setTimeout(phaseIn, 1700);
  });
})();
