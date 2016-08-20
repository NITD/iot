var express = require('express');
var router = express.Router();

var ctrlLamp = require('../controllers/lamp');
var ctrlSwitchSensor = require('../controllers/switchSensor');
var ctrlMotor = require('../controllers/motor');
var ctrlTank = require('../controllers/tank');
var ctrlGarageDoor = require('../controllers/garageDoor');
var ctrlLevelSensor = require('../controllers/levelSensor');
var ctrlFan = require('../controllers/fan');
var ctrlAll = require('../controllers/all');

//Lamp
router.get('/lamp/:lampid', ctrlLamp.readOne);
router.post('/lamp/:lampid', ctrlLamp.create);
router.put('/lamp/:lampid', ctrlLamp.updateOne);
router.delete('/lamp/:lampid', ctrlLamp.deleteOne);
//Lamp Client
router.get('/lamp/:lampid/client/:type', ctrlLamp.clientReadOne);
router.post('/lamp/:lampid/client/:type', ctrlLamp.clientCreate);
router.delete('/lamp/:lampid/client/:type', ctrlLamp.clientDelete);

//Switch Sensor
router.get('/switchSensor/:switchsensorid', ctrlSwitchSensor.readOne);
router.post('/switchSensor/:switchsensorid', ctrlSwitchSensor.create);
router.put('/switchSensor/:switchsensorid', ctrlSwitchSensor.updateOne);
router.delete('/switchSensor/:switchsensorid', ctrlSwitchSensor.deleteOne);
//Switch Sensor Clients
router.get('/switchSensor/:switchsensorid/client/:type', ctrlSwitchSensor.clientReadAll);
router.post('/switchSensor/:switchsensorid/client/:type', ctrlSwitchSensor.clientCreate);
router.delete('/switchSensor/:switchsensorid/client/:type/:clientid', ctrlSwitchSensor.clientDeleteOne);

//Motor
router.get('/motor/:motorid', ctrlMotor.readOne);
router.post('/motor/:motorid', ctrlMotor.create);
router.put('/motor/:motorid', ctrlMotor.updateOne);
router.delete('/motor/:motorid', ctrlMotor.deleteOne);
//Motor Clients
router.get('/motor/:motorid/client/:type', ctrlMotor.clientReadAll);
router.post('/motor/:motorid/client/:type', ctrlMotor.clientCreate);
router.delete('/motor/:motorid/client/:type/:clientid', ctrlMotor.clientDeleteOne);

//Tank
router.get('/tank/:tankid', ctrlTank.readOne);
router.post('/tank/:tankid', ctrlTank.create);
router.put('/tank/:tankid', ctrlTank.updateOne);
router.delete('/tank/:tankid', ctrlTank.deleteOne);
//Tank Clients
router.get('/tank/:tankid/client/:type', ctrlTank.clientReadAll);
router.post('/tank/:tankid/client/:type', ctrlTank.clientCreate);
router.delete('/tank/:tankid/client/:type/:clientid', ctrlTank.clientDeleteOne);

//Garage Door
router.get('/garagedoor/:garagedoorid', ctrlGarageDoor.readOne);
router.post('/garagedoor/:garagedoorid', ctrlGarageDoor.create);
router.put('/garagedoor/:garagedoorid', ctrlGarageDoor.updateOne);
router.delete('/garagedoor/:garagedoorid', ctrlGarageDoor.deleteOne);
//Garage Door Client
router.get('/garagedoor/:garagedoorid/client/:type', ctrlGarageDoor.clientReadOne);
router.post('/garagedoor/:garagedoorid/client/:type', ctrlGarageDoor.clientCreate);
router.delete('/garagedoor/:garagedoorid/client/:type', ctrlGarageDoor.clientDelete);

//Level Sensor
router.get('/levelSensor/:levelsensorid', ctrlLevelSensor.readOne);
router.post('/levelSensor/:levelsensorid', ctrlLevelSensor.create);
router.put('/levelSensor/:levelsensorid', ctrlLevelSensor.updateOne);
router.delete('/levelSensor/:levelsensorid', ctrlLevelSensor.deleteOne);
//Level Sensor Clients
router.get('/levelSensor/:levelsensorid/client/:type', ctrlLevelSensor.clientReadAll);
router.post('/levelSensor/:levelsensorid/client/:type', ctrlLevelSensor.clientCreate);
router.delete('/levelSensor/:levelsensorid/client/:type/:clientid', ctrlLevelSensor.clientDeleteOne);

//Fan
router.get('/fan/:fanid', ctrlFan.readOne);
router.post('/fan/:fanid', ctrlFan.create);
router.put('/fan/:fanid', ctrlFan.updateOne);
router.delete('/fan/:fanid', ctrlFan.deleteOne);
//Fan Client
router.get('/fan/:fanid/client/:type', ctrlFan.clientReadOne);
router.post('/fan/:fanid/client/:type', ctrlFan.clientCreate);
router.delete('/fan/:fanid/client/:type', ctrlFan.clientDelete);

//All
router.get('/devices', ctrlAll.readAllIds);

module.exports = router;
