import { FunkoType } from "./FunkoType.js";
import { FunkoGenre } from "./FunkoGenre.js";

/**
 * Clase que representa un Funko Pop coleccionable.
 */
export class Funko {
  /**
   * Constructor de un Funko.
   * @param id - Identificador único del Funko.
   * @param name - Nombre del Funko.
   * @param description - Descripción del Funko.
   * @param type - Tipo de Funko.
   * @param genre - Género del Funko.
   * @param franchise - Franquicia a la que pertenece el Funko.
   * @param number - Número del Funko dentro de la franquicia.
   * @param exclusive - Si es exclusivo o no.
   * @param specialFeatures - Característica especiales del Funko.
   * @param marketValue - Valor de mercado en euros.
   */
  constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public type: FunkoType,
    public genre: FunkoGenre,
    public franchise: string,
    public number: number,
    public exclusive: boolean,
    public specialFeatures: string,
    public marketValue: number,
  ) {
    if (marketValue < 0) {
      throw new Error("El valor de mercado no puede ser negativo.");
    }
  }
}
