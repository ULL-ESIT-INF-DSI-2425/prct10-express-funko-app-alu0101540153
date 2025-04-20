import express from 'express';
import { Libro} from './libro.js';
import { getLibro, addLibro, listLibros,  deleteLibro, updateLibro} from './funcionesLibro.js';


export const app = express();
app.disable('x-powered-by');

app.use(express.json()); // Reemplaza bodyParser.json() 

// GET /libros - Listar todos los libros o un libro específico
app.get('/libros', async (req, res) => {
    const username: string = req.query.user as string;
    const id = req.query.id ? Number(req.query.id) : null;

    if (id !== null) {
        const respuesta = await getLibro(username, id);
        res.json(respuesta);
    } else {
        const respuesta = await listLibros(username);
        res.json(respuesta);
    }
});

// POST /libros - Añadir un nuevo libro
app.post('/libros', async (req, res) => {
    const username: string = req.query.user as string;
    const libroNuevo = new Libro(
        req.body.id,
        req.body.titulo,
        req.body.autor,
        req.body.genero,
        req.body.año,
        req.body.paginas
    );

    const respuesta = await addLibro(username, libroNuevo);
    res.json(respuesta);
});

// DELETE /libros - Eliminar un libro
app.delete('/libros', async (req, res) => {
    const username: string = req.query.user as string;
    const id = req.body.id;
    const respuesta = await deleteLibro(username, id);
    res.json(respuesta);
});

// PATCH /libros - Actualizar un libro existente
app.patch('/libros', async (req, res) => {
    const username: string = req.query.user as string;
    const id = Number(req.body.id);
    const libroModificado = new Libro(
        req.body.id,
        req.body.titulo,
        req.body.autor,
        req.body.genero,
        req.body.año,
        req.body.paginas
    );
    
    const respuesta = await getLibro(username, id);
    if (respuesta.success) {
        const respuesta2 = await updateLibro(username, libroModificado);
        res.json(respuesta2);
    } else {
        res.json(respuesta);
    }
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});