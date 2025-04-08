import { describe, expect, test, beforeEach } from "vitest";
import { Funko } from "../src/funkos/models/Funko.js";
import { FunkoType } from "../src/funkos/models/FunkoType.js";
import { FunkoGenre } from "../src/funkos/models/FunkoGenre.js";

describe("Funko", () => {
  let funko: Funko;

  beforeEach(() => {
    funko = new Funko(
      1,
      "Batman",
      "The Dark Knight",
      FunkoType.Pop,
      FunkoGenre.Animation,
      "DC Comics",
      42,
      true,
      "Glow in the dark",
      99.99
    );
  });

  test("debería crear un Funko correctamente", () => {
    expect(funko.id).toBe(1);
    expect(funko.name).toBe("Batman");
    expect(funko.description).toBe("The Dark Knight");
    expect(funko.type).toBe(FunkoType.Pop);
    expect(funko.genre).toBe(FunkoGenre.Animation);
    expect(funko.franchise).toBe("DC Comics");
    expect(funko.number).toBe(42);
    expect(funko.exclusive).toBe(true);
    expect(funko.specialFeatures).toBe("Glow in the dark");
    expect(funko.marketValue).toBe(99.99);
  });

  test("debería obtener el id correctamente", () => {
    expect(funko.id).toBe(1);
  });

  test("debería obtener el nombre correctamente", () => {
    expect(funko.name).toBe("Batman");
  });

  test("debería obtener la descripción correctamente", () => {
    expect(funko.description).toBe("The Dark Knight");
  });

  test("debería obtener el tipo correctamente", () => {
    expect(funko.type).toBe(FunkoType.Pop);
  });

  test("debería obtener el género correctamente", () => {
    expect(funko.genre).toBe(FunkoGenre.Animation);
  });

  test("debería obtener la franquicia correctamente", () => {
    expect(funko.franchise).toBe("DC Comics");
  });

  test("debería obtener el número correctamente", () => {
    expect(funko.number).toBe(42);
  });

  test("debería obtener si es exclusivo correctamente", () => {
    expect(funko.exclusive).toBe(true);
  });

  test("debería obtener las características especiales correctamente", () => {
    expect(funko.specialFeatures).toBe("Glow in the dark");
  });

  test("debería obtener el valor de mercado correctamente", () => {
    expect(funko.marketValue).toBe(99.99);
  });

  test("debería permitir actualizar el nombre", () => {
    funko.name = "Joker";
    expect(funko.name).toBe("Joker");
  });

  test("debería permitir actualizar la descripción", () => {
    funko.description = "The Clown Prince of Crime";
    expect(funko.description).toBe("The Clown Prince of Crime");
  });

  test("debería permitir actualizar el tipo", () => {
    funko.type = FunkoType.PopRides;
    expect(funko.type).toBe(FunkoType.PopRides);
  });

  test("debería permitir actualizar el género", () => {
    funko.genre = FunkoGenre.MoviesTV;
    expect(funko.genre).toBe(FunkoGenre.MoviesTV);
  });

  test("debería permitir actualizar la franquicia", () => {
    funko.franchise = "Marvel";
    expect(funko.franchise).toBe("Marvel");
  });

  test("debería permitir actualizar el número", () => {
    funko.number = 13;
    expect(funko.number).toBe(13);
  });

  test("debería permitir actualizar si es exclusivo", () => {
    funko.exclusive = false;
    expect(funko.exclusive).toBe(false);
  });

  test("debería permitir actualizar las características especiales", () => {
    funko.specialFeatures = "Metallic finish";
    expect(funko.specialFeatures).toBe("Metallic finish");
  });

  test("debería permitir actualizar el valor de mercado", () => {
    funko.marketValue = 149.99;
    expect(funko.marketValue).toBe(149.99);
  });

  test("debería lanzar error si el valor de mercado es negativo", () => {
    expect(() => {
      new Funko(
        2,
        "Superman",
        "Man of Steel",
        FunkoType.Pop,
        FunkoGenre.Animation,
        "DC Comics",
        7,
        false,
        "None",
        -10
      );
    }).toThrow("El valor de mercado no puede ser negativo.");
  });
});