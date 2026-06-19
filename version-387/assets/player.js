(function () {
  function bootPlayer(box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('.player-cover');
    var message = box.querySelector('.player-message');
    var source = box.getAttribute('data-src');
    if (!video || !source) {
      return;
    }
    var ready = false;
    var setMessage = function (text) {
      if (message) {
        message.textContent = text || '';
        message.style.display = text ? 'block' : 'none';
      }
    };
    var start = function () {
      if (cover) {
        cover.classList.add('hidden');
      }
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          setMessage('点击视频继续播放');
        });
      }
    };
    var attach = function () {
      if (ready) {
        return;
      }
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage('');
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setMessage('播放暂时不可用');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        setMessage('播放暂时不可用');
      }
    };
    attach();
    if (cover) {
      cover.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });
  }
  document.querySelectorAll('.player-box').forEach(bootPlayer);
})();
