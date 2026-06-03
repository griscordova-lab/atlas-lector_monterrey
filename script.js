const recorrido = document.querySelector("#recorrido");
const pista = document.querySelector("#pista");
const progreso = document.querySelector("#progreso");

function medirDesplazamiento() {
  return Math.max(0, pista.scrollWidth - window.innerWidth);
}

function actualizarRecorrido() {
  if (window.matchMedia("(max-width: 820px)").matches) {
    pista.style.transform = "translateX(0)";
    progreso.style.width = "0%";
    return;
  }

  const inicio = recorrido.offsetTop;
  const final = recorrido.offsetTop + recorrido.offsetHeight - window.innerHeight;
  if (final <= inicio) return;

  const avance = (window.scrollY - inicio) / (final - inicio);
  const porcentaje = Math.min(1, Math.max(0, avance));
  const desplazamiento = medirDesplazamiento() * porcentaje;

  pista.style.transform = `translateX(${-desplazamiento}px)`;
  progreso.style.width = `${porcentaje * 100}%`;
}

window.addEventListener("scroll", actualizarRecorrido, { passive: true });
window.addEventListener("resize", actualizarRecorrido);
actualizarRecorrido();