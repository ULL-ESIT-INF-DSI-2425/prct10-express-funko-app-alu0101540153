import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest';
import { app } from '../src/ejemplosExpress/app.js'; // Importa tu aplicación Express
import fs from 'fs/promises';
import path from 'path';


const username = 'testuser';
const baseDir = path.join('../data/libros', username);

const libroTest = {
  id: 1,
  titulo: 'Cien años de soledad',
  autor: 'Gabriel García Márquez',
  genero: 'Realismo mágico',
  año: 1967,
  paginas: 471
};

beforeAll(async () => {
  try {
    await fs.rm(baseDir, { recursive: true, force: true }); // limpia el directorio de test
  } catch {}
});

afterAll(async () => {
  try {
    await fs.rm(baseDir, { recursive: true, force: true }); // limpia después de las pruebas
  } catch {}
});

describe('📚 API de Libros', () => {
  test('🟢 Debería añadir un libro correctamente', async () => {
    const res = await request(app)
      .post('/libros?user=' + username)
      .send(libroTest);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.libro.titulo).toBe(libroTest.titulo);
  });

  test('🟢 Debería obtener el libro recién añadido', async () => {
    const res = await request(app)
      .get(`/libros?user=${username}&id=${libroTest.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.libro.titulo).toBe(libroTest.titulo);
  });

  test('🟢 Debería listar todos los libros del usuario', async () => {
    const res = await request(app).get(`/libros?user=${username}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.libros.length).toBeGreaterThan(0);
  });

  test('🟢 Debería actualizar un libro existente', async () => {
    const libroActualizado = { ...libroTest, titulo: 'Cien años de soledad (Edición especial)' };

    const res = await request(app)
      .patch(`/libros?user=${username}`)
      .send(libroActualizado);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.libro.titulo).toBe(libroActualizado.titulo);
  });

  test('🟢 Debería eliminar el libro', async () => {
    const res = await request(app)
      .delete(`/libros?user=${username}`)
      .send({ id: libroTest.id });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('🔴 No debería encontrar el libro eliminado', async () => {
    const res = await request(app)
      .get(`/libros?user=${username}&id=${libroTest.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
  });
});