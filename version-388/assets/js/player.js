(function () {
  function initPlayer(root) {
    var video = root.querySelector('video');
    var button = root.querySelector('[data-play-button]');
    var status = root.querySelector('[data-player-status]');
    var src = root.getAttribute('data-video-src');
    var initialized = false;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function load() {
      if (!video || !src || initialized) {
        return;
      }
      initialized = true;
      setStatus('正在加载播放源...');

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('播放源已就绪，可在线观看。');
          video.play().catch(function () {
            setStatus('播放源已就绪，请点击播放器继续播放。');
          });
        });
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setStatus('网络加载异常，正在重新连接播放源。');
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setStatus('媒体解码异常，正在恢复播放。');
            hls.recoverMediaError();
          } else {
            setStatus('当前浏览器无法播放该线路，请更换浏览器或刷新页面。');
            hls.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', function () {
          setStatus('播放源已就绪，可在线观看。');
          video.play().catch(function () {
            setStatus('播放源已就绪，请点击播放器继续播放。');
          });
        });
      } else {
        setStatus('当前浏览器不支持 HLS 播放，请使用新版 Chrome、Edge、Firefox 或 Safari。');
      }
    }

    if (button) {
      button.addEventListener('click', function () {
        root.classList.add('is-playing');
        load();
        if (video) {
          video.play().catch(function () {});
        }
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        root.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          setStatus('已暂停，点击播放器可继续观看。');
        }
      });
    }
  }

  document.querySelectorAll('[data-video-player]').forEach(initPlayer);
})();
