import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

/*
  MVC:  Modelo|Vista|Controlador -> Patron de arquitectura.
  Patron de diseño, repetible y facil de hacer para solucionar algo en concreto
  Patron de arquitectura: Encapsula como construyes y organizas toda tu app

  MODELO: Reptresenta la logica, estructura y regals de negocio (como acceder a la bd, ver integridad de datos, si creamos una id)
  VISTA: Representa la interfaz del usuario, presentarle los datos, enviar las acciones desde la vista
  CONTROLADOR: Actua como intermediario entre el modelo y la vista, que responde a las entradas del usuario

  Modelo envia datos a Controlador
  Controlador incializa Vista
  Usuario mediante Vista envia acciones
  Controlador
  */

// Configuracion inicial
const PORT = process.env.PORT ?? 3000
const app = express()
// Desactivar cabecera
app.disable('x-powered-by')
// Detectamos si hay que hacer una transformacion para los JSON y acceder al req.body directamente
app.use(json())
app.use(corsMiddleware())

// PARA CORS tenemos
// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// en los metodos complejos tenemos los CORS PRE-Flight
// requerimos una peticion especial llamada OPTIONS

// Rutas
app.get('/', (req, res) => {
  res
    .status(200)
    .send('Página principal')
})

app.use('/movies', moviesRouter)
/*
Ya no hariamos esto ya que el use acoge todo
app.get('/movies', )
app.get('/movies/:id', )
app.post('/movies', )
app.patch('/movies/:id', )
app.delete('/movies/:id', )
*/

// Escuchando puerto
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
  console.log(`http://localhost:${PORT}`)
  console.log('-------------------------------------')
})

// REST Representational State Transfer
// REST es una Arquitectura de Software
/* Sus principios son:
  - Escalabilidad
  - Simplicidad
  - Visibilidad
  - Portabilidad
  - Fiabilidad
  - Facid de modificar
  Sus fundaentos:
  - Recursos: Todo es considerado un recurso (listas, entidades, colecciones)
    - Cada recurso se identifica con una URL
  - metodos: Verbos HTTP (GET; PUT, PATCH, DELETE, ...)
    - Se utilizan para definir las opreaciones que se puede realizar con los recursos
  - Representaciones: Pueden ser multiples representaciones (json, xml, html, ...)
    - El cliente decide la representacion del recurso
  - Stateless: Cada solicitud que se haga debe contener toda la info necesaria para entender la solicitud
    - El servidor no debe mantener ningun estado sobre el cliente entre solicitudes
    - es decir, no puede guardar info sino que debe ir en la url para que el servidor sepa que tiene que hacer, no tiene que tener un estado
    - El cliente debe enviar toda la info necesaria para procesar la request
  - Interfaz uniforme: Tiene que ser consistente y uniforme entre todas las interacciones
  - Separacion de conceptos: Los componenetes del cliente y el servidor estan separados entre si
    - Asi mismo el cliente y el servidor evolucionan de forma separada
  */
