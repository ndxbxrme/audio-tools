window.Track = (opts) ->
  pointer: 0
  wrap: true
  steps: opts.steps or 4
  lastTime: -1
  tempo: opts.tempo
  notes: []
  addNote: (note) ->
    pointerNote = @notes[@pointer]
    if pointerNote and pointerNote.time > note.time
      @pointer++
    note.track = @
    @notes.push note
    @notes.sort (a, b) ->
      if a.time < b.time then -1 else 1
    note
  removeNote: (note) ->
    pointerNote = @notes[@pointer]
    if pointerNote and pointerNote.time < note.time
      @pointer--
    @notes.splice @notes.indexOf(note), 1
window.Sequencer = (audio) ->
  tempo = 120
  steps = 4
  lookahead = 0.1
  lastTime = -1
  playing = true
  tracks = []
  playNote = (time, note) ->
    console.log 'Please supply a playNote function'
  nextNote = (track, time) ->
    if note = track.notes[track.pointer]
      if note.time < time
        track.pointer++
        return note
    null
  schedule = ->
    for track in tracks
      deg = (track.tempo or tempo) / 60
      timeNow = (audio.currentTime * deg) % (track.steps or steps)
      time = ((audio.currentTime + lookahead) * deg) % (track.steps or steps)
      track.pointer = 0 if time < track.lastTime and track.wrap
      while note = nextNote track, time, track.lastTime
        diff = note.time - time
        playNote audio.currentTime + lookahead + diff / deg, note
      track.lastTime = time
    window.requestAnimationFrame schedule if playing
  setTempo: (newTempo) ->
    tempo = newTempo
    for track in tracks
      track.tempo = newTempo
  setSteps: (newSteps) ->
    steps = newSteps
    for track in tracks
      track.steps = newSteps
  setWrap: (newWrap) ->
    for track in tracks
      track.wrap = newWrap
  setPlayFn: (fn) ->
    playNote = fn
  getTracks: ->
    tracks
  addTrack: ->
    newTrack = Track
      tempo: tempo
      steps: steps
    tracks.push newTrack
    newTrack
  start: (restart) ->
    if restart
      audio.currentTime = 0
      for track in tracks
        track.pointer = 0
        track.lastTime = -1
    playing = true
    schedule()
  stop: ->
    playing = false
window.waveTableIndex = [
  '01_Saw',
  '10_Dropped_Square',
  'Brit_Blues',
  'Dyna_EP_Bright',
  'Organ_3',
  'Throaty',
  '02_Triangle',
  '11_TB303_Square',
  'Brit_Blues_Driven',
  'Dyna_EP_Med',
  'Phoneme_ah',
  'Trombone',
  '03_Square',
  'Bass',
  'Buzzy_1',
  'Ethnic_33',
  'Phoneme_bah',
  'Twelve String Guitar 1',
  '04_Noise',
  'Bass_Amp360',
  'Buzzy_2',
  'Full_1',
  'Phoneme_ee',
  'Twelve_OpTines',
  '05_Pulse',
  'Bass_Fuzz',
  'Celeste',
  'Full_2',
  'Phoneme_o',
  'Wurlitzer',
  '06_Warm_Saw',
  'Bass_Fuzz_ 2',
  'Chorus_Strings',
  'Guitar_Fuzz',
  'Phoneme_ooh',
  'Wurlitzer_2',
  '07_Warm_Triangle',
  'Bass_Sub_Dub',
  'Dissonant Piano',
  'Harsh',
  'Phoneme_pop_ahhhs',
  '08_Warm_Square',
  'Bass_Sub_Dub_2',
  'Dissonant_1',
  'Mkl_Hard',
  'Piano',
  '09_Dropped_Saw',
  'Brass',
  'Dissonant_2',
  'Organ_2',
  'Putney_Wavering'
]