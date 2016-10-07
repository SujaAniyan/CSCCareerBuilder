'use strict';

var constants         = require('../../scripts/constants');
var dataService     = require(constants.paths.services + '/feedbacks');

var controller = {}

controller.getAll     = getAll;
controller.create     = create;

controller.getOneById = getOneById;
controller.updateById = updateById;
controller.deleteById = deleteById;

module.exports = controller;


//call  getAll() function from the Feedbacks service
function getAll(req,res){
  dataService.getAll()
    .then(function(data){
        if (data){
            res.send(data);
        }else {
            res.sendStatus(404);
        }
    })
    .catch(function (err){
        console.log("exception" + err);
        res.status(500).send(err);
    });
}


//call  getOneById() function from the Feedbacks service
function getOneById(req,res){
  dataService.getOneById(req.params.id)
    .then(function(data){
        if (data){
            res.send(data);
        }else {
            res.sendStatus(404);
        }
    })
    .catch(function (err){
        console.log("exception" + err);
        res.status(500).send(err);
    });
}


//call  create() function from the Feedbacks service
function create(req, res) {
  dataService.create(req.body)
    .then(function () {
        res.status(200).send("Doc added successfully");
    })
    .catch(function (err) {
        console.log("cntrl create: err - " + err);
        res.status(500).send(err);
    });
}


//call  deleteById() function from the Feedbacks service
function deleteById(req, res) {
  dataService.deleteById(req.params.id)
    .then(function () {
        res.status(200).send("Doc deleted successfully");
    })
    .catch(function (err) {
        console.log("controller delete err: " + err);
        res.status(500).send(err);
    });
}


//call  updateById() function from the Feedbacks service
function updateById(req, res) {
  dataService.updateById(req.params.id, req.body)
    .then(function () {
        res.status(200).send("Doc updated successfully");
    }) 
    .catch(function (err) {
        console.log(err);
        res.status(500).send(err);
    });
}
