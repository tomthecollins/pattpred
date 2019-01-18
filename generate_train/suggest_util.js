// Tom Collins 1/26/18.
// The functions below are adapted (very little) from the master branch of
// maia-jamrooms. The main change is that rather than forcing a staffNo on to
// generated notes in getNotesFromStates, we use the origPoints instead (line
// 84). Any other changes are just to the comment structure I think.

var mu = require('maia-util');

function mod(a, n) {
  // Tom Collins 6/4/2016.
  // Defining a modulo function because by default the modulus of a negative
  // number in javascript is negative.
  return a - (n * Math.floor(a / n));
}

module.exports = {
  getNotesFromStates: function (states = [], notes = [], timeSignatures, staffNo) {
    //states.map(function(state) {console.log(state.origPoints)});
    // console.log('notes:', notes);
    var suggested_points = getPointsFromStatesUnpitched(states, timeSignatures[0])
    // console.log("suggested_points" ,suggested_points);
    // console.log('notes[nos_notes - 1]:');
    // console.log(notes[nos_notes - 1]);
    if (notes.length > 0) {
      var barBeatOnLastNote = mu.bar_and_beat_number_of_ontime(
        notes[notes.length - 1].ontime,
        timeSignatures
      );
      var bar_of_curr_note = barBeatOnLastNote[0];
      // var bar_of_curr_note = notes[notes.length - 1].barOn;
      // console.log('bar_of_curr_note:');
      // console.log(bar_of_curr_note);
      var beat_of_curr_note = barBeatOnLastNote[1];
      // var beat_of_curr_note = notes[notes.length - 1].beatOn;
      // console.log('beat_of_curr_note:');
      // console.log(beat_of_curr_note);
    }
    else {
      var bar_of_curr_note = 1;
      var beat_of_curr_note = 1;
    }
    // console.log('beat_of_curr_note:', beat_of_curr_note);

    var beat_of_first_state = +states[0].beatMNNState.split("|")[0];
    // console.log('beat_of_first_state:', beat_of_first_state);

    if (beat_of_first_state > beat_of_curr_note) {
      var bar_of_first_state = bar_of_curr_note;
    }
    else {
      var bar_of_first_state = bar_of_curr_note + 1;
    }

    var ontime_shift =
      mu.ontime_of_bar_and_beat_number(
        bar_of_first_state, beat_of_first_state,
        timeSignatures);


    // Convert the suggested points to notes.
    var suggested_notes = suggested_points.map(point => {
      note = {};
      // note.subID = subID;
      // Pitch.
      note.pitch = mu.MNN2pitch_simple(point[1], point[2]);
      note.MNN = point[1];
      note.MPN = point[2];
      // Ontime.
      var curr_ontime = point[0] + ontime_shift;
      curr_bar_beat_on
        = mu.bar_and_beat_number_of_ontime(curr_ontime, timeSignatures);
      note.barOn = curr_bar_beat_on[0];
      note.beatOn = curr_bar_beat_on[1];
      note.ontime = curr_ontime;
      note.duration = point[3]
      // Offtime.
      var curr_offtime = point[0] + point[3] + ontime_shift;
      curr_bar_beat_off
        = mu.bar_and_beat_number_of_ontime(curr_offtime, timeSignatures);
      note.barOff = curr_bar_beat_off[0];
      note.beatOff = curr_bar_beat_off[1];
      note.offtime = curr_offtime;
      // Staff and voice.
      note.staffNo = point[4];
      note.voiceNo = 0;

      return note;
    })
    // Go back through suggested_notes and remove any duplicates of ontime-MNN
    // pairs, keeping whichever note has the longest duration.
    .sort(mu.sort_points_asc)

    // console.log(suggested_notes)

    return suggested_notes
  },
  generateStateString: function (notes = [], timeSignatures = []) {
    // Tom Collins 6/4/2016.
    // This function takes a comp_obj variable representing a user's
    // composition and converts the final segment in this composition to a state
    // consisting of beat of the bar and MIDI note numbers
    // [beat, [rel_MNN_1,...,rel_MNN_n]]
    // that can be used to look up a table of beat-MNN states and find plausible
    // continuations from other works.

    var MNN_index = 1;
    var out_array = [];
    var noteArray = notes.map(note => {
      return [
        note.ontime,
        note.MNN,
        note.MPN,
        note.duration,
        note.staffNo
      ]
    })

    var segE = mu.segment(noteArray);

    // console.log('segments:');
    // console.log(segE);

    // Convert the ontime of the last segment to a beat number and extract the
    // MIDI note numbers.
    var i = segE.length - 1;
    var bar_beat =
      mu.bar_and_beat_number_of_ontime(segE[i].ontime, timeSignatures);
    // This is beat of the bar in crotchet beats rounded to 5 decimal places.
    var beat_round = Math.round(bar_beat[1] * 100000) / 100000;
    var MNN = [];
    for (j = 0; j < segE[i].points.length; j++) {
      MNN[j] = segE[i].points[j][MNN_index];
    }
    // Sort the MNN entries and retain only the unique members.
    var MNN_unq = mu.get_unique(MNN.sort(function (a, b) {
      return a - b;
    }));
    
    return beat_round + '|' + MNN_unq;
  }
}

function getPointsFromStatesUnpitched(states, currentTimeSignature) {

  var crotchet_beats_in_bar = 4 * currentTimeSignature.topNo / currentTimeSignature.bottomNo;

  // Tom Collins 6/4/2016.
  // This function converts beat-relative-MNN states into points consisting of
  // ontimes, MNNs, MPNs, durations, and staff numbers.

  // Unpack states into MNNs and MPNs.
  for (stati = 0; stati < states.length; stati++) {
    var MNNs = [];
    var MPNs = [];
    //Simran: Not sure why looping around the origPoints because each origpoint object has
    //only one MNN or MPN values
    // console.log("states into state_durations_by_beat", states);
    for (pti = 0; pti < states[stati].origPoints.length; pti++) {
      //   MNNs.push(states[stati].context.orig_points[pti][1]);
      MNNs.push(states[stati].origPoints[pti].MNN);
      MPNs.push(states[stati].origPoints[pti].MPN);
      //   MPNs.push(states[stati].context.orig_points[pti][2]);
    }

    states[stati].MNNs = MNNs;
    states[stati].MPNs = MPNs;
  }

  //states.map(function(state) {console.log(state.origPoints)});
  var state_durs = state_durations_by_beat(states, crotchet_beats_in_bar);
  //states.map(function(state) {console.log("origPoints", state.origPoints)});
  // console.log("states",states);
  // console.log("state_durs" , state_durs);
  
  var unique_times = [0];
  for (stati = 0; stati < states.length; stati++) {
    unique_times.push(unique_times[stati] + state_durs[stati]);
  }
  // console.log('unique_times:', unique_times);

  var points = [];
  for (stati = 0; stati < states.length; stati++) {
    for (notei = 0; notei < states[stati].MNNs.length; notei++) {
      curr_point =
        state_note_abs2point_by_lookup(notei, stati, states, state_durs,
          unique_times);
      if (curr_point != undefined) {
        points.push(curr_point);
      }
    }
  }
  return points;

}

// Tom Collins 22/3/2015.
// This function takes an array of states as its argument, and returns an
// array containing the duration of each state.

function state_durations_by_beat(states, crotchet_beats_in_bar) {

  // console.log('suggested_states:');
  // console.log(states);
  var context_durations = [];
  for (stati = 0; stati < states.length; stati++) {
    var durs = [];
    for (pti = 0; pti < states[stati].origPoints.length; pti++) {
      durs.push(states[stati].origPoints[pti].duration);
    }
    context_durations.push(durs);
  }
  // console.log('context_durations:');
  // console.log(context_durations);
  var min_durations = [];
  for (stati = 0; stati < states.length; stati++) {
    if (context_durations[stati].length > 0) {
      var curr_min = mu.min_argmin(context_durations[stati]);
      min_durations.push(curr_min[0]);
    }
    else {
      min_durations.push(0);
    }
  }
  // console.log('min_durations:');
  // console.log(min_durations);
  // console.log('states.length:', states.length);
  var inter_state_durations = [];
  for (stati = 0; stati < states.length - 1; stati++) {
    // console.log('stati:', stati);
    // console.log("states[stati + 1].beatMNNState", states[stati + 1].beatMNNState)
    if (states[stati + 1].beatMNNState.split("|")[0] ==
      states[stati].beatMNNState.split("|")[0]) {
      inter_state_durations.push(crotchet_beats_in_bar);
    }
    else {
      var curr_isd = states[stati + 1].beatMNNState.split("|")[0] -
        states[stati].beatMNNState.split("|")[0];
      inter_state_durations.push(mod(curr_isd, crotchet_beats_in_bar));
    }
  }
  // console.log('inter_state_durations:');
  // console.log(inter_state_durations);
  var mod_state_durations = [];
  for (stati = 0; stati < states.length - 1; stati++) {
    // I'm not quite sure about the sense of this next test.
    if (min_durations[stati] > crotchet_beats_in_bar) {
      mod_state_durations.push(min_durations[stati]);
    }
    else {
      mod_state_durations.push(inter_state_durations[stati]);
    }
  }
  mod_state_durations.push(min_durations[states.length - 1]);
  // console.log('mod_state_durations:', mod_state_durations);
  return mod_state_durations;
}

function state_note_abs2point_by_lookup(notei, statj, half_states, state_durs,
                                        unique_times) {
  // Tom Collins 6/4/2016.
  // The ith note of the jth half-state is transformed into a so-called point,
  // meaning we find its ontime (the jth element of the unique times), its MIDI
  // note number, morphetic pitch number, duration, and staff number.

  var curr_state = half_states[statj];
  var ontime = unique_times[statj];
  var MNN = curr_state.MNNs[notei];
  var MPN = curr_state.MPNs[notei];
  // Determine if this pitch occurred in the previous segment too.
  if (statj > 0 && MNN != undefined) {
    var idx_in_prev_segment = half_states[statj - 1].MNNs.indexOf(MNN);
  }
  // Determine if this pitch should be held over into the current state.
  if (idx_in_prev_segment != undefined && idx_in_prev_segment >= 0) {
    if (index_of_offtime_by_lookup(
        statj - 1, MNN, half_states, state_durs) >= statj) {
      var held_over = true;
    }
  }
  // Determine by which state this pitch has ended.
  if (MNN != undefined) {
    var offtime_state
      = index_of_offtime_by_lookup(statj, MNN, half_states, state_durs);
  }
  // Assign a voice number.
  if (MNN != undefined) {
    //var voice = curr_state.context.orig_points[notei][4];
    //Simran: Not sure, if this is what it was doing
    var voice = curr_state.origPoints[notei].staffNo;
  }
  // Define and return the point.
  if (MNN != undefined && held_over == undefined) {
    var point = [ontime, MNN, MPN,
      unique_times[offtime_state + 1] - unique_times[statj], voice];
    // console.log('Point for state ' + statj + ', note ' + notei + ':');
    // console.log('offtime_state:');
    // console.log(offtime_state);
    // console.log('point:');
    // console.log(point);
    return point;
  }
  else {
    return undefined;
  }
}

function index_of_offtime_by_lookup(statj, MNN, half_states, state_durs) {
  // Tom Collins 22/3/2015.
  // Given a starting index, a MIDI note number, and some half-states to search
  // through, this function returns the index of the half-state where the MIDI
  // note number in question comes to an end.

  for (j = statj; j < half_states.length; j++) {
    var note_idx = half_states[j].MNNs.indexOf(MNN);
    var context_durs = [];
    for (pti = 0; pti < half_states[j].origPoints.length; pti++) {
      context_durs.push(half_states[j].origPoints[pti][3]);
    }
    if (j < half_states.length - 1) {
      var find_MNN_in_next_segment = half_states[j + 1].MNNs.indexOf(MNN);
    }

    if (//j >= half_states.length ||
    find_MNN_in_next_segment == undefined ||
    find_MNN_in_next_segment == -1 ||
    context_durs[note_idx] <= state_durs[j]) {
      var ans = j;
      break;
    }
  }
  if (ans == undefined) {
    return half_states.length - 1;
  }
  else {
    return ans;
  }
}
