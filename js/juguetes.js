let inputText = document.getElementById("text-search-js")
let checkboxes = document.getElementById("filtro")
let container = document.getElementById("container")
let reinicio = document.getElementById("reiniciar")
let inputsNumber = document.getElementById("botonRango")
let carritoProductos = []
let productosStorage = localStorage.getItem("Juguetes")
productosStorage = JSON.parse(productosStorage) || []
let juguetesSeleccionado = localStorage.getItem("Juguetes")
juguetesSeleccionado = JSON.parse(juguetesSeleccionado) || []
let medicamentoSeleccionado = localStorage.getItem("Medicamento")
medicamentoSeleccionado = JSON.parse(medicamentoSeleccionado) ||[]
let productoSeleccionado = []
productoSeleccionado = productoSeleccionado.concat(medicamentoSeleccionado)
productoSeleccionado = productoSeleccionado.concat(juguetesSeleccionado)

async function mindyJuguetes() {
    try {
        let datos = await fetch("https://apipetshop.herokuapp.com/api/articulos?tipo=Juguete")
        let products = await datos.json()
        let productos = products.response
        let juguetes = tipo(productos, "Juguete").sort((a,b) =>{ return a.stock -b.stock})
        
        cardCreator(juguetes)
        menorStock(juguetes)
        inputsNumber.addEventListener("click", () => { range(juguetes) })
        inputText.addEventListener("keyup", () => {
            filtroText(range(juguetes), inputText.value)
        })
        reinicio.addEventListener("click", () => {
            cardCreator(juguetes) })
    }
    catch (error) {
        console.log(error);
    }
}
function nroCarrito(array){
    if (array.length!==0){
        let length = array.length
        let nroCarrito= document.getElementById("nro-carrito-js")
        nroCarrito.innerHTML=
     `  ${length}
     ` 
         
    }
    
}


nroCarrito(productoSeleccionado)
function eventoComprar(contenedorClass,array) {
    let botonCarrito = document.querySelectorAll(contenedorClass)
        botonCarrito.forEach( e => {
            e.addEventListener("click", (e) =>{
               /*  botonCarrito.classList.add("bg-dark") */
              cambiarColor(e.target);
                
                const botonTarget = e.target
                let productoFiltrado = []
                productoFiltrado  = array.filter(e => {return e._id === botonTarget.id})
                carritoProductos = carritoProductos.concat(productoFiltrado)
                localStorage.setItem("Juguetes",JSON.stringify(carritoProductos))
                
                return carritoProductos
            })
        })
}
mindyJuguetes()
/// funcion que filtra por tipo de producto
function tipo(array, propiedad) {
    let filtrado = array.filter(array => array.tipo == [propiedad])
    return (filtrado)
}

function cardCreator(array) {
    document.getElementById("container").innerHTML = ""
    if (array.length > 0) {
        array.forEach(card => {
            if(card.stock<=3){
                document.getElementById("container").innerHTML +=` 
                <div class="card ultimos">
                <div class="card-img">
                <img src="${card.imagen}" alt="${card.nombre}" />
                </div>
                <div class="card-info">
                  <p class="text-title">${card.nombre}</p>
                  <p class="text-body">${card.descripcion}</p>
                </div>
                <div class="card-footer">
                <span class="text-title">$${card.precio}</span>
                <span class="text-title">Stock:  ${card.stock}</span>
                <div class="card-button " >
                <button class="compra btn" id=${card._id}>
                  comprar
                </button>
                </div>
                </div>
                `

            }else{
            document.getElementById("container").innerHTML +=` 
            <div class="card">
            <div class="card-img">
            <img src="${card.imagen}" alt="${card.nombre}" />
            </div>
            <div class="card-info">
              <p class="text-title">${card.nombre}</p>
              <p class="text-body">${card.descripcion}</p>
            </div>
            <div class="card-footer">
            <span class="text-title">$${card.precio}</span>
            <span class="text-title">Stock:  ${card.stock}</span>
            <div class="card-button " >
            <button class="compra btn" id=${card._id}>
              comprar
            </button>
            </div>
            </div>
            `}})
    } else {
        document.getElementById("container").innerHTML =`
        <h2>No se puede encontrar productos con este nombre</h2>`
    }
    eventoComprar(".compra",array)
   
}
function range(array) {
    document.getElementById("container").innerHTML = ""
    let min = document.getElementById("minimo")
    let max = document.getElementById("maximo")
    let precioFiltrado = array.filter(e => (min.value <= e.precio && e.precio <= max.value))
    cardCreator(precioFiltrado)
    if(precioFiltrado.length=== 0){
        document.getElementById("container").innerHTML = ""
        cardCreator(array)
        return array
    }
    return array
}
//cambiar color
function cambiarColor(id){
    console.log(id.id)
    productosStorage.filter(function(e){
    e.id== id
    id.className="bg-success border rounded"
    id.innerHTML="Agregado"
    })
   
  }
  

function filtroText(array, texto) {
    document.getElementById("container").innerHTML = ""
    let arrayFiltrado = array.filter(producto => producto.nombre.toLowerCase().includes(texto.toLowerCase() || producto.descripcion.toLowerCase().includes(texto.toLowerCase()) || producto.precio == texto))
    cardCreator(arrayFiltrado)
    if(inputText.value.length== 0){
        document.getElementById("container").innerHTML = ""
        cardCreator(array)
        return array
    }
    return arrayFiltrado
}

function prodNotFound() {
    container.innerHTML = `
    <div class="card ">
    <p class="card-text"> <span class="fw-bold">"${inputText.value}"</span> No encontramos un producto que se ajuste a tu búsqueda.. </p>
  </div>
    `
}

//functon lessstock

function menorStock(array){
    
    let arrayFiltrado= array.filter(producto=> producto.stock <= 3)
    arrayFiltrado.forEach(card=> {
        card.className="bg-danger"
        
    })
    
}
