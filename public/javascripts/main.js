$(function () {

  window.sound = new Audio('/audio/goat.mp3');
  var locs = JSON.parse($("#dataLoc").attr("data-loc"));
  var isGoat = false;
  setInterval(function () {
    var current = player.getCurrentTime();
    //use for loop to iterate through start/duration
    var goatInd = 0;
      if (isBetween(current, locs[0].start, locs[0].duration)) { 
        toggle(true); 
        if (!isGoat && locs.length > 1) {
          locs.shift();
        }
        isGoat = true;
      } else { 
        toggle(false);
        isGoat = false; 
      }
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