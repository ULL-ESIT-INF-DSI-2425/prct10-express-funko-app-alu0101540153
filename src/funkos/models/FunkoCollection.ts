import { Funko } from "./Funko.js";

/**
 * Clase que gestiona una colección de Funkos.
 */
export class FunkoCollection {
  private funkos: Funko[] = [];

  /**
   * Constructor para crear un colección de Funkos
   * @param initialFunkos - Lista de Funko
   */
  constructor(initialFunkos: Funko[] = []) {
    this.funkos = initialFunkos;
  }

  /**
   * Añade un Funko a la colección, si el ID no esta dentro de la colección
   * @param funko - Funko para añadir a la lista
   * @return `true` si se logro añadir `false` si no se logro añadir.
   */
  addFunko(funko: Funko): boolean {
    if (this.funkos.find((f) => f.id === funko.id)) {
      return false;
    }
    this.funkos.push(funko);
    return true;
  }

  /**
   * Modifica un Funko existe por ID.
   * @param funko - Funko para modificar
   * @param `true` si se modifico y `false` si no se modifico.
   */
  updateFunko(funko: Funko): boolean {
    const index = this.funkos.findIndex((f) => f.id === funko.id);
    if (index === -1) {
      return false;
    }
    this.funkos[index] = funko;
    return true;
  }

  /**
   * Elimina un Funko de la colección por su ID.
   * @param id - ID del Funko a eliminar.
   * @returns `true`si se eliminó, `false` si no se encontró.
   */
  removeFunko(id: number): boolean {
    const index = this.funkos.findIndex((f) => f.id === id);
    if (index === -1) {
      return false;
    }
    this.funkos.splice(index, 1);
    return true;
  }

  /**
   * Devuelve un Funko concreto de la colección por su ID.
   * @param id - ID del Funko buscado.
   * @return El Funko encontrado o `undefined` si no existe.
   */
  getFunko(id: number): Funko | undefined {
    return this.funkos.find((f) => f.id === id);
  }

  /**
   * Lista todos los Funkos de la colección
   * @return Array con todos los Funkos.
   */
  listFunkos(): Funko[] {
    return [...this.funkos];
  }
}
