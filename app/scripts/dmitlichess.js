'use strict';

// @TODO: Queue sounds so Dmitry doesn't talk over himself
//        see http://blogs.msdn.com/b/ie/archive/2011/05/13/unlocking-the-power-of-html5-lt-audio-gt.aspx

// @TODO: Play random bits of Komarov at times ("yes", "unbelievable", etc.)

// @TODO: Change the default yeoman logo to Komarov

// @TODO: Preload sounds



var squares = document.querySelectorAll('#lichess .lichess_board .lcs');
var moveEmitter = new MoveEmitter(squares);

var sounds = {};

var makeAudio = function(file, volume) {
  console.log(chrome.extension.getURL('ogg/' + file));

  var audio = new Audio(chrome.extension.getURL('ogg/' + file));
  audio.volume = volume;

  return audio;
};

// @TODO: Is there a way to read file list in ./ogg instead of looping?
// @TODO: Refactor this. No point in looping a brazilian times
// @TODO: Handle error when trying to load a file that does not exist
var preloadSounds = function() {
  var pieces = ['', 'N', 'B', 'R', 'Q', 'K'];
  var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  var ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  var i, j, k, notation, captureNotation;

  // Moves
  for (i=0; i<pieces.length; i++) {
    for (j=0; j<files.length; j++) {
      for (k=0; k<ranks.length; k++) {
        notation = pieces[i] + files[j] + ranks[k];
        sounds[notation] = makeAudio(notation + '.ogg', 1);
      }
    }
  }

  // Captures (pieces)
  for (i=1; i<pieces.length; i++) {
    for (j=0; j<files.length; j++) {
      for (k=0; k<ranks.length; k++) {
        notation = pieces[i] + 'x' + files[j] + ranks[k];
        sounds[notation] = makeAudio(notation + '.ogg', 1);
      }
    }
  }

  // Captures (pawns)
  for (i=0; i<files.length; i++) {
    for (j=0; j<files.length; j++) {
      for (k=0; k<ranks.length; k++) {
        if (Math.abs(i-j) === 1) {
          notation = files[i] + pieces[0] + 'x' + files[j] + ranks[k];
          sounds[notation] = makeAudio(notation + '.ogg', 1);
        }
      }
    }
  }

  sounds[notation] = makeAudio('0-0.ogg', 1);
  sounds[notation] = makeAudio('0-0-0.ogg', 1);
  
  console.log(Object.keys(sounds));
  console.log(Object.keys(sounds).length);
};

// @TODO: Doesn't work
var disableDefaultSounds = function() {
  for (var prop in $.sound) {
    if ($.sound.hasOwnProperty(prop)) {
      $.sound[prop] = function() {};
    }
  }
};

var unleashDmitry = function() {
  $('#lichess').on('move capture', function(event, notation) {
    // if (!sounds[notation]) {
    //   sounds[notation] = makeAudio(notation + '.ogg', 1);
    // }

    if (sounds[notation]) {
      sounds[notation].play();
    }
  });
};

var init = function() {
  preloadSounds();
  disableDefaultSounds();

  unleashDmitry();
};

init();
