 //Переменная для включения/отключения индикатора загрузки
let spinner = document.querySelector('.loader');
//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
let check_if_load = false;
//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
let myMap, myPlacemarkTemp
//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;contacts-page-yandex&#34;
function init () {
    myMap = new ymaps.Map('map-yandex', {
        center: [56.517346, 43.561754],
        zoom: 15
    })
    objectManager = new ymaps.ObjectManager({
        clusterize: true,
        gridSize: 32
    });
    myMap.behaviors.disable('scrollZoom');
    myMap.geoObjects.add(objectManager);
    objectManager.objects.options.set('preset', 'islands#redDotIcon');
    myMap.geoObjects.add(objectManager);
    objectManager.add({
        type: "FeatureCollection",
        features: [
            {
                type:  "Feature",
                id: 1,
                geometry: {
                    type:  "Point",
                    coordinates: [56.517346, 43.561754]
                },
                properties: {
                    balloonContent:  'Балахна ул Космонавтов д. 14',
                    iconCaption:  'Балахна',
                },
                options: {
                    iconLayout:  'default#imageWithContent',
                    iconImageHref:  `../wp-content/themes/theme-gosudar/assets/images/map/map-icon.svg`,
                    iconImageSize:  [56, 56],
                }
            },
        ]
    });
    /* 2. Обработка списка и меток
    //Клик по метке в карте
    objectManager.objects.events.add('click', function (e) {
        let objectId=e.get('objectId');
        viewObject(objectId);
    });
    //Клик в списке
    [].forEach.call(document.querySelectorAll('[data-objectId]'), function(el) {
        el.addEventListener('click', function() {
            let objectId=el.getAttribute("data-objectId");
            viewObject(objectId);
        });
    });*/
    // Что происходит при выборе метки или варианта из списка
      function viewObject(objectId){
        // Удаляем со всего списка класс active затем добавляем к выбранному
        for (let object of document.querySelectorAll('[data-objectId]')) {
            object.classList.remove('active');
        }
        document.querySelector('[data-objectId="'+objectId+'"]').classList.add('active');
        // Выделяем все метки в синий, затем выбранную в красную
        /*
        objectManager.objects.each(function (item) {
          objectManager.objects.setObjectOptions(item.id, {
            preset: 'islands#blueIcon'
          });
        });
        objectManager.objects.setObjectOptions(objectId, {
          preset: 'islands#redDotIcon'
        });
        */
        // Центрирование по метке
        myMap.setCenter(objectManager.objects.getById(objectId).geometry.coordinates, 10, {
            checkZoomRange: true
        });
    }
}
// Решение по callback-у для определения полной загрузки карты
/* myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту

// Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
var layer = myMapTemp.layers.get(0).get(0);
});
}
*/
//

// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов)
function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function (resolve, reject) {
        let tc = getTileContainer(layer), readyAll = true;
        tc.tiles.each(function (tile, number) {
            if (!tile.isReady()) {
                readyAll = false;
            }
        });
        if (readyAll) {
            resolve();
        } else {
            tc.events.once("ready", function() {
                resolve();
            });
        }
    });
}

function getTileContainer(layer) {
    for (let k in layer) {
        if (layer.hasOwnProperty(k)) {
            if (
                layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
                || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
            ) {
                return layer[k];
            }
        }
    }
    return null;
}

// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
function loadScript(url, callback){
    let script = document.createElement("script");

    if (script.readyState){  // IE
        script.onreadystatechange = function(){
            if (script.readyState === "loaded" ||
                script.readyState === "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  // Другие браузеры
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);

}

// Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
let ymap = function() {
    const yandexMap = document.querySelector('.map-yandex')
    let changeDom = function () {
        spinner.classList.remove('is-active');
    }
    if (yandexMap) {
        let observer = new MutationObserver(changeDom);
        observer.observe(yandexMap, {
            childList: true, // наблюдать за непосредственными детьми
            subtree: false, // и более глубокими потомками
            characterDataOldValue: false // передавать старое значение в колбэк
        });
    }
        if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем
            // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
            check_if_load = true;
            // Показываем индикатор загрузки до тех пор, пока карта не загрузится
            spinner.classList.add('is-active');
            // Загружаем API Яндекс.Карт
            loadScript("https://api-maps.yandex.ru/2.1?apikey=2bc17e88-f416-4b38-9838-1b659083564b&lang=ru", function(){
                // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;contacts-page-yandex&#34;
                ymaps.load(init);
            });
        }
}

let yandexContainer = document.querySelector('.ymap-container')

if (yandexContainer) {
    yandexContainer.addEventListener('mouseenter', ymap,{'once': true})
}





