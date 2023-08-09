function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")

  const paragraph = document.querySelector("#paragraph")
  paragraph.innerHTML = "Fundo claro e usando preto."


  // pegar a tag img
  const img = document.querySelector("#profile img")

  // substituir a imagem
  if (html.classList.contains("light")) {
    // se tiver light mode, adicionar a imagem light
    img.setAttribute("src", "./assets/avatar-light.jpg")
    img.style.borderRadius = "100px"
  } else {
    // set tiver sem light mode, manter a imagem normal
    img.setAttribute("src", "./assets/avatar.jpg")
    paragraph.innerHTML = "Cineasta frustrado, só uso preto."
  }
}
