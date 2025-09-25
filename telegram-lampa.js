// Название плагина: HelloPlugin
(function(){
    // Проверка, что Lampa загружена
    if(!window.Lampa) return;

    // Создаем кнопку
    function createButton(){
        let button = $('<div class="menu__item selector focus" data-action="hello_plugin">👋 Hello</div>');
        $('.menu__list').append(button);

        // Обработчик нажатия
        button.on('hover:enter', function(){
            Lampa.Noty.show('Привет от HelloPlugin!');
        });
    }

    // Добавляем кнопку после загрузки меню
    Lampa.Listener.follow('menu', function(e){
        if(e.type === 'open') createButton();
    });

    // Лог в консоль
    console.log('HelloPlugin загружен');
})();
