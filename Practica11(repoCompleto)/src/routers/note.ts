import express from 'express';
import { Funko } from '../models/note.js';

export const funkoRouter = express.Router();

funkoRouter.post('/funkos', (req, res) => {
  const funko = new Funko(req.body);

  funko.save().then((funko) => {
    res.status(201).send(funko);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

funkoRouter.get('/funkos', (req, res) => {
  const filter = req.query.nombre?{nombre: req.query.nombre.toString()}:{};

  Funko.find(filter).then((funkos) => {
    if (funkos.length !== 0) {
      res.send(funkos);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});


funkoRouter.patch('/funkos', (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send({
      error: 'A nombre must be provided in the query string',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  }else {
    const allowedUpdates = [
      'nombre', 
      'descripcion', 
      'tipo', 
      'genero', 
      'franquicia', 
      'numero', 
      'exclusivo', 
      'caracteristicasEspeciales', 
      'valorDeMercado'
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'no se pudo actualizar',
      });
    } else {
      Funko.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((funko) => {
        if (!funko) {
          res.status(404).send();
        } else {
          res.send(funko);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});


funkoRouter.delete('/funkos', (req, res) => {
  if (!req.query.nombre) {
    res.status(400).send({
      error: 'A nombre must be provided',
    });
  } else {
    Funko.findOneAndDelete({nombre: req.query.nombre.toString()}).then((note) => {
      if (!note) {
        res.status(404).send();
      } else {
        res.send(note);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});
