// =========================
// DATOS
// =========================

let espacios = [];

// Cargar CSV
Promise.all([
  d3.csv("DATA/matriz.csv"),
  d3.csv("DATA/amenidades.csv"),
  d3.csv("DATA/servicios.csv"),
  d3.csv("DATA/geolocalizacion.csv")
])
.then(([matriz, amenidades, servicios, geo]) => {

  console.log("Matriz:", matriz);
  console.log("Geo:", geo);

  // IMPORTANTE:
  // Si geolocalizacion.csv usa la columna "sitio"
  const geoMap = new Map(
    geo.map(d => [d.sitio, d])
  );

  espacios = matriz.map(d => ({
    ...d,
    ...(geoMap.get(d.nombre) || {})
  }));

  console.log("Espacios fusionados:", espacios);
  console.log(espacios.slice(0,5));

  // Llenar municipios automáticamente

  const municipios = [
    ...new Set(
      geo.map(d => d.municipio)
    )
  ]
  .filter(Boolean)
  .sort();

  const selectorMunicipio =
    document.getElementById("municipio");

  // Limpiar opciones previas
  selectorMunicipio.innerHTML =
    '<option value="">Todos los municipios</option>';

  municipios.forEach(municipio => {

    const option =
      document.createElement("option");

    option.value = municipio;
    option.textContent = municipio;

    selectorMunicipio.appendChild(option);

  });

})
.catch(error => {
  console.error("Error cargando CSV:", error);
});

// =========================
// BOTÓN BUSCAR
// =========================

document
  .getElementById("buscar")
  .addEventListener("click", () => {

    const tipo =
      document.getElementById("tipo").value;

    const municipio =
      document.getElementById("municipio").value;

    const resultados = espacios.filter(d => {

      const coincideTipo =
        !tipo || d.tipo === tipo;

      const coincideMunicipio =
        !municipio || d.municipio === municipio;

      return coincideTipo && coincideMunicipio;

    });

    document.getElementById("contador").textContent =
      `${resultados.length} espacios encontrados`;

    document.getElementById("resultados").innerHTML =
      resultados.map(d => `
        <div class="resultado">
          <h3>${d.nombre || ""}</h3>
          <p>${d.direccion || ""}</p>
          <p><strong>${d.subtipo || ""}</strong></p>
        </div>
      `).join("");

});

// =========================
// CARRUSEL HORIZONTAL
// =========================

// =========================
// CARRUSEL HORIZONTAL
// =========================

const recorrido =
  document.querySelector("#recorrido");

const pista =
  document.querySelector("#pista");

const progreso =
  document.querySelector("#progreso");

if (recorrido && pista && progreso) {

  function medirDesplazamiento() {
    return Math.max(
      0,
      pista.scrollWidth - window.innerWidth
    );
  }

  function actualizarRecorrido() {

    if (
      window.matchMedia("(max-width: 820px)")
        .matches
    ) {
      pista.style.transform =
        "translateX(0)";
      progreso.style.width =
        "0%";
      return;
    }

    const inicio =
      recorrido.offsetTop;

    const final =
      recorrido.offsetTop +
      recorrido.offsetHeight -
      window.innerHeight;

    if (final <= inicio) return;

    const avance =
      (window.scrollY - inicio) /
      (final - inicio);

    const porcentaje =
      Math.min(
        1,
        Math.max(0, avance)
      );

    const desplazamiento =
      medirDesplazamiento() *
      porcentaje;

    pista.style.transform =
      `translateX(${-desplazamiento}px)`;

    progreso.style.width =
      `${porcentaje * 100}%`;
  }

  window.addEventListener(
    "scroll",
    actualizarRecorrido,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    actualizarRecorrido
  );

  window.addEventListener(
    "load",
    actualizarRecorrido
  );

  actualizarRecorrido();
}