var video;
var bandwidth;
var conference;
var pin;

var rtc = null;

/* ~~~ SETUP AND TEARDOWN ~~~ */

function finalise(event) {
    rtc.disconnect();
    video.src = "";
}

function remoteDisconnect(reason) {
    //cleanup();
    alert(reason);
    window.removeEventListener('beforeunload', finalise);
    //window.close();
}

function doneSetup(videoURL, pin_status) {
    console.log("PIN status: " + pin_status);
    rtc.connect(pin);
}

function connected(videoURL) {
    video.poster = "";
    if (typeof(MediaStream) !== "undefined" && videoURL instanceof MediaStream) {
        video.srcObject = videoURL;
    } else {
        video.src = videoURL;
    }
}

function initialise(node, conference, userbw, name, userpin) {
    video = document.getElementById("video");
    console.log("Bandwidth: " + userbw);
    console.log("Conference: " + conference);

    pin = userpin;
    bandwidth = parseInt(userbw);

    rtc = new PexRTC();

    window.addEventListener('beforeunload', finalise);

    rtc.onSetup = doneSetup;
    rtc.onConnect = connected;
    rtc.onError = remoteDisconnect;
    rtc.onDisconnect = remoteDisconnect;

    rtc.makeCall(node, conference, name, bandwidth);
}

function endCall() {
  console.log("User wants to end the call.");
  rtc.disconnect();
  video.srcObject = "";
}

// Video Navigation Menu

(function() {
  
  $('li').text('');
  
    var co = $('ul').find('li').each(function(){
    var $this = $(this),
        $author = $this.data('item');
    
    var author = $('<span></span>', {
      class: 'item-close',
      text: $author
    }).appendTo( $this.closest('li') );
      
  });
  
  var $close = $('.close'),
      $pop = $('.pop'),
      $iconcube = $('.icon-cube'),
      $iconbox = $('.icon-box'),
      $itemclose = $('.item-close'),
      $button = $('#btn');
  
    $($button).on('click', function() {
        $($close, $pop).toggleClass('close pop');
        $($iconcube, $iconbox).toggleClass('icon-cube icon-box');
        $($itemclose).toggleClass('item-close item-open');
        $($button).toggleClass('active');
        
    });
    
})();
