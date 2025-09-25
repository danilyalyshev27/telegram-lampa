const TELEGRAM_BOT_TOKEN = '8490633834:AAH_st-gObgXCc8eHFo52lihGf5iartiG94';
const CHAT_ID = '7816280190';

let currentData = {
  title: '',
  season: '',
  episode: '',
  startTime: 0
};
let isPlaying = false;

function sendTelegram(message) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  }).catch(err => console.error('Telegram error:', err));
}

function onStart(data) {
  currentData.title = data.title || 'Неизвестный фильм';
  currentData.season = data.season ? `Сезон ${data.season}` : '';
  currentData.episode = data.episode ? `Эпизод ${data.episode}` : '';
  currentData.startTime = Date.now();
  isPlaying = true;

  sendTelegram('▶️ Запущено: ' + [currentData.title, currentData.season, currentData.episode].filter(Boolean).join(' '));
}

function onStop(data) {
  if (!isPlaying) return;

  const currentTimeMs = Date.now();
  const diffMs = currentTimeMs - currentData.startTime;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);

  sendTelegram(
    '⏹️ Вышел: ' + [currentData.title, currentData.season, currentData.episode].filter(Boolean).join(' ') +
    `<br>Минут: ${minutes}`
  );

  isPlaying = false;
}

Lampa.Player.on('play', onStart);
Lampa.Player.on('stop', onStop);
