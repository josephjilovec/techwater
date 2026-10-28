(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('button[data-motion]');
  let motionRequested = true;
  try {
    const saved = sessionStorage.getItem('techwater-motion');
    if (saved !== null) motionRequested = saved === 'on';
  } catch { /* Display preferences are optional. */ }

  const applyMotion = () => {
    const enabled = motionRequested && !reducedMotion.matches;
    root.dataset.motion = enabled ? 'on' : 'off';
    if (!motionButton) return;
    motionButton.setAttribute('aria-pressed', String(enabled));
    motionButton.querySelector('[data-motion-label]').textContent = enabled ? 'Motion on' : 'Motion off';
    motionButton.title = reducedMotion.matches
      ? 'Your device’s reduced-motion preference is active.'
      : 'Pause or resume decorative motion';
  };
  motionButton?.addEventListener('click', () => {
    motionRequested = root.dataset.motion !== 'on';
    try { sessionStorage.setItem('techwater-motion', motionRequested ? 'on' : 'off'); } catch { /* Optional. */ }
    applyMotion();
  });
  reducedMotion.addEventListener?.('change', applyMotion);
  applyMotion();

  // Native dialogs contain focus and support Escape. Restore the opener on close.
  const menu = document.getElementById('water-menu');
  const menuButton = document.querySelector('[data-menu]');
  const report = document.getElementById('report-dialog');
  const reportButton = document.querySelector('[data-report-open]');
  const openers = new WeakMap();
  const openDialog = (dialog, opener) => {
    if (!dialog || dialog.open || typeof dialog.showModal !== 'function') return;
    openers.set(dialog, opener);
    dialog.showModal();
    if (dialog === menu) menuButton?.setAttribute('aria-expanded', 'true');
    dialog.querySelector('[data-close]')?.focus();
  };
  menuButton?.addEventListener('click', () => openDialog(menu, menuButton));
  reportButton?.addEventListener('click', () => openDialog(report, reportButton));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button =>
      button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      if (dialog === menu) menuButton?.setAttribute('aria-expanded', 'false');
      openers.get(dialog)?.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right ||
          event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.querySelectorAll('nav a').forEach(link =>
      link.addEventListener('click', () => dialog.close()));
  });

  const comparisonButtons = document.querySelectorAll('[data-comparison]');
  comparisonButtons.forEach(button => {
    button.addEventListener('click', () => {
      const daily = button.dataset.comparison === 'daily';
      comparisonButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      document.getElementById('period-a-bar').style.width = daily ? '80%' : '68.5714%';
      document.getElementById('period-b-bar').style.width = '90%';
      document.getElementById('period-a-value').textContent = daily ? '800 US gal/day' : '24,000 US gal';
      document.getElementById('period-b-value').textContent = daily ? '900 US gal/day' : '31,500 US gal';
      document.getElementById('change-amount').textContent = daily ? '+12.5%' : '+31.3%';
      document.getElementById('comparison-summary').textContent = daily
        ? 'Higher daily use after accounting for billing duration.'
        : 'Higher billed total, before accounting for the five extra days.';
    });
    button.disabled = false;
  });

  const contextNotes = {
    unknown: [
      'Ask the property team about occupancy, irrigation schedules, and known work before assigning a cause.',
      'Review occupancy, irrigation schedules, and known work.'
    ],
    occupancy: [
      'Verify when occupancy changed and whether the timing aligns with the billing periods. Do not assume this accounts for the entire increase.',
      'Verify occupancy dates and compare them with the billing periods.'
    ],
    irrigation: [
      'Check the irrigation schedule, weather context, and any known work. Ask a qualified specialist to investigate unresolved site questions.',
      'Review irrigation schedules and known work with the property team.'
    ]
  };
  const contextButtons = document.querySelectorAll('[data-context]');
  contextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const note = contextNotes[button.dataset.context];
      if (!note) return;
      contextButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      document.getElementById('context-question').textContent = note[0];
      document.getElementById('followup-question').textContent = note[1];
    });
    button.disabled = false;
  });

  const form = document.querySelector('[data-readiness]');
  if (form) {
    const result = document.getElementById('draft-result');
    const area = document.getElementById('draft-text');
    const email = document.getElementById('email-note');
    const status = document.getElementById('draft-status');
    const records = [...form.querySelectorAll('[name=records]')];
    const updateEmail = () => {
      email.href = 'mailto:josephjilovec@pm.me?subject=' +
        encodeURIComponent('TechWater — data-readiness conversation') +
        '&body=' + encodeURIComponent(area.value);
    };
    const updateReadiness = () => {
      const count = records.filter(record => record.checked).length;
      const counter = document.getElementById('readiness-count');
      const denominator = document.createElement('span');
      denominator.textContent = '/4';
      counter.replaceChildren(document.createTextNode(String(count)), denominator);
      document.getElementById('readiness-note').textContent = count === 4
        ? 'The basics are identified. A first conversation can check permissions, record quality, and proposed scope.'
        : count
          ? 'Keep the gaps visible. A first conversation can clarify what is missing before a pilot is scoped.'
          : 'Start by identifying one property and the records you can access with permission.';
    };
    records.forEach(record => record.addEventListener('change', updateReadiness));
    updateReadiness();
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      area.value = 'TechWater — data-readiness conversation\n\n' +
        'Reporting question: ' + data.get('goal') + '\n' +
        'Available records and ownership: ' + (data.getAll('records').join(', ') || 'Not yet confirmed') + '\n' +
        'General property context: ' + (String(data.get('context') || '').trim() || 'To discuss') + '\n\n' +
        'Please help identify missing information and whether a bill-based reporting pilot is suitable.\n\n' +
        'I understand this service is in development. Please confirm availability and agree the scope before any engagement.';
      updateEmail();
      result.hidden = false;
      status.textContent = 'Draft created in this browser. Nothing has been sent.';
      document.getElementById('draft-title').focus();
    });
    form.querySelector('[type=submit]').disabled = false;
    form.addEventListener('input', event => {
      if (event.target.closest('#draft-result')) return;
      result.hidden = true;
      status.textContent = '';
    });
    area.addEventListener('input', () => {
      updateEmail();
      status.textContent = 'Edits stay in this draft. Nothing has been sent.';
    });
    document.querySelector('[data-copy]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(area.value);
        status.textContent = 'Copied. Paste the note into your preferred email app.';
      } catch {
        area.focus();
        area.select();
        status.textContent = 'Select and copy the note above using your device’s copy command.';
      }
    });
    document.querySelector('[data-download]').addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([area.value], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'techwater-readiness-note.txt';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Download prepared. The note has not been sent to TechWater.';
    });
  }

  root.classList.add('js');

  let scrollQueued = false;
  const updateScroll = () => {
    scrollQueued = false;
    const scrollable = root.scrollHeight - root.clientHeight;
    root.style.setProperty('--scroll', String(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0));

  };
  const queueScroll = () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  };
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll);
  window.addEventListener('pageshow', queueScroll);
  updateScroll();

  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.reveal = 'visible';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    reveals.forEach(element => { element.dataset.reveal = 'waiting'; observer.observe(element); });
    root.classList.add('reveal-ready');
  }
})();
