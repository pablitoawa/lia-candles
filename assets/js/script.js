var carrito = [];

function agregarProducto(id, imagen, producto, descripcion, precio) {

  let indice = carrito.findIndex(c => c.id === id);

  if (indice === -1) {
    postJSON({
      id: id,
      imagen: imagen,
      producto: producto,
      descripcion: descripcion,
      precio: precio,
      cantidad: 1,
    });
  } else {
    carrito[indice].cantidad++;
    putJSON(carrito[indice]);
  }

  console.log(carrito);
  //actualizarTabla();
  enviarACarritoServidor(datos);
}

function actualizarTabla() {
  let tbody = document.getElementById('tbody');
  let total = 0;

  // Eliminar todas las filas existentes
  tbody.innerHTML = '';

  for (let item of carrito) {
    // Crear una nueva fila
    let fila = document.createElement('tr');

    // Crear las celdas
    let celdaProducto = document.createElement('td');
    let celdaCantidad = document.createElement('td');
    let celdaPrecio = document.createElement('td');
    let celdaBoton = document.createElement('td');

    // Agregar estilos a la celda de producto
    celdaProducto.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.imagen}" alt="" style="width: 45px; height: 45px" class="rounded-circle" />
        <div class="ms-3">
          <p class="fw-bold mb-1" id="prod-name">${item.producto}</p>
          <p class="text-muted mb-0" id="prod-prop">${item.descripcion}</p>
        </div>
      </div>
    `;

    // Agregar estilos a la celda de cantidad
    celdaCantidad.innerHTML = `
      <span class="badge rounded-pill bg-success m-1" id="prod-quantity">${item.cantidad}</span>
    `;

    celdaPrecio.textContent = `${(item.precio * item.cantidad).toFixed(2)}$`;

    // BOTÓN
    let boton = document.createElement("button");
    boton.textContent = "Eliminar";
    boton.classList.add("btn", "btn-danger", "btn-sm");

    celdaBoton.append(boton);

    boton.addEventListener('click', function () {
      deletJSON(item.id);
    });

    // Agregar las celdas a la fila
    fila.appendChild(celdaProducto);
    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaPrecio);
    fila.appendChild(celdaBoton);

    // Agregar la fila al tbody
    tbody.appendChild(fila);

    total = total + item.precio * item.cantidad;
  }

  document.getElementById('total').innerHTML = `${total.toFixed(2)}$`;
}

///////////GUARDAR//////////
async function postJSON(data) {
  try {
    const response = await fetch("http://localhost:3000/carrito", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
    } catch (error) {
    console.log("Error:", error);
  }
}

//////////CARGAR/////////////
async function getJSON(data) {
  try {
    const response = await fetch("http://localhost:3000/carrito", {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);

    carrito=result
    actualizarTabla()

  } catch (error) {
    console.error("Error:", error);
  }
}

window.onload = (event) => {
  getJSON();
};


//////////ACTUALIZAR/////////////
async function putJSON(data) {
    try {
      const response = await fetch(`http://localhost:3000/carrito/${data.id}`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Success:", result);
      
  
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //////////ELIMINAR/////////////
  async function deletJSON(id) {
    try {
      const response = await fetch(`http://localhost:3000/carrito/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Eliminar el elemento del carrito local
        carrito = carrito.filter((item) => item.id !== id);
        actualizarTabla();
        console.log("Elemento eliminado correctamente");
      } else {
        console.error("Error al eliminar el elemento");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }