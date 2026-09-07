import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [total, setTotal] = useState(null)
  const [modo, setModo] = useState('login')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [authForm, setAuthForm] = useState({ nombre: '', apellido: '', email: '', password: '' })
  const [productoForm, setProductoForm] = useState({ nombre: '', descripcion: '', precio: '', categoria_id: '' })

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  async function cargarProductos() {
    try {
      const response = await api.get('/productos')
      setProductos(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudieron cargar los productos')
    }
  }

  async function cargarCarrito() {
    if (!token) return
    try {
      const response = await api.get('/carrito', { headers })
      setCarrito(response.data)
      if (response.data[0]?.pedido_id) {
        const totalResponse = await api.get(`/pedido/${response.data[0].pedido_id}/total`, { headers })
        setTotal(totalResponse.data.total)
      } else setTotal(null)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo cargar el carrito')
    }
  }

  useEffect(() => {
    api.get('/productos')
      .then((response) => setProductos(response.data))
      .catch((requestError) => setError(requestError.response?.data?.error || 'No se pudieron cargar los productos'))
  }, [])

  useEffect(() => {
    if (!token) return
    const authHeaders = { Authorization: `Bearer ${token}` }
    api.get('/carrito', { headers: authHeaders })
      .then(async (response) => {
        setCarrito(response.data)
        if (!response.data[0]?.pedido_id) return setTotal(null)
        const totalResponse = await api.get(`/pedido/${response.data[0].pedido_id}/total`, { headers: authHeaders })
        setTotal(totalResponse.data.total)
      })
      .catch((requestError) => setError(requestError.response?.data?.error || 'No se pudo cargar el carrito'))
  }, [token])

  function cambiarAuth(event) {
    setAuthForm({ ...authForm, [event.target.name]: event.target.value })
  }

  async function enviarAuth(event) {
    event.preventDefault()
    setMensaje('')
    setError('')
    try {
      const path = modo === 'login' ? '/auth/login' : '/auth/register'
      const payload = modo === 'login' ? { email: authForm.email, password: authForm.password } : authForm
      const response = await api.post(path, payload)
      if (modo === 'login') {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
        setToken(response.data.token)
        setUsuario(response.data.usuario)
      }
      setMensaje(response.data.mensaje)
      if (modo === 'register') setModo('login')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Error en la solicitud')
    }
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
    setCarrito([])
    setTotal(null)
    setMensaje('Sesión cerrada')
  }

  async function agregar(producto) {
    if (!token) return setError('Iniciá sesión para agregar productos')
    try {
      await api.post('/carrito', { idProducto: producto.id, cantidad: 1 }, { headers })
      setMensaje('Producto agregado al carrito')
      cargarCarrito()
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo agregar el producto')
    }
  }

  async function cambiarCantidad(idDetalle, cantidad) {
    if (cantidad < 1) return
    try {
      await api.put(`/carrito/${idDetalle}`, { cantidad }, { headers })
      cargarCarrito()
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo modificar la cantidad')
    }
  }

  async function crearProducto(event) {
    event.preventDefault()
    try {
      await api.post('/productos', { ...productoForm, precio: Number(productoForm.precio), categoria_id: Number(productoForm.categoria_id) }, { headers })
      setProductoForm({ nombre: '', descripcion: '', precio: '', categoria_id: '' })
      setMensaje('Producto creado correctamente')
      cargarProductos()
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo crear el producto')
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div><p className="eyebrow">AK PIZZAS / API TEST</p><h1>Panel de pruebas</h1></div>
        {usuario && <div className="session"><span>{usuario.email} · {usuario.rol}</span><button onClick={cerrarSesion}>Cerrar sesión</button></div>}
      </header>
      {(mensaje || error) && <div className={error ? 'notice error' : 'notice'}>{error || mensaje}</div>}

      {!token && <section className="auth-panel">
        <div className="section-heading"><span>01</span><h2>{modo === 'login' ? 'Iniciar sesión' : 'Crear usuario'}</h2></div>
        <form onSubmit={enviarAuth} className="form-grid">
          {modo === 'register' && <><label>Nombre<input name="nombre" value={authForm.nombre} onChange={cambiarAuth} required /></label><label>Apellido<input name="apellido" value={authForm.apellido} onChange={cambiarAuth} required /></label></>}
          <label>Email<input type="email" name="email" value={authForm.email} onChange={cambiarAuth} required /></label>
          <label>Contraseña<input type="password" name="password" value={authForm.password} onChange={cambiarAuth} required /></label>
          <button className="primary" type="submit">{modo === 'login' ? 'Entrar' : 'Registrar'}</button>
        </form>
        <button className="link-button" onClick={() => setModo(modo === 'login' ? 'register' : 'login')}>{modo === 'login' ? 'Probar registro' : 'Volver al login'}</button>
      </section>}

      <section className="content-grid">
        <div className="products-panel">
          <div className="section-heading"><span>02</span><h2>Productos</h2><button onClick={cargarProductos}>Actualizar</button></div>
          <div className="product-list">{productos.length ? productos.map((producto) => <article className="product" key={producto.id}><div><h3>{producto.nombre}</h3><p>{producto.descripcion || 'Sin descripción'}</p></div><div className="product-action"><strong>${producto.precio}</strong><button onClick={() => agregar(producto)} disabled={!token}>Agregar</button></div></article>) : <p className="empty">No hay productos disponibles.</p>}</div>
        </div>
        <aside className="cart-panel">
          <div className="section-heading"><span>03</span><h2>Carrito</h2></div>
          {!token ? <p className="empty">Iniciá sesión para ver tu carrito.</p> : carrito.length ? <>{carrito.map((item) => <div className="cart-item" key={item.id}><div><strong>{item.nombre}</strong><small>${item.precio_unitario} c/u</small></div><div className="quantity"><button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button><span>{item.cantidad}</span><button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button></div></div>)}<div className="total"><span>Total</span><strong>${total}</strong></div></> : <p className="empty">El carrito está vacío.</p>}
        </aside>
      </section>

      {usuario?.rol === 'admin' && <section className="admin-panel"><div className="section-heading"><span>04</span><h2>Nuevo producto</h2></div><form onSubmit={crearProducto} className="form-grid"><label>Nombre<input value={productoForm.nombre} onChange={(event) => setProductoForm({ ...productoForm, nombre: event.target.value })} required /></label><label>Precio<input type="number" min="0" value={productoForm.precio} onChange={(event) => setProductoForm({ ...productoForm, precio: event.target.value })} required /></label><label>Categoría ID<input type="number" min="1" value={productoForm.categoria_id} onChange={(event) => setProductoForm({ ...productoForm, categoria_id: event.target.value })} required /></label><label>Descripción<input value={productoForm.descripcion} onChange={(event) => setProductoForm({ ...productoForm, descripcion: event.target.value })} /></label><button className="primary" type="submit">Crear producto</button></form></section>}
    </main>
  )
}

export default App
