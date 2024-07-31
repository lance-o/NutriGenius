document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropbtn");
    const links = dropdown.querySelectorAll(".dropdown-content a");

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const selectedValue = event.target.getAttribute("data-value");
        button.textContent = `${
          button.textContent.split(":")[0]
        }: ${selectedValue}`;
      });
    });
  });
});
