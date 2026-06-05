const whatsappBase =
  "https://wa.me/34642159647?text=Hola%2C%20vengo%20de%20la%20web%20y%20quiero%20informaci%C3%B3n%20sobre%20una%20moto%20%2F%20servicio%20de%20taller.";
const whatsappNumber = "34642159647";

// Stock de ejemplo. Sustituir por motos reales del cliente: modelo, precio, fotos, año, km y estado.
const motorcycles = [
  {
    type: "new",
    brand: "Honda",
    model: "Vision 110",
    price: "Desde 2.299 EUR",
    year: "Nueva",
    km: "0 km",
    state: "Motos nuevas",
    image: "assets/new-motos.png",
  },
  {
    type: "new",
    brand: "Beta",
    model: "RR / Enduro",
    price: "Consultar",
    year: "Nueva",
    km: "0 km",
    state: "Concesionario Beta",
    image: "assets/hero-workshop.png",
  },
  {
    type: "new",
    brand: "Rieju",
    model: "Gama 125",
    price: "Consultar",
    year: "Nueva",
    km: "0 km",
    state: "Pedido disponible",
    image: "assets/new-motos.png",
  },
  {
    type: "used",
    brand: "Kawasaki",
    model: "Ocasión revisada",
    price: "Consultar",
    year: "2022",
    km: "Km pendientes",
    state: "Segunda mano",
    image: "assets/used-moto-workshop.png",
  },
  {
    type: "used",
    brand: "Honda",
    model: "Scooter ocasión",
    price: "Consultar",
    year: "2021",
    km: "Km pendientes",
    state: "Revisada en taller",
    image: "assets/used-moto-workshop.png",
  },
  {
    type: "used",
    brand: "GasGas",
    model: "Off-road ocasión",
    price: "Consultar",
    year: "2020",
    km: "Km pendientes",
    state: "Segunda mano",
    image: "assets/hero-workshop.png",
  },
];

const grid = document.querySelector("[data-motorcycle-grid]");
const filterButtons = document.querySelectorAll("[data-filter]");
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappForms = document.querySelectorAll("[data-whatsapp-form]");

function motorcycleLabel(type) {
  return type === "new" ? "Nueva" : "Segunda mano";
}

function renderMotorcycles(filter = "all") {
  const visibleMotorcycles = motorcycles.filter((motorcycle) => filter === "all" || motorcycle.type === filter);

  grid.innerHTML = visibleMotorcycles
    .map(
      (motorcycle) => `
        <article class="moto-card">
          <figure>
            <img src="${motorcycle.image}" alt="${motorcycle.brand} ${motorcycle.model}" loading="lazy" />
            <span class="moto-badge">${motorcycleLabel(motorcycle.type)}</span>
          </figure>
          <div class="moto-body">
            <div class="moto-meta">
              <span>${motorcycle.brand}</span>
              <span>${motorcycle.year}</span>
              <span>${motorcycle.km}</span>
            </div>
            <h3>${motorcycle.model}</h3>
            <span class="moto-price">${motorcycle.price}</span>
            <a class="button button-primary" href="${whatsappBase}" target="_blank" rel="noreferrer">
              Consultar disponibilidad
            </a>
          </div>
        </article>
      `
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((currentButton) => currentButton.classList.remove("is-active"));
    button.classList.add("is-active");
    renderMotorcycles(button.dataset.filter);
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("is-menu-open", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  });
});

function valueFromForm(form, name) {
  return new FormData(form).get(name)?.toString().trim() || "";
}

function buildServiceMessage(form) {
  const wantsNotification = form.querySelector('[name="aviso"]')?.checked ? "Sí" : "No";

  return [
    "Hola, vengo de la web y quiero solicitar cita de taller.",
    "",
    `Nombre: ${valueFromForm(form, "nombre")}`,
    `Teléfono: ${valueFromForm(form, "telefono")}`,
    `Moto: ${valueFromForm(form, "moto")}`,
    `Servicio: ${valueFromForm(form, "servicio")}`,
    `Aviso al finalizar reparación: ${wantsNotification}`,
    `Detalles: ${valueFromForm(form, "detalles") || "Sin detalles adicionales"}`,
  ].join("\n");
}

function buildMotoMessage(form) {
  return [
    "Hola, vengo de la web y estoy buscando una moto.",
    "",
    `Marca preferida: ${valueFromForm(form, "marca")}`,
    `Tipo de moto: ${valueFromForm(form, "tipo")}`,
    `Presupuesto: ${valueFromForm(form, "presupuesto") || "Por definir"}`,
    `Estado: ${valueFromForm(form, "estado")}`,
    `Comentarios: ${valueFromForm(form, "comentarios") || "Sin comentarios adicionales"}`,
  ].join("\n");
}

whatsappForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const message = form.dataset.formType === "service" ? buildServiceMessage(form) : buildMotoMessage(form);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
});

renderMotorcycles();
