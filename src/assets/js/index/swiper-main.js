function sliderActive() {
    const productionTab = document.querySelectorAll('[data-production-swiper]');
    const productionTabNext = document.querySelectorAll('[data-production-next]');
    const productionTabPrev = document.querySelectorAll('[data-production-prev]');

    for (let i = 0; i < productionTab.length; i++) {
        productionTab[i].classList.add('production__swiper' + i);
        productionTabNext[i].classList.add('production__button--next' + i);
        productionTabPrev[i].classList.add('production__button--prev' + i);

        const productionTabSwiper = new Swiper('.production__swiper' + i, {
            spaceBetween: 10,
            watchSlidesProgress: true,
            slidesPerView: 1,
            navigation: {
                nextEl: ".production__button--next" + i,
                prevEl: ".production__button--prev" + i,
            },
        });
    }
}

sliderActive()


let swiperStage = new Swiper("[data-stage-swiper]", {
    slidesPerView: 6,
    direction: "vertical",
});
let swiperInfo = new Swiper("[data-info-swiper]", {
    slidesPerView: 1,
    spaceBetween: 10,
    direction: "vertical",
    mousewheel: true,
    thumbs: {
        swiper: swiperStage,
    },
});
let swiperStageD = document.querySelector('[data-info-swiper]')
const destroySwiper = (breakpoint,swiperDestroy, swiper) => {
    breakpoint = window.matchMedia(breakpoint);
    let checkerDestroy = function () {
        let classDel = swiper.querySelector('.stages__info-wrapper')
        if (breakpoint.matches) {
                if (classDel.classList.contains('swiper-wrapper'))classDel.classList.remove('swiper-wrapper')
                if (swiperDestroy !== undefined) {
                    swiperDestroy.destroy(true, true);
            }
        }
        else {
            classDel.classList.add('swiper-wrapper')
        }
    };

    breakpoint.addEventListener('change', checkerDestroy);
    checkerDestroy();
}

if (swiperStageD) destroySwiper('(max-width: 991px)',swiperInfo,swiperStageD)

