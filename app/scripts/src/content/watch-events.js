'use strict';

var KEY_SPACE = 32;
var KEY_ENTER = 13;
var KEY_LEFT_ARROW = 37;
var KEY_RIGHT_ARROW = 39;

function WatchEvents(options) {
  this.document = document;
  this.onPlay = options.onPlay;
  this.onPause = options.onPause;
  this.onStop = options.onStop;
}

WatchEvents.prototype = {
  startListeners: function() {
    this.addClickListener();
    this.addStopListener();
    this.addKeyUpListener();
  },

  stopListeners: function() {
    this.removeClickListener();
    this.removeStopListener();
    this.removeKeyUpListener();
  },

  addClickListener: function() {
    this.document.addEventListener('click', this.onClick.bind(this), false);
  },

  addStopListener: function() {
    window.onpopstate = this.onStop;
    window.onbeforeunload = function() {
      this.onStop();
      this.stopListeners();
    }.bind(this)
  },

  addKeyUpListener: function() {
    this.document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  },

  onClick: function(e) {
    if (e.target.classList.contains('play')) {
      this.onPlay(e);
    } else if (e.target.classList.contains('pause')) {
      this.onPause(e);
    } else if (e.target.classList.contains('player-next-episode')) {
      this.onStop(e);
      this.onPlay(e);
    } else if (e.target.className === 'player-scrubber-target' ||
        e.target.className === 'player-scrubber-progress-completed' ||
        e.target.className === 'player-scrubber-progress-buffered' ||
        e.target.className === 'player-scrubber-progress' ||
        e.target.className === 'player-scrubber horizontal') {
      this.isPlaying() ? this.onPlay(e) : this.onPause(e);
    } else if (e.target.className === 'play-icon' ||
        e.target.className === 'player-postplay-still-hover-container' ||
        e.target.className === 'player-postplay-still-hover' ||
        e.target.className === 'player-postplay-recommendation-hover') {
      this.onStop(e);
      this.onPlay(e);
    } else if (e.target.classList.contains('playLink')) {
      this.onStop(e);
      this.onPlay(e);
    }
  },

  onKeyUp: function(e) {
    switch (e.which) {
      /* I know, if the video is playing, the obvious would be call onPause,
        if isn't playing, call onPlay.
        But the HTML of the player gets updated before this function is called,
        this way the correct approach is invert the conditions */
      case KEY_SPACE:
        this.isPlaying() ? this.onPlay(e) : this.onPause(e);
        break;
      case KEY_ENTER:
        this.isPlaying() ? this.onPlay(e) : this.onPause(e);
        break;
      case KEY_LEFT_ARROW:
        this.onPause(e);
        break;
      case KEY_RIGHT_ARROW:
        this.onPause(e);
        break;
    }
  },

  removeClickListener: function() {
    this.document.removeEventListener('click', this.onClick.bind(this), false);
  },

  removeStopListener: function() {
    window.onpopstate = null;
    window.onbeforeunload = null;
  },

  removeKeyUpListener: function() {
    this.document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
  },

  isPlaying: function() {
    var playPause = this.document.querySelector('.player-play-pause');
    return playPause && playPause.classList.contains('pause');
  }
};

module.exports = WatchEvents;