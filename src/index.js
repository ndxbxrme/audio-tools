// Generated by CoffeeScript 2.5.1
(function() {
  var MAX_OFFSET, makeFreqs;

  MAX_OFFSET = 7 * 12;

  window.noteNames = ['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#'];

  window.notesByName = {};

  window.notesByMIDINo = [];

  makeFreqs = function() {
    var a, freq, nnOffset, noteName, octave, offset, results;
    offset = -4 * 12;
    a = Math.pow(2, 1 / 12);
    results = [];
    while (offset < MAX_OFFSET) {
      nnOffset = offset;
      while (nnOffset < 0) {
        nnOffset += 12;
      }
      noteName = noteNames[nnOffset % 12];
      octave = Math.floor((offset - 3) / 12) + 4;
      if (octave > -1) {
        freq = 440 * 10000000000 * Math.pow(a, offset);
        freq = +(Math.round(freq) * 0.0000000001).toFixed(10);
        notesByName[noteName + octave] = freq;
        notesByMIDINo.push({
          name: noteName,
          freq: freq
        });
      }
      results.push(offset++);
    }
    return results;
  };

  makeFreqs();

  window.Track = function(opts) {
    return {
      pointer: 0,
      wrap: true,
      steps: opts.steps || 4,
      lastTime: -1,
      tempo: opts.tempo,
      notes: [],
      addNote: function(note) {
        var pointerNote;
        pointerNote = this.notes[this.pointer];
        if (pointerNote && pointerNote.time > note.time) {
          this.pointer++;
        }
        note.track = this;
        this.notes.push(note);
        this.notes.sort(function(a, b) {
          if (a.time < b.time) {
            return -1;
          } else {
            return 1;
          }
        });
        return note;
      },
      removeNote: function(note) {
        var pointerNote;
        pointerNote = this.notes[this.pointer];
        if (pointerNote && pointerNote.time < note.time) {
          this.pointer--;
        }
        return this.notes.splice(this.notes.indexOf(note), 1);
      }
    };
  };

  window.Sequencer = function(audio) {
    var lastTime, lookahead, nextNote, playNote, playing, schedule, steps, tempo, tracks;
    tempo = 120;
    steps = 4;
    lookahead = 0.1;
    lastTime = -1;
    playing = true;
    tracks = [];
    playNote = function(time, note) {
      return console.log('Please supply a playNote function');
    };
    nextNote = function(track, time) {
      var note;
      if (note = track.notes[track.pointer]) {
        if (note.time < time) {
          track.pointer++;
          return note;
        }
      }
      return null;
    };
    schedule = function() {
      var deg, diff, i, len, note, time, timeNow, track;
      for (i = 0, len = tracks.length; i < len; i++) {
        track = tracks[i];
        deg = (track.tempo || tempo) / 60;
        timeNow = (audio.currentTime * deg) % (track.steps || steps);
        time = ((audio.currentTime + lookahead) * deg) % (track.steps || steps);
        if (time < track.lastTime && track.wrap) {
          track.pointer = 0;
        }
        while (note = nextNote(track, time, track.lastTime)) {
          diff = note.time - time;
          playNote(audio.currentTime + lookahead + diff / deg, note);
        }
        track.lastTime = time;
      }
      if (playing) {
        return window.requestAnimationFrame(schedule);
      }
    };
    return {
      setTempo: function(newTempo) {
        var i, len, results, track;
        tempo = newTempo;
        results = [];
        for (i = 0, len = tracks.length; i < len; i++) {
          track = tracks[i];
          results.push(track.tempo = newTempo);
        }
        return results;
      },
      setSteps: function(newSteps) {
        var i, len, results, track;
        steps = newSteps;
        results = [];
        for (i = 0, len = tracks.length; i < len; i++) {
          track = tracks[i];
          results.push(track.steps = newSteps);
        }
        return results;
      },
      setWrap: function(newWrap) {
        var i, len, results, track;
        results = [];
        for (i = 0, len = tracks.length; i < len; i++) {
          track = tracks[i];
          results.push(track.wrap = newWrap);
        }
        return results;
      },
      setPlayFn: function(fn) {
        return playNote = fn;
      },
      getTracks: function() {
        return tracks;
      },
      addTrack: function() {
        var newTrack;
        newTrack = Track({
          tempo: tempo,
          steps: steps
        });
        tracks.push(newTrack);
        return newTrack;
      },
      start: function(restart) {
        var i, len, track;
        if (restart) {
          audio.currentTime = 0;
          for (i = 0, len = tracks.length; i < len; i++) {
            track = tracks[i];
            track.pointer = 0;
            track.lastTime = -1;
          }
        }
        playing = true;
        return schedule();
      },
      stop: function() {
        return playing = false;
      }
    };
  };

  window.LFO = function(opts) {
    var osc, oscGain;
    osc = audio.createOscillator();
    osc.frequency.value = opts.frequency || 1;
    oscGain = opts.audio.createGain();
    oscGain.gain.value = opts.value || 10;
    osc.connect(oscGain);
    return {
      connect: function(thing) {
        return oscGain.connect(thing);
      },
      osc: osc,
      gain: oscGain,
      start: function() {
        return osc.start();
      },
      stop: function() {
        return osc.stop();
      }
    };
  };

  window.waveTableIndex = ['01_Saw', '10_Dropped_Square', 'Brit_Blues', 'Dyna_EP_Bright', 'Organ_3', 'Throaty', '02_Triangle', '11_TB303_Square', 'Brit_Blues_Driven', 'Dyna_EP_Med', 'Phoneme_ah', 'Trombone', '03_Square', 'Bass', 'Buzzy_1', 'Ethnic_33', 'Phoneme_bah', 'Twelve String Guitar 1', '04_Noise', 'Bass_Amp360', 'Buzzy_2', 'Full_1', 'Phoneme_ee', 'Twelve_OpTines', '05_Pulse', 'Bass_Fuzz', 'Celeste', 'Full_2', 'Phoneme_o', 'Wurlitzer', '06_Warm_Saw', 'Bass_Fuzz_ 2', 'Chorus_Strings', 'Guitar_Fuzz', 'Phoneme_ooh', 'Wurlitzer_2', '07_Warm_Triangle', 'Bass_Sub_Dub', 'Dissonant Piano', 'Harsh', 'Phoneme_pop_ahhhs', '08_Warm_Square', 'Bass_Sub_Dub_2', 'Dissonant_1', 'Mkl_Hard', 'Piano', '09_Dropped_Saw', 'Brass', 'Dissonant_2', 'Organ_2', 'Putney_Wavering'];

}).call(this);
