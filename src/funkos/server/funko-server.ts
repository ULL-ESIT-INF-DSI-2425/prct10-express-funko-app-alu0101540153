import * as net from "net";
import * as readline from "readline";
import { UserFunkoManager } from "../storage/UserFunkoManager.js";
import { RequestType, ResponseType } from "../types/types.js";

// Configuración del servidor
const PORT = 60300;
const MAX_CONNECTIONS = 10;
const CONNECTION_TIMEOUT = 30000; // 30 segundos

const server = net.createServer((connection) => {
  console.log(" Cliente conectado");

  // Configurar timeout para conexiones inactivas
  connection.setTimeout(CONNECTION_TIMEOUT);
  connection.on("timeout", () => {
    console.log(" Conexión terminada por timeout");
    connection.end();
  });

  const rl = readline.createInterface({
    input: connection,
    output: connection,
    terminal: false
  });

  rl.on("line", async (line) => {
    try {
      if (!line.trim()) {
        throw new Error("La petición está vacía");
      }

      const request: RequestType = JSON.parse(line);
      
      // Validar estructura básica de la petición
      if (!request.user || !request.type) {
        throw new Error("Estructura de petición inválida");
      }

      const manager = new UserFunkoManager(request.user);
      await manager.load().catch(err => {
        throw new Error(`Error al cargar datos del usuario: ${err.message}`);
      });

      let response: ResponseType;

      // Validar tipo de operación
      switch (request.type) {
        case "add":
          if (!request.funko) {
            response = {
              type: "add",
              success: false,
              message: " Falta el Funko a añadir.",
            };
            break;
          }
          
          try {
            const added = await manager.add(request.funko);
            response = {
              type: "add",
              success: added,
              message: added
                ? ` Funko añadido a la colección de ${request.user}.`
                : ` Ya existe un Funko con ID ${request.funko.id}.`,
            };
          } catch (err) {
            throw new Error(`Error al añadir Funko: ${(err as Error).message}`);
          }
          break;

        case "update":
          if (!request.funko) {
            response = {
              type: "update",
              success: false,
              message: " Falta el Funko a modificar.",
            };
            break;
          }
          
          try {
            const updated = await manager.update(request.funko);
            response = {
              type: "update",
              success: updated,
              message: updated
                ? ` Funko actualizado correctamente.`
                : ` No se encontró el Funko con ID ${request.funko.id}.`,
            };
          } catch (err) {
            throw new Error(`Error al actualizar Funko: ${(err as Error).message}`);
          }
          break;

        case "remove":
          if (request.id === undefined) {
            response = {
              type: "remove",
              success: false,
              message: " Falta el ID del Funko a eliminar.",
            };
            break;
          }
          
          try {
            const removed = await manager.remove(request.id);
            response = {
              type: "remove",
              success: removed,
              message: removed
                ? ` Funko eliminado correctamente.`
                : ` No se encontró el Funko con ID ${request.id}.`,
            };
          } catch (err) {
            throw new Error(`Error al eliminar Funko: ${(err as Error).message}`);
          }
          break;

        case "read":
          if (request.id === undefined) {
            response = {
              type: "read",
              success: false,
              message: " Falta el ID del Funko a leer.",
            };
            break;
          }
          
          try {
            const funko = manager.get(request.id);
            response = funko
              ? {
                  type: "read",
                  success: true,
                  message: ` Funko con ID ${request.id} encontrado.`,
                  funkoPops: [funko],
                }
              : {
                  type: "read",
                  success: false,
                  message: ` No se encontró el Funko con ID ${request.id}.`,
                };
          } catch (err) {
            throw new Error(`Error al leer Funko: ${(err as Error).message}`);
          }
          break;

        case "list":
          try {
            const funkos = manager.list();
            response = {
              type: "list",
              success: true,
              message:
                funkos.length > 0
                  ? ` Lista de Funkos de ${request.user}:`
                  : ` No hay Funkos en la colección de ${request.user}.`,
              funkoPops: funkos,
            };
          } catch (err) {
            throw new Error(`Error al listar Funkos: ${(err as Error).message}`);
          }
          break;

        default:
          response = {
            type: request.type,
            success: false,
            message: " Operación no válida.",
          };
      }

      connection.write(JSON.stringify(response) + "\n");
    } catch (error) {
      const errorResponse: ResponseType = {
        type: "error",
        success: false,
        message: " Error procesando la petición: " + (error as Error).message,
      };
      connection.write(JSON.stringify(errorResponse) + "\n");
    } finally {
      connection.end();
    }
  });

  connection.on("error", (err) => {
    console.log(" Error en la conexión:", err.message);
  });

  connection.on("close", () => {
    console.log(" Cliente desconectado");
    rl.close();
  });
});

// Manejo de errores del servidor
server.on("error", (err) => {
  console.error(" Error del servidor:", err.message);
  // Aquí podrías implementar lógica de reintento si es necesario
});

// Limitar el número de conexiones concurrentes
server.maxConnections = MAX_CONNECTIONS;

server.listen(PORT, () => {
  console.log(` Servidor escuchando en el puerto ${PORT}...`);
});

// Manejar cierre del servidor        as
process.on("SIGINT", () => {
  console.log("\n Apagando servidor...");
  server.close(() => {
    console.log("Servidor apagado correctamente.");
    process.exit(0);
  });
});