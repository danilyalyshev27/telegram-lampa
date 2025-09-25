window.plugin = function(plugin) {
  plugin.name = 'telegram_tracker';
  plugin.version = '1.0.0';
  plugin.description = 'Отправляет уведомления в Telegram при воспроизведении';

  plugin.run = function() {
    function sendTelegram(message) {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }).catch(err => {
        console.error('[Telegram] Ошибка отправки:', err);
      });
    }

    function onStart(data) {
      if (!data || typeof data !== 'object') return;

      let title = data.movie?.original_title || data.movie?.title || data.title || 'Неизвестный фильм';
      let season = data.episode?.season ? `Сезон ${data.episode.season}` : '';
      let episode = data.episode?.episode ? `Эпизод ${data.episode.episode}` : '';

      currentData = { title, season, episode, startTime: Date.now() };
      isPlaying = true;

      const message = `💡 <b>Лампа запущена!</b>\n▶️ <b>Запущено</b>: ${[title, season, episode].filter(Boolean).join(' ')}`;
      sendTelegram(message);
    }

    function onStop() {
      if (!isPlaying) return;
      const durationMs = Date.now() - currentData.startTime;
      const minutes = Math.floor(durationMs / 60000);
      const message = `⏹️ <b>Остановлено</b>: ${[currentData.title, currentData.season, currentData.episode].filter(Boolean).join(' ')}\n<b>Просмотрено</b>: ${minutes} мин`;
      sendTelegram(message);
      isPlaying = false;
    }

    if (Lampa?.Player?.on) {
      Lampa.Player.on('play', onStart);
      Lampa.Player.on('stop', onStop);
      console.log('[Plugin] Telegram Lampa Tracker подключен.');
    } else {
      console.warn('[Plugin] Lampa.Player не найден.');
    }
  };
};
