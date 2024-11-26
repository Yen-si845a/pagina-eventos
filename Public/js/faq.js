// Función para cargar el archivo JSON
async function loadFAQ() {
  try {
      const response = await fetch('../json/faq.json');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return await response.json();
  } catch (error) {
      console.error('Error al cargar el FAQ:', error);
  }
}

async function initFAQ() {
  const data = await loadFAQ();
  if (!data || !data.answers) {
      console.error('No se encontraron respuestas en el archivo JSON');
      return;
  }

  const answers = data.answers; 

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answerParagraph = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
          const key = question.getAttribute('data-key');

          if (!answerParagraph.textContent) {
              answerParagraph.textContent = answers[key];
          }

          item.classList.toggle('active'); 
          answerParagraph.style.display = answerParagraph.style.display === 'block' ? 'none' : 'block'; 
      });
  });
}

initFAQ();
