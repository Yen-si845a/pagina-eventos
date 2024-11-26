  const slides = document.querySelectorAll('.slider-slide');
  let activeIndex = 2; 
  let isReversing = false; 


  function updateActiveSlide(newIndex) {
      slides.forEach((slide) => {
          slide.classList.remove('active', 'left', 'right');

          const content = slide.querySelector('.slider-content');
          content.style.opacity = '0'; 
      });

      activeIndex = newIndex;
      slides[activeIndex].classList.add('active');

    
      const activeContent = slides[activeIndex].querySelector('.slider-content');
      activeContent.style.opacity = '1'; 

      
      const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
      const nextIndex = (activeIndex + 1) % slides.length;

      slides[prevIndex].classList.add('left');
      slides[nextIndex].classList.add('right');

      
      const containerWidth = document.querySelector('.slider-container').offsetWidth;
      const slideWidth = slides[0].offsetWidth + 30; 

      const offset = -(slideWidth * (activeIndex - 1)) + (containerWidth / 2) - (slideWidth / 2) - 230;
      document.querySelector('.slider-track').style.transform = `translateX(${offset}px)`;
  }

  function autoSlide() {
      if (isReversing) {
          const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
          updateActiveSlide(prevIndex);

          if (prevIndex === 0) {
              isReversing = false; 
          }
      } else {
          const nextIndex = (activeIndex + 1) % slides.length;
          updateActiveSlide(nextIndex);

          if (nextIndex === slides.length - 1) {
              isReversing = true; 
          }
      }
  }

  
  let autoSlideInterval = setInterval(autoSlide, 3000);

  slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
          updateActiveSlide(index);
          resetSlider(); 
      });
  });

  let inactivityTimer;
  function resetSlider() {
      clearTimeout(inactivityTimer);
      clearInterval(autoSlideInterval); 
      autoSlideInterval = setInterval(autoSlide, 5000); 
      inactivityTimer = setTimeout(() => {
          activeIndex = 2; 
          updateActiveSlide(activeIndex);
      }, 5000); 
  }


  updateActiveSlide(activeIndex);
  resetSlider(); 
