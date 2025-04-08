import yargs from "yargs";
import chalk from "chalk";
import * as net from "net";
import { hideBin } from "yargs/helpers";
import { Funko } from "../models/Funko.js";
import { FunkoType } from "../models/FunkoType.js";
import { FunkoGenre } from "../models/FunkoGenre.js";
import { RequestType, ResponseType } from "../types/types.js";

/**
 * Muestra la respuesta del servidor con colores.
 */
function handleResponse(socket: net.Socket) {
  let dataBuffer = "";

  socket.on("data", (chunk) => {
    dataBuffer += chunk.toString();
  });

  socket.on("end", () => {
    try {
      const response: ResponseType = JSON.parse(dataBuffer);
      if (response.success) {
        console.log(chalk.green(response.message));
        if (response.funkoPops) {
          response.funkoPops.forEach((funko) => {
            console.log(chalk.cyan(`\nID: ${funko.id} - ${funko.name}`));
            console.log(`  Descripción: ${funko.description}`);
            console.log(`  Tipo: ${funko.type}`);
            console.log(`  Género: ${funko.genre}`);
            console.log(`  Franquicia: ${funko.franchise}`);
            console.log(`  Nº en franquicia: ${funko.number}`);
            console.log(`  Exclusivo: ${funko.exclusive ? "Sí" : "No"}`);
            console.log(`  Características: ${funko.specialFeatures}`);
            console.log(`  Valor de mercado: ${funko.marketValue}€`);
          });
        }
      } else {
        console.log(chalk.red(response.message));
      }
    } catch {
      console.log(
        chalk.red(" Error al interpretar la respuesta del servidor."),
      );
    }
  });

  socket.on("error", (err) => {
    console.log(
      chalk.red(" Error de conexión con el servidor:"),
      err.message,
    );
  });
}

yargs(hideBin(process.argv))
  .command(
    "add",
    "Añade un nuevo Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
      name: { type: "string", demandOption: true },
      desc: { type: "string", demandOption: true },
      type: {
        type: "string",
        choices: Object.values(FunkoType),
        demandOption: true,
      },
      genre: {
        type: "string",
        choices: Object.values(FunkoGenre),
        demandOption: true,
      },
      franchise: { type: "string", demandOption: true },
      number: { type: "number", demandOption: true },
      exclusive: { type: "boolean", default: false },
      features: { type: "string", demandOption: true },
      value: { type: "number", demandOption: true },
    },
    (argv) => {
      const funko = new Funko(
        argv.id,
        argv.name,
        argv.desc,
        argv.type as FunkoType,
        argv.genre as FunkoGenre,
        argv.franchise,
        argv.number,
        argv.exclusive,
        argv.features,
        argv.value,
      );

      const request: RequestType = {
        type: "add",
        user: argv.user,
        funko,
      };

      const socket = net.connect({ port: 60300 });

      socket.write(JSON.stringify(request) + "\n");

      handleResponse(socket);
    },
  )
  .command(
    "update",
    "Modifica un Funko existente",
    {
      user: {
        type: "string",
        demandOption: true,
        description: "Nombre de usuario",
      },
      id: { type: "number", demandOption: true },
      name: { type: "string", demandOption: true },
      desc: { type: "string", demandOption: true },
      type: {
        type: "string",
        choices: Object.values(FunkoType),
        demandOption: true,
      },
      genre: {
        type: "string",
        choices: Object.values(FunkoGenre),
        demandOption: true,
      },
      franchise: { type: "string", demandOption: true },
      number: { type: "number", demandOption: true },
      exclusive: { type: "boolean", default: false },
      features: { type: "string", demandOption: true },
      value: { type: "number", demandOption: true },
    },
    (argv) => {
      const funko = new Funko(
        argv.id,
        argv.name,
        argv.desc,
        argv.type as FunkoType,
        argv.genre as FunkoGenre,
        argv.franchise,
        argv.number,
        argv.exclusive,
        argv.features,
        argv.value,
      );

      const request: RequestType = {
        type: "update",
        user: argv.user,
        funko,
      };

      const socket = net.connect({ port: 60300 });
      socket.write(JSON.stringify(request) + "\n");
      handleResponse(socket);
    },
  )

  .command(
    "remove",
    "Elimina un Funko por su ID",
    {
      user: {
        type: "string",
        demandOption: true,
        description: "Nombre de usuario",
      },
      id: {
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const request: RequestType = {
        type: "update",
        user: argv.user,
        id: argv.id,
      };

      const socket = net.connect({ port: 60300 });
      socket.write(JSON.stringify(request) + "\n");
      handleResponse(socket);
    },
  )

  .command(
    "read",
    "Muestra un Funko concreto por ID",
    {
      user: {
        type: "string",
        demandOption: true,
        description: "Nombre de usuario",
      },
      id: {
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const request: RequestType = {
        type: "read",
        user: argv.user,
        id: argv.id,
      };

      const socket = net.connect({ port: 60300 });

      socket.write(JSON.stringify(request) + "\n");

      handleResponse(socket);
    },
  )

  .command(
    "list",
    "Lista todos los funkos de un usuario",
    {
      user: {
        type: "string",
        demandOption: true,
      },
    },

    (argv) => {
      const request: RequestType = {
        type: "list",
        user: argv.user,
      };

      const socket = net.connect({ port: 60300 });
      socket.write(JSON.stringify(request) + "\n");
      handleResponse(socket);
    },
  )

  .help()
  .parse();
