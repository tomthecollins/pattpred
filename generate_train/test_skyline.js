
var mu = require('maia-util');

var notes = [
    {
        "ID": "216",
        "pitch": "Bb2",
        "MNN": 46,
        "MPN": 52,
        "barOn": 4,
        "beatOn": 1,
        "ontime": 12,
        "duration": 2,
        "barOff": 4,
        "beatOff": 3,
        "offtime": 14,
        "staffNo": 3,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "middle",
                "text": "mand"
            }
        ],
        "intDur": 4,
        "type": "half",
        "stem": "up"
    },
    {
        "ID": "140",
        "pitch": "D4",
        "MNN": 62,
        "MPN": 61,
        "barOn": 4,
        "beatOn": 1,
        "ontime": 12,
        "duration": 2,
        "barOff": 4,
        "beatOff": 3,
        "offtime": 14,
        "staffNo": 2,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "middle",
                "text": "mand"
            }
        ],
        "intDur": 4,
        "type": "half",
        "stem": "down"
    },
    {
        "ID": "68",
        "pitch": "F4",
        "MNN": 65,
        "MPN": 63,
        "barOn": 4,
        "beatOn": 1,
        "ontime": 12,
        "duration": 2,
        "barOff": 4,
        "beatOff": 3,
        "offtime": 14,
        "staffNo": 1,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "middle",
                "text": "mand"
            }
        ],
        "intDur": 4,
        "type": "half",
        "stem": "up"
    },
    {
        "ID": "8",
        "pitch": "Bb4",
        "MNN": 70,
        "MPN": 66,
        "barOn": 4,
        "beatOn": 1,
        "ontime": 12,
        "duration": 2,
        "barOff": 4,
        "beatOff": 3,
        "offtime": 14,
        "staffNo": 0,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "middle",
                "text": "mand"
            }
        ],
        "intDur": 4,
        "type": "half",
        "stem": "down"
    },
    {
        "ID": "217",
        "pitch": "F3",
        "MNN": 53,
        "MPN": 56,
        "barOn": 4,
        "beatOn": 3,
        "ontime": 14,
        "duration": 6,
        "barOff": 6,
        "beatOff": 1,
        "offtime": 20,
        "staffNo": 3,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "end",
                "text": "ments,"
            }
        ],
        "tie": [
            {
                "ID": "217",
                "pitch": "F3",
                "MNN": 53,
                "MPN": 56,
                "barOn": 4,
                "beatOn": 3,
                "ontime": 14,
                "duration": 2,
                "barOff": 5,
                "beatOff": 1,
                "offtime": 16,
                "staffNo": 3,
                "voiceNo": 0,
                "lyric": [
                    {
                        "number": 1,
                        "syllabic": "end",
                        "text": "ments,"
                    }
                ],
                "intDur": 4,
                "type": "half",
                "stem": "down",
                "notations": {},
                "tieType": "start"
            },
            {
                "ID": "218",
                "pitch": "F3",
                "MNN": 53,
                "MPN": 56,
                "barOn": 5,
                "beatOn": 1,
                "ontime": 16,
                "duration": 4,
                "barOff": 6,
                "beatOff": 1,
                "offtime": 20,
                "staffNo": 3,
                "voiceNo": 0,
                "intDur": 8,
                "type": "whole",
                "notations": {},
                "tieType": "stop"
            }
        ]
    },
    {
        "ID": "141",
        "pitch": "C4",
        "MNN": 60,
        "MPN": 60,
        "barOn": 4,
        "beatOn": 3,
        "ontime": 14,
        "duration": 4,
        "barOff": 5,
        "beatOff": 3,
        "offtime": 18,
        "staffNo": 2,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "end",
                "text": "ments,"
            }
        ],
        "tie": [
            {
                "ID": "141",
                "pitch": "C4",
                "MNN": 60,
                "MPN": 60,
                "barOn": 4,
                "beatOn": 3,
                "ontime": 14,
                "duration": 2,
                "barOff": 5,
                "beatOff": 1,
                "offtime": 16,
                "staffNo": 2,
                "voiceNo": 0,
                "lyric": [
                    {
                        "number": 1,
                        "syllabic": "end",
                        "text": "ments,"
                    }
                ],
                "intDur": 4,
                "type": "half",
                "stem": "down",
                "notations": {},
                "tieType": "start"
            },
            {
                "ID": "142",
                "pitch": "C4",
                "MNN": 60,
                "MPN": 60,
                "barOn": 5,
                "beatOn": 1,
                "ontime": 16,
                "duration": 2,
                "barOff": 5,
                "beatOff": 3,
                "offtime": 18,
                "staffNo": 2,
                "voiceNo": 0,
                "intDur": 4,
                "type": "half",
                "stem": "down",
                "notations": {},
                "tieType": "stop"
            }
        ]
    },
    {
        "ID": "69",
        "pitch": "F4",
        "MNN": 65,
        "MPN": 63,
        "barOn": 4,
        "beatOn": 3,
        "ontime": 14,
        "duration": 4,
        "barOff": 5,
        "beatOff": 3,
        "offtime": 18,
        "staffNo": 1,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "end",
                "text": "ments,"
            }
        ],
        "tie": [
            {
                "ID": "69",
                "pitch": "F4",
                "MNN": 65,
                "MPN": 63,
                "barOn": 4,
                "beatOn": 3,
                "ontime": 14,
                "duration": 2,
                "barOff": 5,
                "beatOff": 1,
                "offtime": 16,
                "staffNo": 1,
                "voiceNo": 0,
                "lyric": [
                    {
                        "number": 1,
                        "syllabic": "end",
                        "text": "ments,"
                    }
                ],
                "intDur": 4,
                "type": "half",
                "stem": "up",
                "notations": {},
                "tieType": "start"
            },
            {
                "ID": "70",
                "pitch": "F4",
                "MNN": 65,
                "MPN": 63,
                "barOn": 5,
                "beatOn": 1,
                "ontime": 16,
                "duration": 2,
                "barOff": 5,
                "beatOff": 3,
                "offtime": 18,
                "staffNo": 1,
                "voiceNo": 0,
                "intDur": 4,
                "type": "half",
                "stem": "up",
                "notations": {},
                "tieType": "stop"
            }
        ]
    },
    {
        "ID": "9",
        "pitch": "A4",
        "MNN": 69,
        "MPN": 65,
        "barOn": 4,
        "beatOn": 3,
        "ontime": 14,
        "duration": 2,
        "barOff": 5,
        "beatOff": 1,
        "offtime": 16,
        "staffNo": 0,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "end",
                "text": "ments,"
            }
        ],
        "intDur": 4,
        "type": "half",
        "stem": "up"
    },
    {
        "ID": "10",
        "pitch": "A4",
        "MNN": 69,
        "MPN": 65,
        "barOn": 5,
        "beatOn": 2,
        "ontime": 17,
        "duration": 1,
        "barOff": 5,
        "beatOff": 3,
        "offtime": 18,
        "staffNo": 0,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "and"
            }
        ],
        "intDur": 2,
        "type": "quarter",
        "stem": "up"
    },
    {
        "ID": "11",
        "pitch": "A4",
        "MNN": 69,
        "MPN": 65,
        "barOn": 5,
        "beatOn": 3,
        "ontime": 18,
        "duration": 1,
        "barOff": 5,
        "beatOff": 4,
        "offtime": 19,
        "staffNo": 0,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "I"
            }
        ],
        "intDur": 2,
        "type": "quarter",
        "stem": "up"
    },
    {
        "ID": "143",
        "pitch": "A3",
        "MNN": 57,
        "MPN": 58,
        "barOn": 5,
        "beatOn": 4,
        "ontime": 19,
        "duration": 1,
        "barOff": 6,
        "beatOff": 1,
        "offtime": 20,
        "staffNo": 2,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "and"
            }
        ],
        "intDur": 2,
        "type": "quarter",
        "stem": "up"
    },
    {
        "ID": "12",
        "pitch": "A4",
        "MNN": 69,
        "MPN": 65,
        "barOn": 5,
        "beatOn": 4,
        "ontime": 19,
        "duration": 1,
        "barOff": 6,
        "beatOff": 1,
        "offtime": 20,
        "staffNo": 0,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "will"
            }
        ],
        "intDur": 2,
        "type": "quarter",
        "stem": "up"
    },
    {
        "ID": "144",
        "pitch": "A3",
        "MNN": 57,
        "MPN": 58,
        "barOn": 6,
        "beatOn": 1,
        "ontime": 20,
        "duration": 1,
        "barOff": 6,
        "beatOff": 2,
        "offtime": 21,
        "staffNo": 2,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "I"
            }
        ],
        "intDur": 2,
        "type": "quarter",
        "stem": "up"
    },
    {
        "ID": "13",
        "pitch": "C5",
        "MNN": 72,
        "MPN": 67,
        "barOn": 6,
        "beatOn": 1,
        "ontime": 20,
        "duration": 2,
        "barOff": 6,
        "beatOff": 3,
        "offtime": 22,
        "staffNo": 0,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "pray"
            }
        ],
        "intDur": 4,
        "type": "half",
        "stem": "down"
    },
    {
        "ID": "145",
        "pitch": "A3",
        "MNN": 57,
        "MPN": 58,
        "barOn": 6,
        "beatOn": 2,
        "ontime": 21,
        "duration": 1,
        "barOff": 6,
        "beatOff": 3,
        "offtime": 22,
        "staffNo": 2,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "will"
            }
        ],
        "intDur": 2,
        "type": "quarter",
        "stem": "up"
    },
    {
        "ID": "146",
        "pitch": "D4",
        "MNN": 62,
        "MPN": 61,
        "barOn": 6,
        "beatOn": 3,
        "ontime": 22,
        "duration": 1.5,
        "barOff": 6,
        "beatOff": 4.5,
        "offtime": 23.5,
        "staffNo": 2,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "pray"
            }
        ],
        "intDur": 3,
        "type": "quarter",
        "stem": "down"
    },
    {
        "ID": "14",
        "pitch": "Bb4",
        "MNN": 70,
        "MPN": 66,
        "barOn": 6,
        "beatOn": 3,
        "ontime": 22,
        "duration": 1,
        "barOff": 6,
        "beatOff": 4,
        "offtime": 23,
        "staffNo": 0,
        "voiceNo": 0,
        "lyric": [
            {
                "number": 1,
                "syllabic": "single",
                "text": "the"
            }
        ],
        "intDur": 2,
        "type": "quarter",
        "stem": "down"
    }
];

function skyline(notes){
  // Tom Collins 18/7/2018.
  // This function takes notes from Composition object as input and returns the
  // skyline notes, meaning the highest sounding note at each segment.
  
  var segs = mu.segment(mu.comp_obj2note_point_set({ notes: notes }));
  // Sort segment content ascending by MIDI note number.
  segs = segs.map(function(s){
    var sorted_points = s.points.sort(function(a, b){
      return a[1] - b[1];
    })
    .filter(function(p){
      return Math.abs(p[0] - s.ontime) < 0.01;
    })
    return {
      ontime: s.ontime,
      offtime: s.offtime,
      points: sorted_points
    }
  });
  // console.log('segs:', segs);
  
  // Might start with a rest, so handle that!
  // console.log('notes.slice(0, 5):', notes.slice(0, 5));
  // console.log('segs.slice(0, 5):', segs.slice(0, 5));
  var startIdx = 1;
  if (segs[0].points.length === 0){
    startIdx++;
  }
  var curr_sk =
    segs[startIdx - 1].points[segs[startIdx - 1].points.length - 1];
  var skyline = [curr_sk];
  for (i = startIdx; i < segs.length; i++){
    var s = segs[i];
    if (curr_sk === undefined){
      // Is undefined because previous segment was a rest. The current segment
      // must (well, should!) be populated be definition, so set a new curr_sk
      // based on the current highest MNN.
      if (s.points.length > 0){
        curr_sk = s.points[s.points.length - 1];
        skyline.push(curr_sk);
      }
    }
    else {
      // Previous segment was not a rest. Is the current segment a rest?
      if (s.points.length === 0){
        // Yes. Empty curr_sk and continue.
        curr_sk = undefined;
      }
      else {
        // curr_sk is populated and current segment is not a rest. Test if
        // curr_sk has ended, in which case update curr_sk with the new top
        // MNN.
        if (Math.abs((curr_sk[0] + curr_sk[3]) - s.ontime) < .01){
          curr_sk = s.points[s.points.length - 1];
          skyline.push(curr_sk);
        }
        else {
          // curr_sk has not ended. Test whether the MNN at the top of the
          // current segment is greater than that of curr_sk. If it is, we have
          // a new curr_sk. Also test for equality of MNN but an increase in
          // ontime, in which case we also have a new curr_sk.
          if (s.points[s.points.length - 1][1] > curr_sk[1] ||
              (s.points[s.points.length - 1][1] === curr_sk[1] &&
               s.points[s.points.length - 1][0] > curr_sk[0])){
            curr_sk = s.points[s.points.length - 1];
            skyline.push(curr_sk);
          }
        }
      }
    }
  }
  // console.log('skyline.slice(0, 5):', skyline.slice(0, 5));
  
  // Convert skyline back to notes. This is inefficient - could have maintained
  // an index into notes in the first place.
  // console.log('skyline:', skyline);
  var skynotes = skyline.map(function(p){
    return notes.find(function(n){
      // Return match on ontime, MNN, staffNo and duration.
      return (n.MNN === p[1]) && (Math.abs(n.ontime - p[0]) < .01) &&
      (n.staffNo === p[4]) && (Math.abs(n.duration - p[3]) < .01);
    });
  });
  return skynotes;
}


var out = skyline(notes);
console.log('out:', out);
