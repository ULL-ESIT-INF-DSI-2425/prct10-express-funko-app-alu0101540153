import express from "express";
import { readNote } from "./notes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTES_PATH = path.join(__dirname, "notes.json");


export const app = express();


app.get("/notes", (req, res) => {
  if (!req.query.title) {
    res.send({
      error: "A title has to be provided",
    });
  } else {
    readNote(req.query.title as string, NOTES_PATH)
      .then((data) => {
        if (!data.success) {
          res.send({
            error: `No note was found`,
          });
        } else {
          res.send({
            notes: data.notes,
          });
        }
      })
      .catch((err) => {
        res.send({
          error: err,
        });
      });
  }
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});