document.addEventListener('DOMContentLoaded', () => {
    fetch('../json/elegirnos.json')
        .then(response => response.json())
        .then(data => {
            const sliderTrack = document.querySelector('.slider-track');
            data.forEach(item => {
                const slide = document.createElement('div');
                slide.classList.add('slider-slide');
                slide.innerHTML = `
                    <img src="${item.imagen}" alt="${item.titulo}">
                    <div class="slider-content">
                        <h3>${item.titulo}</h3>
                        <p>${item.descripcion}</p>
                    </div>
                `;
                sliderTrack.appendChild(slide);
            });




            const slides = document.querySelectorAll('.slider-slide');
            let activeIndex = 0;
            let autoSlideInterval;

            function updateActiveSlide(newIndex) {
                slides.forEach((slide, index) => {
                    if (index === newIndex) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });
                activeIndex = newIndex;
            }

            function autoSlide() {
                const nextIndex = (activeIndex + 1) % slides.length;
                updateActiveSlide(nextIndex);
            }

            function startAutoSlide() {
                autoSlideInterval = setInterval(autoSlide, 3000);
            }

            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
            }

            startAutoSlide();



            
            slides.forEach((slide, index) => {
                slide.addEventListener('mouseenter', () => {
                    stopAutoSlide();
                    updateActiveSlide(index);
                });

                slide.addEventListener('mouseleave', () => {
                    startAutoSlide();
                });
            });

            updateActiveSlide(0);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
});
