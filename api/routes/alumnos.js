var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.alumnos
    .findAll({
      attributes: ["id", "nombre", "apellido", "dni", "id_carrera"],

      include:[{as:'carrera', model:models.carrera, attributes: ["id","nombre"]}]

    })
    .then(carreras => res.send(carreras)).catch(error => { return next(error)});
});

router.post("/", (req, res) => {
  models.alumnos
    .create({ nombre: req.body.nombre, apellido: req.body.apellido, dni: req.body.dni, id_carrera: req.body.id_carrera })
    .then(alumnos => res.status(201).send({ id: alumnos.id }))
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

const findalumnos = (id, { onSuccess, onNotFound, onError }) => {
  models.alumnos
    .findOne({
      attributes: ["id", "nombre", "apellido", "dni", "id_carrera"],
      where: { id }
    })
    .then(alumnos => (alumnos ? onSuccess(alumnos) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findalumnos(req.params.id, {
    onSuccess: alumnos => res.send(alumnos),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = alumnos =>
    alumnos
      .update({ nombre: req.body.nombre, apellido: req.body.apellido, dni: req.body.dni, id_carrera: req.body.id_carrera }, 
      { fields: ["nombre", "apellido", "dni", "id_carrera"] })
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
    findalumnos(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = alumnos =>
    alumnos
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findalumnos(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;