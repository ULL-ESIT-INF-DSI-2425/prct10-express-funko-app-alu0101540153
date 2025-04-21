import { describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../src/modi1/app.js";
import fs from "fs";
import path from "path";


const NOTES_FILE_PATH = path.join(__dirname, "../src/modi1/notes.json");

describe("Notes API", () => {


  describe("GET /notes", () => {
    test("debea dar error si no le pasamos un tílo", () => {
      return request(app)
        .get("/notes")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            error: "A title has to be provided"
          });
        });
    });

    test("debia devolver la cndo existe", () => {
      return request(app)
        .get("/notes?title=test1")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            notes: [{
              title: "test1",
              body: "body1",
              color: "green"
            }]
          });
        });
    });

    test("deria dar rror cuando la ota no existe", () => {
      return request(app)
        .get("/notes?title=notexist")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            error: "No note was found"
          });
        });
    });

    test("deeria manjar erroes de lectura arcivo", () => {
      const originalContent = fs.readFileSync(NOTES_FILE_PATH);
      
      fs.unlinkSync(NOTES_FILE_PATH);

      return request(app)
        .get("/notes?title=test1")
        .expect(200)
        .then((response) => {
          expect(response.body.error).toMatch("Error reading notes file");
        })
        .finally(() => {
          fs.writeFileSync( NOTES_FILE_PATH, originalContent);
        });
    });
  });
});