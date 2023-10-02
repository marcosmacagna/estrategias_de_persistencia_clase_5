var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.materias
    .findAll({
      attributes: ["id", "nombre", "horas_totales", "id_carrera"],

      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],

      //include:[{as:'profe-materia', model:models.profesor, attributes: ["id","nombre", "apellido", "dni", "id_materia"]}]

    })
    .then(materias => res.send(materias)).catch(error => { return next(error)});
});

router.post("/", (req, res) => {
  models.materias
    .create({ nombre: req.body.nombre, horas_totales: req.body.horas_totales, id_carrera: req.body.id_carrera })
    .then(materias => res.status(201).send({ id: materias.id }))
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

const findMaterias = (id, { onSuccess, onNotFound, onError }) => {
  models.materias
    .findOne({
      attributes: ["id", "nombre", "horas_totales", "id_carrera"],
      where: { id }
    })
    .then(materias => (materias ? onSuccess(materias) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findMaterias(req.params.id, {
    onSuccess: materias => res.send(materias),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = materias =>
    materias
      .update({ nombre: req.body.nombre, horas_totales: req.body.horas_totales, id_carrera: req.body.id_carrera }, 
      { fields: ["nombre", "horas_totales", "id_carrera"] })
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
    findMaterias(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = materias =>
    materias
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMaterias(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;