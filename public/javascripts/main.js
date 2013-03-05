$(function () {
  if (player.getCurrentTime() == 6.000) {
    player.mute();
    $('.video').css('display','none');
    $('.goat').css('display','block');
    var sound = $('<embed autoplay="true" height="0" width="0" autoplay="true" />');
    sound.attr('src', '/audio/goat.mp3');
    $('#scream').html(sound);
  }
});