/*
* =======================================
* Вывод даты в подвале
* =======================================
* */

let date = document.querySelector('[data-date-now]')

date ? date.innerHTML = new Date().getFullYear() : false


// ==================================================================
// Функции для копирования картинки
// ==================================================================
const imgCopy = (breakpoint,parent,appendElAfter,copyElement) => {
    breakpoint = window.matchMedia(breakpoint);//Брейк поинты
    let parentsEl = document.querySelectorAll(parent)
    parentsEl.forEach(function (parentEl) {
        let imgEl = parentEl.querySelector(copyElement)
        let afterEl = parentEl.querySelector(appendElAfter)
        let copyEl = imgEl.cloneNode(true)// Копирование картинки
        const checker = function () {
            if (breakpoint.matches) {
                afterEl.after(copyEl)
                imgEl.remove()
            } else {
                parentEl.append(imgEl)
                copyEl.remove()
            }
        };
        breakpoint.addEventListener('change', checker);
        checker();
    })

}

imgCopy('(max-width: 991px)', '[data-copy-parent]','[data-copy-after]','[data-img-change]')
imgCopy('(min-width: 991px)', '[data-button-copy]','[data-after-production]','[data-button-change]')



// ==================================================================
// Функции для добовления класса га свайпер при измении экрана
// ==================================================================
function addClassSwiper(breakpointActive, swiperName) {
    breakpointActive = window.matchMedia(breakpointActive);
    let checkerSwiper = function () {
        if (breakpointActive.matches) {
            swiperName.classList.add('swiper')
            swiperName.firstElementChild.classList.add('swiper-wrapper')
            swiperName.firstElementChild.children
            for (let i = 0; i < swiperName.firstElementChild.children.length; i++) {
                swiperName.firstElementChild.children[i].classList.add('swiper-slide')
            }
        } else {
            swiperName.classList.remove('swiper')
            swiperName.firstElementChild.classList.remove('swiper-wrapper')
            swiperName.firstElementChild.children
            for (let i = 0; i < swiperName.firstElementChild.children.length; i++) {
                swiperName.firstElementChild.children[i].classList.remove('swiper-slide')
            }
        }
    };
    breakpointActive.addEventListener('change', checkerSwiper);
    checkerSwiper();
}

addClassSwiper('(max-width: 991px)', document.querySelector('[data-equipment-swiper]'))

/*
===================================================
Функции для управления кастомной пагинации
===================================================
*/
function sliderNumber(mySliderTotalSlides, mySliderCurrentSlide, currentSlider,elementDisabled) {

    if (elementDisabled) {
        mySliderCurrentSlide.innerHTML = String(++currentSlider.realIndex).padStart(2, '0')
        --currentSlider.realIndex
        if (currentSlider.params.slidesPerView > 1) {
            mySliderTotalSlides.innerHTML = String(Math.round(++currentSlider.slides.length - currentSlider.params.slidesPerView)).padStart(2, '0')
        } else {
            mySliderTotalSlides.innerHTML = String(Math.round(currentSlider.slides.length)).padStart(2, '0')
        }

        currentSlider.on('slideChange', function () {
            let currentSlide = ++currentSlider.realIndex
            mySliderCurrentSlide.innerHTML = String(currentSlide).padStart(2, '0')
        })

        if (currentSlider.params.slidesPerView === 1 && currentSlider.params.slidesPerView >= currentSlider.slides.length) {
            elementDisabled.style.display = 'none'
        }

        if (currentSlider.params.slidesPerView > 1 && currentSlider.params.slidesPerView >= --currentSlider.slides.length) {
            elementDisabled.style.display = 'none'
        }
    }

    else {
        return false
    }
}

let equipmentTotal = document.querySelector('[data-equipment-total]')
let equipmentCurrent = document.querySelector('[data-equipment-current]')
let equipmentControlInner = document.querySelector('[data-equipment-control]')

// ===================================================================
// Функция по включению выключению свайпера в зависимости от экрана
// ===================================================================
const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
    let swiper;
    breakpoint = window.matchMedia(breakpoint);
    const enableSwiper = function (className, settings) {
        swiper = new Swiper(className, settings);
        if (callback) {
            callback(swiper);
        }
    }
    let checkerActiveResizable = function () {
        if (breakpoint.matches) {
            return enableSwiper(swiperClass, swiperSettings);
        } else {
            if (swiper !== undefined) swiper.destroy(true, true);
            return false;
        }

    };

    breakpoint.addEventListener('change', checkerActiveResizable);
    checkerActiveResizable();
    if (document.documentElement.clientWidth < 991) {
        sliderNumber(equipmentTotal,equipmentCurrent,swiper,equipmentControlInner)
    } else {
        return false
    }

}

    resizableSwiper(
        '(max-width: 991px)',
        '[data-equipment-swiper]',
        {
            slidesPerView: 1,
            navigation: {
                nextEl: "[data-equipment-next]",
                prevEl: "[data-equipment-prev]",
            },
            pagination: {
                el: "[data-equipment-pagination]",
                type: "progressbar",
            },
        },
    );


// ==================================================================
// Использование webp для background
// ==================================================================
function canUseWebp() {
    // Создаем элемент canvas
    let elem = document.createElement('canvas');
    // Приводим элемент к булеву типу
    if (!!(elem.getContext && elem.getContext('2d'))) {
        // Создаем изображение в формате webp, возвращаем индекс искомого элемента и сразу же проверяем его
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    // Иначе Webp не используем
    return false;
}

window.onload = function () {
    // Получаем все элементы с дата-атрибутом data-bg
    let images = document.querySelectorAll('[data-bg]');
    // Проходимся по каждому
    for (let i = 0; i < images.length; i++) {
        // Получаем значение каждого дата-атрибута
        let image = images[i].getAttribute('data-bg');
        // Каждому найденному элементу задаем свойство background-image с изображение формата jpg
        images[i].style.backgroundImage = 'url(' + image + ')';
    }

    // Проверяем, является ли браузер посетителя сайта Firefox и получаем его версию
    let isitFirefox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    let firefoxVer = isitFirefox ? parseInt(isitFirefox[1]) : 0;

    // Если есть поддержка Webp или браузер Firefox версии больше или равно 65
    if (canUseWebp() || firefoxVer >= 65) {
        // Делаем все то же самое что и для jpg, но уже для изображений формата Webp
        let imagesWebp = document.querySelectorAll('[data-bg-webp]');
        for (let i = 0; i < imagesWebp.length; i++) {
            let imageWebp = imagesWebp[i].getAttribute('data-bg-webp');
            imagesWebp[i].style.backgroundImage = 'url(' + imageWebp + ')';
        }
    }
};

// ==================================================================
// Открытие popup
// ==================================================================

let popupOpens = document.querySelectorAll('[data-popup-open]')
let popupOpensMin = document.querySelectorAll('[data-popup-min-open]')
let popupMin = document.querySelector('[data-popup-min]')
let popup = document.querySelector('[data-popup]')
let popupBody = document.querySelectorAll('.popup__body')
let closeButton = document.querySelectorAll('[data-close-popup]')

popupOpens.forEach(function (popupOpen) {
    popupOpen.addEventListener('click', function (e) {
        e.preventDefault()
        popup.classList.add('open')
    })
})

popupOpensMin.forEach(function (popupOpenMin) {
    popupOpenMin.addEventListener('click', function (e) {
        e.preventDefault()
        popupMin.classList.add('open')
    })
})

closeButton.forEach(function (el) {
    el.addEventListener('click', function () {
        popup.classList.remove ('open')
        popupMin.classList.remove ('open')
    })
})


popup.addEventListener('click', function (e) {
    popupBody.forEach(function (body) {
        if (!body.contains(e.target)) {
            popup.classList.remove('open')
        }  if (!body.contains(e.target)) {
            popupMin.classList.remove('open')
        }
    })

})

