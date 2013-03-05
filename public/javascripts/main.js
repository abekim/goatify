$(function () {
  if (player.getCurrentTime() == 6.000) {
    player.mute();
    $('.video').css('display','none');
    $('.goat').css('display','block');
    var sound = $('<embed autoplay="true" height="0" width="0" />');
    sound.attr('src', urlOfMyMp3);
    $('#scream').html(sound);
  }
});