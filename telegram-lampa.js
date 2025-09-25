(function(){
    'use strict';

    var network = new Lampa.Reguest();

    function fetchTrendingMovies(){
        var url = 'https://api.themoviedb.org/3/trending/movie/week?api_key=4ef0d7355d9ffb5151e987764708ce96&language=ru';

        network.silent(url, function(data){
            if(data && data.results){
                var movies = data.results.map(function(item){
                    item.source = 'tmdb';
                    return item;
                });

                Lampa.Storage.set('tmdb_trending', JSON.stringify(movies));
                Lampa.Noty.show('Загружено популярных фильмов: ' + movies.length);

                Lampa.Activity.push({
                    url: '',
                    title: 'Популярное (TMDB)',
                    component: 'tmdb_trending',
                    page: 1
                });
            } else {
                Lampa.Noty.show('Не удалось получить данные TMDB');
            }
        }, function(error){
            console.log('TMDB error:', error);
            Lampa.Noty.show('Ошибка загрузки данных TMDB');
        });
    }

    // Добавим кнопку в меню
    function addMenuButton(){
        var button = $('<div class="menu__item selector focus" data-action="tmdb_trending">🔥 Популярное TMDB</div>');
        $('.menu__list').append(button);

        button.on('hover:enter', function(){
            fetchTrendingMovies();
        });
    }

    Lampa.Listener.follow('menu', function(e){
        if(e.type === 'open') addMenuButton();
    });

    console.log('TMDB Trending Plugin загружен');
})();
