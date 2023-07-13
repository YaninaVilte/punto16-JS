document.addEventListener("DOMContentLoaded", ecommercePuntoDieciseis);

let bebidas;

let carritoTitulo = document.getElementById("carrito-titulo");


function ecommercePuntoDieciseis() {
    cargarCarritoDeLocalStorage()
    obtenerBebidas().then(data => {
        bebidas = data;
        renderizarProductos(bebidas);
        renderizarCarrito();
    });
}


async function obtenerBebidas() {
    const respuesta = await fetch("./productos.json");
    const bebidas = await respuesta.json();
    return bebidas;
}

let contenedorCarrito = [];

function renderizarProductos(bebidas) {
    const $contenedorBebidas = document.getElementById("contenedorBebidas");
    
    bebidas.forEach((bebida) => {
        let contenedor = document.createElement("div");
        contenedor.classList.add("claseBebidas");
        contenedor.setAttribute("category", bebida.category);
        contenedor.innerHTML = `
        <div class="cardBebidas">
        <img src="${bebida.img}"></img>     
        <p class="categoria">${bebida.category}</p>
        <strong><h5 class="nombre">${bebida.nombre}</h5></strong>
        <p class="precio">$ ${bebida.precio}</p>
        <p class="id">ID: ${bebida.id}</p> 
        <button class="agregarAlCarrito">Agregar al carrito</button>
        </div>`;
        
        $contenedorBebidas.appendChild(contenedor)
        contenedor.querySelector('button')
        .addEventListener('click', () => {
            agregarAlCarrito(bebida.id);
        });
    });
}

function agregarAlCarrito(id) {
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
        onClick: function agregarAlCarrito (id) { }
    }).showToast();

    let contenedor = bebidas.find(contenedor => contenedor.id == id);
    let productoEnCarrito = contenedorCarrito.find(contenedor => contenedor.id == id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        contenedor.cantidad = 1;
        contenedorCarrito.push(contenedor);
    }
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}


function renderizarCarrito() {
    const $carrito = document.getElementById("carrito");

    let carritoVacio = document.getElementById("carrito-vacio");
    let textoActual = carritoVacio.textContent;

    $carrito.innerHTML = '';
    let totalCarrito = 0;
    let totalCantidad = 0;

    contenedorCarrito.forEach((bebida, index) => {
        let contenedor = document.createElement('div')
        contenedor.classList.add("card");
        contenedor.innerHTML = `
        <h5 class="nombre"><small>Producto</small><br>${bebida.nombre}</h5> 
        <img class="imagen" src="${bebida.img}"></img>
        <p class="cantidad"><small>Cantidad</small><br> ${bebida.cantidad}</p>
        <p class="precio"><small>Precio</small><br>$ ${bebida.precio}</p>
        <p class="subtotal"><small>Subtotal</small><br>$ ${bebida.precio * bebida.cantidad}</p>
        <button id="${contenedor.id}" class="eliminardelcarrito">Eliminar del carrito</button>
    `;
        $carrito.appendChild(contenedor);

        contenedor.querySelector('button').addEventListener('click', () => {
            eliminarProductoDelCarrito(index);
        });

        totalCarrito += bebida.precio * bebida.cantidad;
        totalCantidad += bebida.cantidad;
    });

    if (totalCantidad >= 1) {
        
        const totalElement = document.createElement('div');
        totalElement.classList.add("totalCompra");
        totalElement.innerHTML = `
        <p class="total">Total $ ${totalCarrito}</p>
        <button class="continuarCompra" id="continuarCompra">Finalizar compra</button>
        <button class="vaciarCarrito" id="vaciarCarrito">Vaciar carrito</button>
        `;
        $carrito.appendChild(totalElement);


        const vaciarCarritoBtn = document.getElementById("vaciarCarrito");
        vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
        const comprarCarritoBtn = document.getElementById("continuarCompra");
        comprarCarritoBtn.addEventListener('click', graciasPorComprar);
        carritoVacio.textContent = "";
    }
    else {
        carritoVacio.textContent = "Tu carrito está vacío. ¡Agrega productos!";
    }

    const cantidadCarrito = document.getElementById("cantidadCarrito");
    let nuevaCantidad = totalCantidad;
    cantidadCarrito.innerText = nuevaCantidad;
}

function graciasPorComprar() {
    contenedorCarrito = [],
    guardarCarritoEnLocalStorage(),
    renderizarCarrito(),
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Gracias por tu compra!',
        showConfirmButton: false,
        timer: 1500
      })
}

function vaciarCarrito() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: '¿Estás seguro?',
        text: "¡Tus productos se van a borrar del carrito!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, quiero borrarlos!',
        cancelButtonText: 'No, quiero continuar!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Listo!',
                'Tu carrito fue eliminado!',
                'warning',
                contenedorCarrito = [],
                guardarCarritoEnLocalStorage(),
                renderizarCarrito(),
            )
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Tus productos están a salvo',
                'Podés continuar con la compra :)',
                'success'
            )
        }
    })

}



function eliminarProductoDelCarrito(indice) {
    contenedorCarrito[indice].cantidad--;

    if (contenedorCarrito[indice].cantidad === 0) {
        contenedorCarrito.splice(indice, 1);
    }
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(contenedorCarrito));
}

function cargarCarritoDeLocalStorage() {
    if (localStorage.getItem('carrito') !== null) {
        contenedorCarrito = JSON.parse(localStorage.getItem('carrito'));
    } else {
        contenedorCarrito = [];
    }
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
                bebida.querySelector(".id").textContent.toLowerCase().includes(query) ||
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