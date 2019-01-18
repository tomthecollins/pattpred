// Individual user paths.
var mInPaths = {
  "tom": __dirname + '/../../../../Shizz/Lehigh/Projects/MIREX/2018/20180918' +
  '/PPDD-Sep2018/symbolic/polyphonic/small/',
  "berit": __dirname + '/path/to/folder/of/midi/files/',
  "iris": __dirname + '/path/to/folder/of/midi/files/'
};
//var cOutPaths = {
//  "tom": __dirname + '/../../../../Shizz/Lehigh/Projects/MIREX/2018/20180718/lmd_mini/prime_csv/',
//  "berit": __dirname + '/path/to/folder/where/csv/files/are/written/',
//  "iris": __dirname + '/path/to/folder/where/csv/files/are/written/'
//};

// Requires.
var fs = require('fs')
var mu = require('maia-util')
var mc = require('midiconvert')
var uu = require('uuid/v4')
var sr = require('seed-random')
var fs = require('fs')
var csv_stringifier = require('csv-stringify')

var su = require('./suggest_util.js')
var ia = require('./basic_instrument_assignment')
// require('./util_server')

// var CompositionModel = require('../server_api/data_api/rdb_model/composition_model');
// var InstrumentModel = require('../server_api/data_api/rdb_model/instrument_model');

var params = {
  primeLength: 35, // Used to be 45;
  contLength: 2.5, // Measures (= 10 ontimes), as it's multiplied by 4 below.
  minNotesInPrime: 20, // Used to be 30.
  maxIOIinPrime: 8,
  minNotesInCont: 10, // Used to be 15.
  nFile: 100
};
var endAnnouncementMade = false;
// var contLengths = ['s', 1, 5];
var modes = ['true continuation', 'foil continuation'];
// Seed random number generation.
sr('harrykane', {global: true}); // Overrides global Math.random.
// var numA = Math.random();
// console.log(numA);
// sr.resetGlobal();// Reset to default Math.random.

// InstrumentModel.run().then(function (all) {
  // var instrs = all
  var mInPath = mInPaths.tom; // Default path (can be changed by -u flag in script call).
  // var cOutPath = cOutPaths.tom;

  var mode = 0
  var nextM = false
  var nextL = false
  var barTrunc = false
  var nextI = false
  var instTrunc
  var nextU = false
  var fileLoc
  var nextS = false
  
  var trackSounds = "[]"
  process.argv.forEach(function (arg, ind) {
    if (arg === '-m') { // Encodes true continuation or foil continuation.
      nextM = true
    }
    else if (arg === '-l') { // Continuation length.
      nextL = true
    }
    else if (arg === '-b') { // Truncation.
      barTrunc = true
    }
    else if (arg === '-i') { // Specified tracks to import.
      nextI = true
    }
    else if (arg === '-u') { // User.
      nextU = true
    }
    else if (arg === '-s') { // Specified instruments.
      nextS = true
    }
    
    else if (nextM) {
      mode = parseInt(arg) // 0 for foil; 1 for true continuation.
      nextM = false
    }
    else if (nextL){
      // Remains 's' for 1 segment, or changes to integer number of beats.
      params.contLength = parseInt(arg)
      nextL = false
    }
    else if (nextI) {
      instTrunc = arg
      nextI = false
    }
    else if (nextU) {
      mInPath = mInPaths[arg]
      // cOutPath = cOutPaths[arg]
      // console.log('mInPath:', mInPath);
      nextU = false
    }
    else if (nextS) {
      trackSounds = arg
      nextS = false
    }
  })

  if (instTrunc) {
    instTrunc = JSON.parse(instTrunc)
  }

  if (trackSounds) {
    trackSounds = JSON.parse(trackSounds)
  }

  var timeSigs = [{'barNo': 1, 'topNo': 4, 'bottomNo': 4, 'ontime': 0}]

  var mFiles = fs.readdirSync(mInPath + 'orig_midi/')
  mFiles = mFiles.filter(function (file) {
    //var fileSplit = 
    return file.split('.')[1] == "mid"
    //return file !== "README.md"
  })
  var countFiles = 0;
  // mFiles = mFiles.slice(0, 20);
  mFiles.forEach(function (mFile, iFile) {
    if (countFiles >= params.nFile){
      if (!endAnnouncementMade){
        console.log('We have enough files.');
        endAnnouncementMade = true;
      }
      return;
    }
    var comp = {}
    try {
      console.log('!!! FILE ' + (iFile + 1) + ' OF ' + mFiles.length + ' !!!')
      comp['id'] = uu();
      console.log('id:', comp.id)
      var midiBlob = fs.readFileSync(mInPath + 'orig_midi/' + mFile, "binary")
      var midi = mc.parse(midiBlob)
      midi.header.bpm = Math.round(midi.header.bpm * 10) / 10
      console.log('midi.header:', midi.header);
      // comp['id'] = uu()
      // comp['id'] = 'hello';
      // Strip off file extension.
      mFile = mFile.split('.')[0];
      comp['idLakh'] = mFile
      comp['name'] = mFile.slice(0, 5);
      // comp['name'] = midi.header.name || mFile.split('.')[0] // "_new"
      comp['composers'] = [{'id': "default_composer", 'name': "none", 'displayName': "None"}]
      var notes = [];
      var maxInd;
      var numTracks = 0;
      comp['layer'] = midi.tracks.filter(function(track, ind){
        // Generally, it's possible to restrict import to certain tracks only
        // (via the i flag). If this is supplied by the user and the current
        // track is not one of those specified, then the return is false. This
        // filter also checks that notes are defined for the track and that it
        // isn't an empty array. If the notes array is not defined or it is
        // empty, then false is returned also.
        maxInd = ind
        if (
            !(instTrunc && instTrunc.indexOf(ind) === -1) &&
            (track.notes && track.notes.length > 0) &&
            (!track.isPercussion)
           ){
          numTracks++;
          return true;
        }
        else {
          return false;
        }
      })
      console.log('numTracks:', numTracks);
      if (numTracks === 0){
        console.log('No tracks found in this MIDI file.');
        return;
      }
      
      // Given midi.duration is the length of the MIDI file in seconds, we want
      // 35-sec primes and 10-ontime continuations, pStarts is the upper limit
      // on where a possible excerpt may start.
      var pStarts = midi.duration - params.primeLength - 4*params.contLength*60/midi.header.bpm
      var startTime = Math.random() * pStarts // Selects start time at random.
      var endTime = startTime + params.primeLength
      // Not sure what maxTime and minTime are doing just yet.
      var maxTime = Number.MIN_SAFE_INTEGER
      var minTime = Number.MAX_SAFE_INTEGER
      // console.log('midi.duration:', midi.duration);
      // console.log('startTime:', startTime);
      // console.log('endTime:', endTime);
      
      
      comp['layer'] = comp['layer'].map(function(track, layerNum){
        // console.log('track.instrumentNumber:', track.instrumentNumber);
        var layer = {}
        layer['type'] = "instrument"
        // First, we go through the [idx, instrument_name] pairs, called ts
        // below, which may have been provided via the -s flag. If one of those
        // matches the current layerNum (ts[0]), then the idInstrument info is
        // the string constituting the second element, ts[1].
        var trackSound = trackSounds.find(function(ts){
          return ts[0] === layerNum
        })
        if (trackSound) {
          layer['idInstrument'] = trackSound[1]
        }
        // If the -s flag isn't used however, then we take the
        // instrumentNumber, which according to the MIDI spec is an integer
        // between 1 and 128, and we look through all the instruments in our
        // DB, which may have a generalMidiApi.PC property defined. If they do
        // and it matches instrumentNumber, then this will be an appropriate
        // instrument to use for this track.
        else {
          layer['idInstrument'] = ia.assign_instrument_basic(track.instrumentNumber)
          // console.log('layer.idInstrument:', layer.idInstrument);
          //var instrumentNumber = track.instrumentNumber
          //if (!instrumentNumber || instrumentNumber < 1 || instrumentNumber > 128) {
          //  instrumentNumber = 1
          //}
          //// console.log('instrumentNumber:', instrumentNumber);
          //var searchOnAllInstrs = instrs.find(function (instrument) {
          //  return instrument.generalMidiApi && instrument.generalMidiApi.PC === instrumentNumber
          //});
          //if (searchOnAllInstrs !== undefined){
          //  layer['idInstrument'] = searchOnAllInstrs.id;
          //}
          //else {
          //  // If all else fails, assign acoustic grand piano.
          //  layer['idInstrument'] = "acoustic_grand_piano";
          //}
        }
        layer['staffNo'] = layerNum
        layer['timestampLastUsed'] = ""
        layer['vexflow'] = { 'name': track.name || "", 'abbreviation': "", 'staffOrderNo': layerNum }
        if (track.notes) {
          // Get the track.notes and quantise them.
          var ps = track.notes.map(function(note){
            return [
              note.time*midi.header.bpm/60,
              note.midi,
              note.duration*midi.header.bpm/60
            ];
          }).filter(function(p){ // Gets rid of really low/high notes.
            return p[1] >= 21 && p[1] <= 108;
          });
          // console.log('unquantised ps.slice(0, 10):', ps.slice(0, 10))
          ps = mu.farey_quantise(
            ps,
            [0, 0.16667, 0.25, 0.33333, 0.5, 0.66667, 0.75, 0.83333, 1],
            [0, 2]
          );
          // console.log('quantised ps.slice(0, 10):', ps.slice(0, 10))
          notes = notes.concat(ps.map(function(p){
            // console.log('note:', note);
            var compNote = {}
            compNote['id'] = uu()
            compNote['ontime'] = p[0]
            // ********************************************************
            // ** THIS IS A DIFFERENCE BETWEEN MONO AND POLY SCRIPTS **
            // ********************************************************
            if (p[2] > 8){
              compNote['duration'] = 8;
              // console.log('Long duration corrected.')
            }
            else {
              compNote['duration'] = p[2]
            }
            // ***********************
            // ** END OF DIFFERENCE **
            // ***********************
            compNote['offtime'] = compNote.ontime + compNote.duration
            var barBeat = mu.bar_and_beat_number_of_ontime(compNote.ontime, timeSigs)
            compNote['barOn'] = barBeat[0]
            compNote['beatOn'] = barBeat[1]
            barBeat = mu.bar_and_beat_number_of_ontime(compNote.offtime, timeSigs)
            compNote['barOff'] = barBeat[0]
            compNote['beatOff'] = barBeat[1]
            // compNote['pitch'] = note.name
            compNote['MNN'] = p[1]
            // compNote['MPN'] = 0
            compNote['staffNo'] = layerNum
            compNote['voiceNo'] = 0
            compNote['isPerc'] = track.isPercussion || false
            return compNote
          }))
          // console.log('notes.slice(0, 10):', notes.slice(0, 10));
        }
        return layer
      })
      
      // This makes an independent copy of non-percussive notes, for the
      // purposes of key estimation. However, given the nature of this task, we
      // probably ought to filter out percussive notes further up above.
      var noPercArr = notes.filter(function(note){
        return !note.isPerc
      }).map(function (note) {
        return [note.ontime, note.MNN, note.duration]
      })
      var keySig
      if (noPercArr.length > 0) {
        keySig = mu.fifth_steps_mode(noPercArr, mu.krumhansl_and_kessler_key_profiles)
      }
      else {
        keySig = ["C major", 1, 0, 0]
      }
      comp['keySignatures'] = [{
        'barNo': 1,
        'keyName': keySig[0],
        'fifthsStep': keySig[2],
        'mode': keySig[3],
        'ontime': 0
      }]
      comp['timeSignatures'] = timeSigs
      // Guess note names.
      notes.forEach(function (note) {
        delete note.isPerc
        note['MPN'] = mu.guess_morphetic(note.MNN, keySig[2], keySig[3])
        note['pitch'] = mu.midi_note_morphetic_pair2pitch_and_octave(note.MNN, note.MPN)
      })
      comp['notes'] = notes.sort(mu.sort_points_asc);
      comp['sequencing'] = [{'ontime': 0, 'offtime': 16, 'repetitionNo': 1}]
      comp['tempi'] = [{'barNo': 1, 'ontime': 0, 'bpm': midi.header.bpm, 'tempo': ""}]
    }
    catch (e) {
      console.log(e)
    }
    
    // Restrict notes to time range of interest.
    if (midi === undefined || midi.header === undefined){
      console.log('Could not parse MIDI file using midiconvert.');
      return;
    }
    var prime1stOn = startTime*midi.header.bpm/60;
    var primeLstOn = endTime*midi.header.bpm/60;
    comp.prime = comp.notes.filter(function(note){
      return note.ontime >= prime1stOn && note.ontime <= primeLstOn;
    });
    if (comp.prime.length < params.minNotesInPrime){
      console.log('Insufficient material in prime.');
      return;
    }
    
    // ************************************************
    // ** THIS IS WHERE MONO AND POLY SCRIPTS DIFFER **
    // ************************************************
    // Get max IOI in the prime.
    var segs = mu.segment(mu.comp_obj2note_point_set({ notes: comp.prime }));
    var where_notes_begin = [prime1stOn];
    segs.map(function(s){
      if (s.ontime > prime1stOn && s.ontime < primeLstOn && s.points.length > 0){
        where_notes_begin.push(s.ontime);
      }
      return;
    });
    where_notes_begin.push(primeLstOn);
    var ioi = [];
    for (iioi = 1; iioi < where_notes_begin.length; iioi++){
      ioi[iioi - 1] = where_notes_begin[iioi] - where_notes_begin[iioi - 1];
    }
    var ma = mu.max_argmax(ioi);
    var max_ioi = ma[0];
    if (max_ioi > params.maxIOIinPrime){
      console.log('Max IOI was too large.');
      return;
    }
    // ***********************
    // ** END OF DIFFERENCE **
    // ***********************
    
    var minArgmin = mu.min_argmin(comp.prime.map(function(n){return n.ontime}));
    minTime = minArgmin[0];
    
    
    // This will be the space for continuations.
    var cont; // True continuation.
    var foil; // Foil continuation.
    var currMode = "foil continuation";
    var foil_succeeded = false;
    
    if (currMode === 'foil continuation'){
      console.log('foil cont.')
      
      // Foil continuation.
      // Some code to form a Markov model and continuations from that.
      // ************************************
      // ** DIFFERENCE FOR FAIRER BASELINE **
      // ************************************
      var stm = construct_stm([
        {
          timeSignatures: comp.timeSignatures,
          notes: comp.prime
        }
      ]);
      // console.log('stm[0].beat_MNN_state:', stm[0].beat_MNN_state);
      // console.log('stm[10].beat_MNN_state:', stm[10].beat_MNN_state);
      // console.log('stm[20].beat_MNN_state:', stm[20].beat_MNN_state);
      // console.log('stm[30].beat_MNN_state:', stm[30].beat_MNN_state);
      // Generate some content with it.
      var lk_state_str = su.generateStateString(comp.prime, comp.timeSignatures);
      // var lk_state_str = '1.5|48,60,67'; // Just an example.
      var lk_beat = parseFloat(lk_state_str.split('|')[0]);
      var lk_mnns = lk_state_str.split('|')[1].split(',').map(function(m){ return parseFloat(m) });
      // console.log('lk_beat:', lk_beat);
      // console.log('lk_mnns:', lk_mnns);
      var lk_state = [lk_beat, lk_mnns];
      // console.log('lk_state:', lk_state);
      // Use lk_state and subsequent continuations to query the stm 20 times.
      var state_ctx_pairs = [];
      var n_st = 200; // This is the number of continuations.
      for (i_st = 0; i_st < n_st; i_st++){
        var rel_idx = mu.array_object_index_of_array(stm, lk_state, "beat_MNN_state");
        // console.log('rel_idx:', rel_idx);
        if (rel_idx == -1){
          // Choose a state at random.
          rel_idx = mu.get_random_int(0, stm.length);
          // console.log('rand populated rel_idx:', rel_idx);
        }
        // Use it to grab continuations and pick one at random.
        var conts = stm[rel_idx].continuations;
        // console.log('conts:', conts);
        var curr_cont = mu.choose_one(conts);
        state_ctx_pairs.push(curr_cont);
        // Update lk_state.
        lk_state = curr_cont.beat_MNN_state;
        // console.log('new lk_state:', lk_state);
      }
      // Filters out rests.
      state_ctx_pairs = state_ctx_pairs.filter(function(sc){
        return sc.beat_MNN_state[1].length > 0;
      })
      // Converts [ beat, [MNNs]] format to 'beat|MNN1,MNN2,...,MNNn' format.
      .map(function(sc){
        var state_str = sc.beat_MNN_state[0].toString() + "|";
        for (imnn = 0; imnn < sc.beat_MNN_state[1].length; imnn++){
          state_str = state_str + sc.beat_MNN_state[1][imnn].toString() + ',';
        }
        if (imnn > 0){
          state_str = state_str.slice(0, state_str.length - 1);
        }
        return {
          beatMNNState: state_str,
          origPoints: sc.context.orig_points.map(function(p){
            return {
              ontime: p[0],
              MNN: p[1],
              MPN: p[2],
              duration: p[3],
              staffNo: p[4]
            }
          }),
          pieceId: sc.context.piece_id
        };
      })
      // console.log('state_ctx_pairs:', state_ctx_pairs);
      
      var suggested_notes = su.getNotesFromStates(state_ctx_pairs, comp.prime, comp.timeSignatures, 0);
      var segs = mu.segment(mu.comp_obj2note_point_set({ notes: suggested_notes }));
      // console.log('segs.slice(0, 1):', segs.slice(0, 1));
      
      // for (var icont = 0; icont < contLengths.length; icont++){
        // var contLength = contLengths[icont];
        
        // Trying to save multiple compositions at once. Doesn't work!
        
        if (params.contLength == 's'){
          //// We just want the first segment of the suggested notes.
          //// We need all notes with ontimes === segs[0].ontime.
          //cont = suggested_notes.filter(function(n){
          //  return Math.abs(n.ontime - segs[0].ontime) < 0.01;
          //});
          //// console.log('cont:', cont)
          //
          //console.log('Got to place_and_save!')
          //// comp.notes = comp.prime.concat(cont);
          //// place_and_save(comp, barTrunc, minTime, mFile, currMode, contLength);
          
        }
        
        else {
          // We need all notes with ontimes greater than or equal to
          // segs[0].ontime, and less than or equal to
          // segs[0].ontime + 4*contLength (assuming 4-4 time).
          foil = suggested_notes.filter(function(n){
            return n.ontime >= segs[0].ontime &&
            n.ontime <= segs[0].ontime + 4*params.contLength;
          });
          // console.log('foil:', foil)
          
          // console.log('Got to place_and_save!')
          if (foil.length >= params.minNotesInCont){
            // Save prime, continuation(s), etc.
            // write2csv(foil, mInPath, 'cont_foil_csv', mFile);
            foil_succeeded = true;
          }
          else {
            // Don't bother.
            console.log('Foil continuation does not contain enough notes.');
            return;
          }
          
        }
          
        // console.log('suggested_notes:', suggested_notes);
        // comp.notes = comp.prime.concat(suggested_notes);
        
      // }
      
    }
    
    currMode = "true continuation";
    if (currMode === "true continuation"){
      console.log('true cont.');
      // Need to find the segment immediately after the end of the prime.
      var segs = mu.segment(mu.comp_obj2note_point_set(comp));
      // console.log('segs.slice(0, 1):', segs.slice(0, 1));
      // console.log('Last note of prime:', comp.prime[comp.prime.length - 1])
      console.log('comp.prime.length:', comp.prime.length);
      var probe_ontime = comp.prime[comp.prime.length - 1].ontime;
      // Find it in among the segment beginnings.
      var rel_seg_idx = -1;
      var seg_idx = 0;
      while (seg_idx < segs.length){
        if (Math.abs(probe_ontime - segs[seg_idx].ontime) < 0.01){
          rel_seg_idx = seg_idx;
          seg_idx = segs.length - 1;
        }
        seg_idx++;
      }
      // console.log('rel_seg_idx:', rel_seg_idx);
      // console.log('segs[rel_seg_idx]:', segs[rel_seg_idx]);
      
      // for (var icont = 0; icont < contLengths.length; icont++){
        // var contLength = contLengths[icont];
        // Trying to save multiple compositions at once.
        if (params.contLength == 's'){
          //// We need all notes with ontimes greater than segs[rel_seg_idx].ontime,
          //// and less than or equal to segs[rel_seg_idx].offtime. But it might be
          //// followed by any number of segments where previously articulated
          //// notes are ending, so we need a while.
          //console.log('contLength:', contLength);
          //var incr = 0;
          //while (cont.length == 0){
          //  // console.log('incr:', incr);
          //  cont = comp.notes.filter(function(n){
          //    return n.ontime > segs[rel_seg_idx + incr].ontime &&
          //    Math.abs(n.ontime - segs[rel_seg_idx + incr].offtime) < 0.01;
          //  });
          //  incr++;
          //}
          //// console.log('cont:', cont)
          //
          //// Save prime and continuations to separate files.
          //
          ////comp.notes = comp.prime.concat(cont);
          ////place_and_save(comp, barTrunc, minTime, mFile, currMode, contLength);
          //
        }
        else {
          // We need all notes with ontimes greater than segs[rel_seg_idx].ontime,
          // and less than or equal to segs[rel_seg_idx].ontime + 4*contLength
          // (assuming 4-4 time).
          // console.log('Got to here!')
          console.log('params.contLength:', params.contLength);
          cont = comp.notes.filter(function(n){
            return n.ontime > segs[rel_seg_idx].ontime &&
            n.ontime <= segs[rel_seg_idx].ontime + 4*params.contLength;
          });
          // console.log('cont:', cont)
          
          if (cont.length >= params.minNotesInCont && foil_succeeded && countFiles < params.nFile){
            // Save prime, continuation(s), etc.
            var descr = {
              "id": comp.id,
              "idLakh": comp.idLakh,
              "bpm": midi.header.bpm,
              "timeSignature": midi.header.timeSignature,
              "keyEstimate": keySig[0]
            };
            fs.writeFileSync(mInPath + 'descriptor/' + comp.id + '.json',
                             JSON.stringify(descr, null, 2)
                            );
            // write_bpm(descr, mInPath, 'descriptor', comp.id);
            write2csv(comp.prime, mInPath, 'prime_csv', comp.id);
            write2csv(cont, mInPath, 'cont_true_csv', comp.id);
            write2csv(foil, mInPath, 'cont_foil_csv', comp.id);
            countFiles++;
          }
          else {
            // Don't bother.
            console.log('True continuation does not contain enough notes.');
            return;
          }
          // comp.notes = comp.prime.concat(cont);
          // place_and_save(comp, barTrunc, minTime, mFile, currMode, contLength);
          
        }
      // } 
    }
    
    
    
    
  })
// })


function write2csv(notes, path, folder, filename){
  var arr_out = notes.map(function(n){
    return [
      Math.round(n.ontime*100000)/100000,
      n.MNN,
      n.MPN,
      Math.round(n.duration*100000)/100000,
      n.staffNo
    ];
  });
  var str = "";
  arr_out.map(function(p){
    var p_str = "";
    p.map(function(v){
      p_str = p_str + v.toString() + ',';
      return;
    });
    p_str = p_str.slice(0, p_str.length - 1) + '\n';
    str = str.concat(p_str);
    return;
  });
  // console.log('str.slice(0, 100):', str.slice(0, 100));
  fs.writeFileSync(path + folder + '/' + filename + '.csv',
               str)
  
  // Worked but only at the end.
  //csv_stringifier(arr_out, { header: false }, (err, output) => {
  //  if (err) throw err;
  //  fs.writeFileSync(path + folder + '/' + filename + '.csv',
  //               output, (err) => {
  //    if (err) throw err;
  //    // console.log('CSV saved.');
  //  });
  //});
}

function write_bpm(bpm, path, folder, filename){
  csv_stringifier([bpm], { header: false }, (err, output) => {
    if (err) throw err;
    fs.writeFile(path + folder + '/' + filename + '.csv',
                 output, (err) => {
      if (err) throw err;
      // console.log('CSV saved.');
    });
  });
}

function place_and_save(aComp, truncation, aMin, fnam, mode, continuation_length){
  // Gives the composition a unique id.
  aComp['id'] = uu()
  // Places notes so they start at time zero.
  if (truncation) {
    aComp.notes.forEach(function (note) {
      note.ontime -= aMin
      note.offtime -= aMin
      // Reduce any weirdly long notes to max of 2 measures.
      if (note.duration > 8){
        note.duration = 8;
        note.offtime = note.ontime + note.duration;
      }
    })
  }
  // Saves composition(s) to DB.
  //new CompositionModel(aComp)
  //.save()
  //.then(function (composition) {
  //  console.log(
  //    'idLakh: ', composition.idLakh,
  //    'mode: ', mode,
  //    'contLength: ', continuation_length,
  //    'id: ', composition.id
  //  );
  //})
}

// Tom Collins 1/23/2018.
// I need to check these are as up-to-date a pair of functions as we have.
function comp_obj2beat_mnn_states(comp_obj){
  // Tom Collins 11/1/2015.
  // This function converts a comp_obj variable to an array consisting of
  // json variables. Each json variable contains state and context information
  // for a segment of the input comp_obj variable. This can then be analysed
  // (by another function) for possible continuations between states in one or
  // more pieces.
  
  var MNN_index = 1;
  var out_array = [];
  // console.log('comp_obj:');
  // console.log(comp_obj);
  if (comp_obj.timeSignatures.length > 1){
    console.log("More than one time signature in this piece.");
    console.log("Might not be the best idea to analyse with this function.");
    console.log("Stopping analysis for this piece.");
    return out_array;
  }
  else{
    var D = mu.comp_obj2note_point_set(comp_obj);
    var segE = mu.segment(D);
    
    // Iterate over segE, converting the ontime of each segment to a beat
    // number and extracting the MIDI note numbers.
    for (i = 0; i < segE.length; i++){
      var bar_beat =
      mu.bar_and_beat_number_of_ontime(segE[i].ontime,
                                        comp_obj.timeSignatures);
      // This is beat of the bar in crotchet beats rounded to 5 decimal places.
      var beat_round = Math.round(bar_beat[1]*100000)/100000;
      var MNN = [];
      for (j = 0; j < segE[i].points.length; j++){
        MNN[j] = segE[i].points[j][MNN_index];
      }
      // Sort the MNN entries and retain only the unique members.
      var MNN_unq
        = mu.get_unique(MNN.sort(function(a, b) { return a - b; }));
      // Tuplets in scores can cause rounding errors when states are created, so
      // check for very small time differences between consecutive states, and
      // ignore a state if it is followed really soon after by another.
      if (segE[i].offtime - segE[i].ontime >= .00002){
        out_array.push({
          "beat_MNN_state": [beat_round, MNN_unq],
          "context": {
            "piece_id": comp_obj.id,
            "orig_points": segE[i].points
          }
        });
      }
      else{
        console.log('A state was thrown out because of being followed really' +
          ' soon after by another.');
        console.log('segE[i]:');
        console.log(segE[i]);
        console.log('segE[i + 1]:');
        console.log(segE[i + 1]);
      }
    }
    return out_array;
  }
}


function construct_stm(json_scores){
  // Tom Collins 27/1/2015.
  // This function takes an array of json_score variables as input, and
  // constructs an array known as a state transition matrix. In reality, it is
  // an array not a matrix: an array of objects where each object contains a
  // beat_MNN_state property and a continuations property. The beat_MNN_state
  // property value is an array, something like
  // [1, [42, 60]], which means a musical event/segment that begins on beat 1
  // of the bar and consists of two MIDI note numbers, 42 and 60. The
  // continuations property value is an array consisting of state-context
  // pairs: it is all the events/segments that follow on from [1, [42, 60]],
  // say, in the json_score variables.
  
  // Could check that each of the json_scores have just one time signature, and
  // that they are all equal to one another...
  var nscr = json_scores.length;
  
  var state_context_pairs = [];
  for (iscr = 0; iscr < nscr; iscr++){
    state_context_pairs[iscr]
      = comp_obj2beat_mnn_states(json_scores[iscr]);
    //if (iscr == 0){
    //  console.log('state_context_pairs[iscr]:', state_context_pairs[iscr]);
    //}
  }
  // console.log('I got here!');
  
  var stm = [];
  for (iscr = 0; iscr < nscr; iscr++){
    for (jstate = 0; jstate < state_context_pairs[iscr].length - 1; jstate++){
      // console.log('Curr state:');
      // console.log(state_context_pairs[iscr][jstate]["beat_MNN_state"]);
      var rel_idx
        = mu.array_object_index_of_array(
          stm, state_context_pairs[iscr][jstate]["beat_MNN_state"],
          "beat_MNN_state");
      if (rel_idx >= 0){
        // The current state already appears in the stm. Push its continuation
        // to the array of continuations for this state.
        stm[rel_idx]["continuations"].push(state_context_pairs[iscr][jstate + 1]);
      }
      else{
        // The current state has not appeared in the stm before. Push it and
        // its first continuation observed here to the stm.
        stm.push({ "beat_MNN_state":
                     state_context_pairs[iscr][jstate]["beat_MNN_state"],
                   "continuations":
                     [state_context_pairs[iscr][jstate + 1]] });
      }
    }
    // console.log('Completed processing composition ' + iscr);
  }
  return stm;
}

