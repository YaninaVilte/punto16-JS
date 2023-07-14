let bebidas = [];


fetch("../productos.json")
    .then(response => response.json())
    .then(data => {
        bebidas = data;
        renderizarBebidas(bebidas);
    })


const contenedorBebidas = document.getElementById("contenedorBebidas");
let botonAgregar = document.querySelectorAll(".botonAgregar");
const numeroCarrito = document.getElementById("numeroCarrito");

function renderizarBebidas(bebidasEnStore) {

    contenedorBebidas.innerHTML = "";

    bebidasEnStore.forEach(bebida => {
        const div = document.createElement("div");
        div.classList.add("claseBebidas");
        div.setAttribute("category", bebida.category);
        div.innerHTML = `
        <div class="cardBebidas">
        <img src="${bebida.img}"></img>     
        <p class="categoria">${bebida.category}</p>
        <strong><h5 class="nombre">${bebida.nombre}</h5></strong>
        <p class="precio">$ ${bebida.precio}</p>
        <button id="${bebida.id}" class="botonAgregar">Agregar al carrito</button>
        </div>`;


        contenedorBebidas.append(div)

    });

    botonAgregar = document.querySelectorAll(".botonAgregar");

    botonAgregar.forEach(boton => {
        boton.addEventListener("click", agregarBebidaCarrito);

    });
}

renderizarBebidas(bebidas)

let bebidasCarrito;

const bebidasCarritoLocalStorage = JSON.parse(localStorage.getItem("carrito"))
if (bebidasCarritoLocalStorage) {
    bebidasCarrito = bebidasCarritoLocalStorage;
    let numeroCarritoActualizado = bebidasCarrito.reduce((acc, bebida) => acc + bebida.cantidad, 0);
    numeroCarrito.innerText = numeroCarritoActualizado;
} else {
    bebidasCarrito = []
}


function agregarBebidaCarrito(e) {

    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "black",
            borderRadius: "2rem",
            color: "white",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function agregarBebidaCarrito(id) { }
    }).showToast();

    const idBebida = parseInt(e.currentTarget.id);

    const bebidaAgregada = bebidas.find(bebida => bebida.id === idBebida)

    if (bebidasCarrito.some(bebida => bebida.id === idBebida)) {
        const index = bebidasCarrito.findIndex(bebida => bebida.id === idBebida);
        bebidasCarrito[index].cantidad++
    } else {
        bebidaAgregada.cantidad = 1;
        bebidasCarrito.push(bebidaAgregada)
    }

    let numeroCarritoActualizado = bebidasCarrito.reduce((acc, bebida) => acc + bebida.cantidad, 0);
    numeroCarrito.innerText = numeroCarritoActualizado;

    localStorage.setItem('carrito', JSON.stringify(bebidasCarrito));
}


document.addEventListener("DOMContentLoaded", function () {
    const categoryBebidas = document.querySelectorAll(".categoria_bebida");
    categoryBebidas[0].classList.add("ct_filtro-active");

    categoryBebidas.forEach(function (categoryBebida) {
        categoryBebida.addEventListener("click", function () {
            let catProduct = categoryBebida.getAttribute("category");

            categoryBebidas.forEach(function (ca) {
                ca.classList.remove("ct_filtro-active");
            });
            categoryBebida.classList.add("ct_filtro-active");

            const claseBebidas = document.querySelectorAll(".claseBebidas");
            claseBebidas.forEach(function (bebida) {
                bebida.style.display = "none";
            });
            const claseBebidasToShow = document.querySelectorAll(`.claseBebidas[category="${catProduct}"]`);
            claseBebidasToShow.forEach(function (bebidaToShow) {
                bebidaToShow.style.display = "block";
            });
        });
    });

    const categoryAll = document.querySelector(".categoria_bebida[category='all']");
    categoryAll.addEventListener("click", function () {
        const claseBebidas = document.querySelectorAll(".claseBebidas");
        claseBebidas.forEach(function (bebida) {
            bebida.style.display = "block";
        });
    });

    const search = document.getElementById("search");
    search.addEventListener("input", function () {
        const query = search.value.trim().toLowerCase();
        const claseBebidas = document.querySelectorAll(".claseBebidas");

        claseBebidas.forEach(function (bebida) {
            if (
                bebida.querySelector(".botonAgregar").id.toLowerCase().includes(query) ||
                bebida.querySelector(".nombre").textContent.toLowerCase().includes(query) ||
                bebida.querySelector(".precio").textContent.toLowerCase().includes(query) ||
                bebida.getAttribute("category").toLowerCase().includes(query)
            ) {
                bebida.style.display = "block";
            } else {
                bebida.style.display = "none";
            }
        });
    });
});