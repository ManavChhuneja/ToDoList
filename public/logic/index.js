const listElements = document.querySelectorAll("input[type='checkbox']");

listElements.forEach((element) => {
  element.addEventListener("change", () => {
    element.parentNode.classList.toggle("selected");
  });
});
