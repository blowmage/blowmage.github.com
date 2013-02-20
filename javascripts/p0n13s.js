jQuery(function($) {
  var ponies = Array('hug.png', 'sunglasses.png', 'mane6.png', 'u-mad.png', 'crash.png');
  var pony   = ponies[Math.floor(Math.random()*ponies.length)];
  $('body').append('<img id="p0n13s" src="/images/ponies/' + pony + '" style="position:fixed;bottom:0;right:0;height:300px;">');
  $('body > div.wrapper > section').append('<div id="pwnies"></div>');
  $('#p0n13s').hide();
  $('#pwnies').waypoint(function(direction) {
    if (direction === "up") {
      $('#p0n13s').slideUp();
    } else {
      $('#p0n13s').slideDown();
    }
  }, {
    offset: '100%'
  });  
});
