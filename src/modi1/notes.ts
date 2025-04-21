import fs from "fs";
import { Note, ResponseType } from "./types.js";

export const readNote = (title: string, filePath: string): Promise<ResponseType> => {
  return new Promise<ResponseType>((resolve, reject) => {
    loadNotes(filePath)
      .then((data) => {
        const notes: Note[] = JSON.parse(data);
        const foundNote = notes.find((note) => note.title === title);
        const response: ResponseType = {
          type: "read",
          success: foundNote ? true : false,
          notes: foundNote ? [foundNote] : undefined,
        };
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const loadNotes = (filePath: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(`Error reading notes file: ${err.message}`);
      } else {
        resolve(data.toString());
      }
    });
  });
};