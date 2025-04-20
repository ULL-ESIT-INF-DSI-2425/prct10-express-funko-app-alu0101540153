import { Libro , ResponseType } from './libro.js';
import fs from 'fs/promises';
import path from 'path';

const baseDir = '../data/libros';

// Función auxiliar para crear directorio de usuario si no existe
async function ensureUserDir(username: string): Promise<void> {
    try {
        await fs.mkdir(path.join(baseDir, username), { recursive: true });
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;
    }
}

// Añadir un nuevo libro
export async function addLibro(username: string, libro: Libro): Promise<ResponseType> {
    try {
        await ensureUserDir(username);
        const filePath = path.join(baseDir, username, `${libro.id}.json`);
        
        try {
            await fs.access(filePath);
            return { 
                success: false, 
                message: `Ya existe un libro con ID ${libro.id} para el usuario ${username}` 
            };
        } catch {
            await fs.writeFile(filePath, JSON.stringify(libro, null, 2));
            return { 
                success: true, 
                message: 'Libro añadido correctamente',
                libro 
            };
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: 'Error al añadir el libro' 
        };
    }
}

// Obtener un libro específico
export async function getLibro(username: string, id: number): Promise<ResponseType> {
    try {
        const filePath = path.join(baseDir, username, `${id}.json`);
        
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const libro = JSON.parse(data) as Libro;
            return { 
                success: true, 
                libro 
            };
        } catch {
            return { 
                success: false, 
                message: `No se encontró el libro con ID ${id} para el usuario ${username}` 
            };
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: 'Error al obtener el libro' 
        };
    }
}

// Listar todos los libros de un usuario
export async function listLibros(username: string): Promise<ResponseType> {
    try {
        const userDir = path.join(baseDir, username);
        
        try {
            await fs.access(userDir);
            const files = await fs.readdir(userDir);
            const libros: Libro[] = [];

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = await fs.readFile(path.join(userDir, file), 'utf-8');
                    libros.push(JSON.parse(data) as Libro);
                }
            }

            return { 
                success: true, 
                libros 
            };
        } catch {
            return { 
                success: false, 
                message: `No se encontraron libros para el usuario ${username}` 
            };
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: 'Error al listar los libros' 
        };
    }
}

// Eliminar un libro
export async function deleteLibro(username: string, id: number): Promise<ResponseType> {
    try {
        const filePath = path.join(baseDir, username, `${id}.json`);
        
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            return { 
                success: true, 
                message: `Libro con ID ${id} eliminado correctamente` 
            };
        } catch {
            return { 
                success: false, 
                message: `No se encontró el libro con ID ${id} para eliminar` 
            };
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: 'Error al eliminar el libro' 
        };
    }
}

// Actualizar un libro existente
export async function updateLibro(username: string, libro: Libro): Promise<ResponseType> {
    try {
        const filePath = path.join(baseDir, username, `${libro.id}.json`);
        
        try {
            await fs.access(filePath);
            await fs.writeFile(filePath, JSON.stringify(libro, null, 2));
            return { 
                success: true, 
                message: 'Libro actualizado correctamente',
                libro 
            };
        } catch {
            return { 
                success: false, 
                message: `No se encontró el libro con ID ${libro.id} para actualizar` 
            };
        }
    } catch (error) {
        console.error(error);
        return { 
            success: false, 
            message: 'Error al actualizar el libro' 
        };
    }
}