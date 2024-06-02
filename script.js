function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")

  const paragraph = document.querySelector("#paragraph")
  paragraph.innerHTML = "Fundo claro e usando preto."

  const img = document.querySelector("#profile img")

  if (html.classList.contains("light")) {

    img.setAttribute("src", "./assets/avatar-light.jpg")
    img.style.borderRadius = "100px"

  } else {

    img.setAttribute("src", "./assets/avatar.jpg")
    paragraph.innerHTML = "Cineasta frustrado, só uso preto."
    
  }
}
