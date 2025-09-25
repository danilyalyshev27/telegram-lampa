// === Настройки ===
const TELEGRAM_BOT_TOKEN = '8490633834:AAH_st-gObgXCc8eHFo52lihGf5iartiG94';
const CHAT_ID = '7816280190';

// === Состояние ===
let currentData = {
  title: '',
  season: '',
  episode: '',
  startTime: 0
};

let isPlaying = false;

// === Функция отправки Telegram-сообщений ===
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

// === Обработчик начала воспроизведения ===
function onStart(data) {
  if (!data || typeof data !== 'object') return;

  // Корректно определяем, что за тип объекта data приходит из Lampa
  let title = '';
  let season = '';
  let episode = '';

  // Для плагина Lampa часто данные лежат в data.movie или data.episode
  if (data.movie) {
    title = data.movie.original_title || data.movie.title || 'Неизвестный фильм';
    if (data.episode) {
      season = data.episode.season ? `Сезон ${data.episode.season}` : '';
      episode = data.episode.episode ? `Эпизод ${data.episode.episode}` : '';
    }
  } else {
    title = data.title || 'Неизвестный фильм';
    season = data.season ? `Сезон ${data.season}` : '';
    episode = data.episode ? `Эпизод ${data.episode}` : '';
  }

  currentData.title = title;
  currentData.season = season;
  currentData.episode = episode;
  currentData.startTime = Date.now();
  isPlaying = true;

  // Отправка уведомления в Telegram о запуске фильма
  const message = `💡 <b>Лампа запущена!</b>\n▶️ <b>Запущено</b>: ${[title, season, episode].filter(Boolean).join(' ')}`;
  sendTelegram(message);

  console.log('[Player] Воспроизведение начато:', message);
}

// === Обработчик остановки воспроизведения ===
function onStop() {
  if (!isPlaying) return;

  const durationMs = Date.now() - currentData.startTime;
  const minutes = Math.floor(durationMs / 60000);

  const message = `⏹️ <b>Остановлено</b>: ${[currentData.title, currentData.season, currentData.episode].filter(Boolean).join(' ')}\n<b>Просмотрено</b>: ${minutes} мин`;
  sendTelegram(message);

  isPlaying = false;
  console.log('[Player] Воспроизведение остановлено:', message);
}

// === Подключение как плагин для Lampa ===
(function(){
  // Проверяем наличие Lampa и Player
  function tryIntegrate() {
    if (typeof Lampa !== 'undefined' && Lampa.Player && typeof Lampa.Player.on === 'function') {
      Lampa.Player.on('play', onStart);
      Lampa.Player.on('stop', onStop);
      console.log('[Plugin] Telegram Lampa Tracker подключен.');
    } else {
      console.warn('[Plugin] Lampa.Player не найден. Жду...');
      setTimeout(tryIntegrate, 2000);
    }
  }
  tryIntegrate();
})();
