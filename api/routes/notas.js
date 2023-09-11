var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.notas
    .findAll({
      attributes: ["id", "primer_parcial", "segundo_parcial", "tp"]
    })
    .then(notas => res.send(notas))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.notas
    .create({ primer_parcial: req.body.primer_parcial, segundo_parcial: req.body.segundo_parcial, tp: req.body.tp })
    .then(notas => res.status(201).send({ id: notas.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findNotas = (id, { onSuccess, onNotFound, onError }) => {
  models.notas
    .findOne({
      attributes: ["id", "primer_parcial", "segundo_parcial", "tp"],
      where: { id }
    })
    .then(notas => (notas ? onSuccess(notas) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findNotas(req.params.id, {
    onSuccess: notas => res.send(notas),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = notas =>
    notas
      .update({ primer_parcial: req.body.primer_parcial, segundo_parcial: req.body.segundo_parcial, tp: req.body.tp }, 
      { fields: ["primer_parcial", "segundo_parcial", "tp"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findNotas(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = notas =>
    notas
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findNotas(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;