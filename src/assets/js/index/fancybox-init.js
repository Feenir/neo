/*
===================================================================
Fancybox для главной странице видео о компании (hero-block)
==================================================================
*/

let fancyboxContainer = document.querySelectorAll('[data-fancybox-container]')

if (fancyboxContainer) {
    for (let i = 0; i < fancyboxContainer.length; i++) {
        let fancyboxSlide = fancyboxContainer[i].querySelectorAll('[data-fancybox]')
        for(let j = 0;j < fancyboxSlide.length; j++) {
            fancyboxSlide[j].setAttribute(`data-fancybox`, `${fancyboxSlide[j].dataset.fancybox}-${i}`)
            Fancybox.bind(`[data-fancybox="${fancyboxSlide[j].dataset.fancybox}"]`, {
                // Your custom options
            });
        }
    }

}


Fancybox.bind(`[data-fancybox="certificate"]`, {
    // Your custom options
});




