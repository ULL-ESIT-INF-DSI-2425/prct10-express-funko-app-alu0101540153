import { Funko } from "../models/Funko.js";
import { FunkoCollection } from "../models/FunkoCollection.js";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Clase que gestiona la colección de Funkos de un usuario, con persistencia en el sistema de ficheros.
 */
export class UserFunkoManager {
  private collection: FunkoCollection;
  private userDir: string;

  /**
   * Constructor del gestor de Funkos de un usuario.
   * @param username - Nombre del usuario.
   */
  constructor(private username: string) {
    this.userDir = path.join("db", username);
    this.collection = new FunkoCollection();
  }

  /**
   * Carga los Funkos del usuario desde el sistema de archivos.
   */
  async load(): Promise<void> {
    try {
      await fs.mkdir(this.userDir, { recursive: true });
      const files = await fs.readdir(this.userDir);
      const funkos: Funko[] = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const data = await fs.readFile(
            path.join(this.userDir, file),
            "utf-8",
          );
          const funko = JSON.parse(data) as Funko;
          funkos.push(funko);
        }
      }

      this.collection = new FunkoCollection(funkos);
    } catch (err) {
      console.error(`❌ Error cargando los Funkos de ${this.username}:`, err);
    }
  }

  /**
   * Guarda un Funko individual en el sistema de archivos.
   * @param funko - Funko a guardar.
   */
  private async saveFunko(funko: Funko): Promise<void> {
    const filePath = path.join(this.userDir, `${funko.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(funko, null, 2));
  }

  /**
   * Elimina un Funko del sistema de archivos.
   * @param id - ID del Funko.
   */
  private async deleteFunkoFile(id: number): Promise<void> {
    const filePath = path.join(this.userDir, `${id}.json`);
    await fs.unlink(filePath);
  }

  /**
   * Añade un Funko a la colección del usuario.
   */
  async add(funko: Funko): Promise<boolean> {
    const success = this.collection.addFunko(funko);
    if (success) await this.saveFunko(funko);
    return success;
  }

  /**
   * Actualiza un Funko existente.
   */
  async update(funko: Funko): Promise<boolean> {
    const success = this.collection.updateFunko(funko);
    if (success) await this.saveFunko(funko);
    return success;
  }

  /**
   * Elimina un Funko por ID.
   */
  async remove(id: number): Promise<boolean> {
    const success = this.collection.removeFunko(id);
    if (success) await this.deleteFunkoFile(id);
    return success;
  }

  /**
   * Lista todos los Funkos.
   */
  list(): Funko[] {
    return this.collection.listFunkos();
  }

  /**
   * Devuelve un Funko por ID.
   */
  get(id: number): Funko | undefined {
    return this.collection.getFunko(id);
  }
}
