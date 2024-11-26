fetch('../json/modal.json')
  .then(response => response.json())
  .then(data => {
    const servicios = data.servicios;
    const modal = document.getElementById("myModal");
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");
    const closeModalBtn = document.querySelector(".close");

    document.querySelectorAll('.card').forEach((card, index) => {
      card.addEventListener('click', () => {
        const servicio = servicios[index];

        modalImage.src = servicio.image;
        modalTitle.textContent = servicio.title;
        modalText.textContent = servicio.text;

        modal.style.display = "flex";
      });
    });

    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    });
  })
  .catch(error => console.error('Error al cargar el archivo JSON:', error));
