(() => {
  const SOUND = {
    URL: 'assets/audio/deep-sea-ambience.mp3',
    FADE_IN_SECONDS: 5,
    FADE_OUT_SECONDS: 1.5,
    ARCHIVE_FADE_SECONDS: 6,
    READING_GAIN: 0.018,
    START_GAIN: 0.025,
    FULL_WATER_GAIN: 0.11,
    ARCHIVE_GAIN: 0.035,
    LOOP_CROSSFADE_SECONDS: 2.5,
    GAIN_SMOOTHING_SECONDS: 0.08
  };
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sound-control';
  button.setAttribute('aria-pressed', 'false');
  document.body.append(button);
  const speaker = '<path d="M3 9h4l5-4v14l-5-4H3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>';
  const icons = {
    off: speaker + '<path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    on: speaker + '<path d="M16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  };
  let enabled = false, failed = false, context = null, mixer = null;
  let players = [], primary = 0, crossing = null, startTime = null;
  let archiveAt = null, archiveFrom = SOUND.FULL_WATER_GAIN, muteAt = null;
  let ready = false, pending = false, generation = 0, lastPhase = 'reading', lastDesired = 0;
  function updateButton() {
    button.innerHTML = '<svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">' + icons[enabled ? 'on' : 'off'] + '</svg>';
    button.setAttribute('aria-pressed', String(enabled));
    const label = enabled ? 'Deniz sesini kapat' : failed ? 'Deniz sesini açmayı yeniden dene' : 'Deniz sesini aç';
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  function quietFailure() {
    failed = true; enabled = false; pending = false;
    if (mixer) mixer.gain.setValueAtTime(0, context.currentTime);
    players.forEach(p => p.audio.pause());
    updateButton();
  }
  function createAudio() {
    if (context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw Error('Web Audio unavailable');
    context = new AudioContext();
    mixer = context.createGain();
    mixer.gain.value = 0;
    mixer.connect(context.destination);
    players = [0, 1].map((_, i) => {
      const audio = new Audio(SOUND.URL);
      audio.preload = 'auto';
      audio.loop = false;
      audio.setAttribute('playsinline', '');
      const gain = context.createGain();
      gain.gain.value = i === 0 ? 1 : 0;
      context.createMediaElementSource(audio).connect(gain);
      gain.connect(mixer);
      audio.addEventListener('error', quietFailure);
      return {audio, gain};
    });
  }
  function localSource() { return Promise.resolve(SOUND.URL); }
  async function enable() {
    enabled = true; failed = false; ready = false; muteAt = null; updateButton();
    const token = ++generation;
    try {
      createAudio();
      mixer.gain.cancelScheduledValues(context.currentTime);
      mixer.gain.setValueAtTime(0, context.currentTime);
      // Resume and prime muted players directly inside the click/keyboard gesture.
      await Promise.all([context.resume(), ...players.map(p => p.audio.play())]);
      players.forEach(p => { p.audio.pause(); p.audio.currentTime = 0; });
      const src = await localSource();
      if (token !== generation || !enabled) return;
      for (const p of players) if (p.audio.getAttribute('src') !== src) p.audio.src = src;
      primary = 0; crossing = null; startTime = null; archiveAt = null; ready = true;
      players.forEach((p, i) => {p.gain.gain.cancelScheduledValues(context.currentTime);p.gain.gain.setValueAtTime(i === 0 ? 1 : 0, context.currentTime);});
    } catch { if (token === generation) quietFailure(); }
  }
  function disable() {
    enabled = false; generation++; pending = false; updateButton();
    if (!context) return;
    const t = context.currentTime;
    mixer.gain.cancelScheduledValues(t);
    mixer.gain.setTargetAtTime(0, t, SOUND.FADE_OUT_SECONDS / 4);
    muteAt = t + SOUND.FADE_OUT_SECONDS;
  }
  button.addEventListener('click', () => enabled ? disable() : enable());
  function start() {
    if (pending || !context || document.hidden || players[primary].audio.paused === false) return;
    pending = true;
    const token = generation;
    players[primary].audio.play().then(() => {
      pending = false;
      if (!enabled || token !== generation || document.hidden) {players.forEach(p => p.audio.pause());return;}
      startTime = context.currentTime;
    }).catch(() => {pending = false;if (token === generation) quietFailure();});
  }
  function loop() {
    const now = context.currentTime;
    if (crossing && now >= crossing.end) {
      players[crossing.old].audio.pause();
      players[crossing.old].audio.currentTime = 0;
      crossing = null;
    }
    if (crossing) return;
    const current = players[primary], length = current.audio.duration;
    const fade = Math.min(SOUND.LOOP_CROSSFADE_SECONDS, length / 3);
    if (!Number.isFinite(length) || current.audio.paused || length - current.audio.currentTime > fade) return;
    const old = primary, next = 1 - old;
    const duration = Math.max(0.1, Math.min(fade, length - current.audio.currentTime));
    crossing = {old, end:now + duration};
    players[next].audio.currentTime = 0;
    players[next].gain.gain.cancelScheduledValues(now);
    players[next].gain.gain.setValueAtTime(0, now);
    players[next].audio.play().then(() => {
      if (!enabled || document.hidden) {players[next].audio.pause();return;}
      const t = context.currentTime;
      crossing.end = t + duration;
      current.gain.gain.cancelScheduledValues(t);
      current.gain.gain.setValueAtTime(1, t);
      current.gain.gain.linearRampToValueAtTime(0, t + duration);
      players[next].gain.gain.linearRampToValueAtTime(1, t + duration);
      primary = next;
    }).catch(quietFailure);
  }
  document.addEventListener('visibilitychange', () => {
    if (!context) return;
    if (document.hidden) {
      mixer.gain.cancelScheduledValues(context.currentTime);
      mixer.gain.setValueAtTime(0, context.currentTime);
      players.forEach(p => p.audio.pause());
      context.suspend().catch(() => {});
      startTime = null;
    } else if (enabled) {
      context.resume().catch(quietFailure);
      crossing = null;
      players.forEach((p, i) => {p.gain.gain.cancelScheduledValues(context.currentTime);p.gain.gain.setValueAtTime(i === primary ? 1 : 0, context.currentTime);});
    }
  });
  function tick() {
    const state = window.sceneState && window.sceneState();
    if (state && context) {
      const now = context.currentTime;
      if (!enabled) {
        if (muteAt !== null && now >= muteAt) {players.forEach(p => p.audio.pause());mixer.gain.setValueAtTime(0, now);muteAt = null;}
      } else if (!document.hidden && !failed && ready) {
        {
          start();
          let desired = state.phase === 'reading' ? SOUND.READING_GAIN : SOUND.START_GAIN + (SOUND.FULL_WATER_GAIN - SOUND.START_GAIN) * state.level;
          if (state.phase === 'archive' || state.phase === 'ready') {
            if (archiveAt === null) {archiveAt = now;archiveFrom = lastDesired || desired;}
            const p = Math.min(1, (now - archiveAt) / SOUND.ARCHIVE_FADE_SECONDS);
            desired = archiveFrom + (SOUND.ARCHIVE_GAIN - archiveFrom) * p;
          }
          if (startTime === null) desired = 0;
          else desired *= Math.min(1, (now - startTime) / SOUND.FADE_IN_SECONDS);
          mixer.gain.setTargetAtTime(desired, now, SOUND.GAIN_SMOOTHING_SECONDS);
          lastDesired = desired;
          loop();
        }
      }
      lastPhase = state.phase;
    }
    requestAnimationFrame(tick);
  }
  updateButton();requestAnimationFrame(tick);
  // Diagnostics only; the UI has no volume numbers or status labels.
  window.soundState = () => ({enabled,ready,failed,phase:lastPhase,gain:mixer ? mixer.gain.value : 0,playing:players.some(p=>!p.audio.paused),primary,crossfading:!!crossing,duration:players[primary] ? players[primary].audio.duration : 0});
})();
