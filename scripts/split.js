
function split(seq) {
  const ns = core.sequences.clone(seq);

  let chunkSizes = [];
  const temposByTime =
      ns.tempos.sort((a, b) => a.time - b.time);
  let prev = temposByTime[0];    
  for (let i = 1; i < temposByTime.length; i++) {
    const cur = temposByTime[i];
    if (cur.time > ns.totalTime) {
      break;
    }
    chunkSizes.push(cur.time - prev.time);
    prev = cur;
  }
  if (ns.totalTime > prev.time) {
    chunkSizes.push(ns.totalTime - prev.time);
  }

  let notesBystartStep =
      ns.notes.sort((a, b) => a.startTime - b.startTime);

  const chunks = [];
  const splits = [];
  let startStep = 0;
  for (let c = 0; c < chunkSizes.length; c++) {
    let chunkSize = chunkSizes[c];
    const tempo = temposByTime[c];
    let newTempo = {time: tempo.time - startStep, qpm: tempo.qpm};
    let currentNotes = [];
    for (let i = 0; i < notesBystartStep.length; i++) {
      const note = notesBystartStep[i];

      const originalStartStep = note.startTime;
      const originalEndStep = note.endTime;

      // Rebase this note on the current chunk.
      note.startTime -= startStep;
      note.endTime -= startStep;

      if (note.startTime < 0) {
        continue;
      }
      // If this note fits in the chunk, add it to the current sequence.
      if (note.endTime <= chunkSize) {
        currentNotes.push(note);
      } else {
        // If this note spills over, truncate it and add it to this sequence.
        if (note.startTime < chunkSize) {
          const newNote = protobuf.NoteSequence.Note.create(note);
          newNote.endTime = chunkSize;
          currentNotes.push(newNote);
          splits.push(i);

          // Keep the rest of this note, and make sure that next loop still deals
          // with it, and reset it for the next loop.
          note.startTime = startStep + chunkSize;
          note.endTime = originalEndStep;
          notProcessed.push(note);
        } else {
          // We didn't truncate this note at all, so reset it for the next loop.
          note.startTime = originalStartStep;
          note.endTime = originalEndStep;
        }
      }
    }
    if (currentNotes.length !== 0) {
      const newSequence = core.sequences.clone(ns);
      newSequence.notes = currentNotes;
      newSequence.tempos = [newTempo];
      newSequence.totalQuantizedSteps = chunkSize;
      newSequence.totalTime = chunkSize;
      chunks.push(newSequence);
    }
    startStep += chunkSize;
  }
  return {chunks: chunks, splits: splits};
}
