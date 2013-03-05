$(function () {
  window.sound = new Audio('/audio/goat.mp3');
  setInterval(function () {
    var current = player.getCurrentTime();
    //use for loop to iterate through start/duration
    if (isBetween(current, 6, 2)) { toggle(true); } else { toggle(false); }
  }, 200);
});

function isBetween(current, start, duration) {
  return current > start && current < (start + duration);
}

function toggle(goat) {
  if (goat) {
    player.mute();
    $('.video').css('display','none');
    $('.goat').css('display','block');
    window.sound.play();
  } else {
    player.unMute();
    $('.video').css('display','block');
    $('.goat').css('display','none');
    window.sound.pause();
  }
}