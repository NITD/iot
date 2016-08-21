var socket = io.connect('http://localhost:3000', { query: 'type=app&appType=control' });

var deviceData = null;
var deviceStatus = null;
var currentStatusPage = {
	type: null,
	id: null
};

function showDevices(d) {
	if (!d) {
		return;
	}
	var deviceWrap = $('#device-wrap');
	var str = '';
	str += '<h3>Lamps</h3>';
	if (d.lamps) {
		str += '<div class="space-top-xs clearfix">';
		for (id in d.lamps) {
			if (!d.lamps.hasOwnProperty(id)) {
				continue;
			}
			str += '<section id="lamp-' + id + '" class="col col-2 device-cell device">'
				+ '<img class="lamp-' + id + '" src="assets/images/lamp.png">'
				+ '<h4 class="space-top-xs">' + id + '</h4>'
				+ "</section>";
		}
		str += '</div>';
	}
	str += '<a id="lamp-add-new" class="btn space-top-xs list-btn add-new-btn">Add New</a>';
	str += '<h3 class="space-top">Garage Doors</h3>';
	if (d.garagedoors) {
		str += '<div class="space-top-xs clearfix">';
		for (id in d.garagedoors) {
			if (!d.garagedoors.hasOwnProperty(id)) {
				continue;
			}
			str += '<section id="garagedoor-' + id + '" class="col col-2 device-cell device">'
				+ '<img class="garagedoor-' + id + '" src="assets/images/garage.png">'
				+ '<h4 class="space-top-xs">' + id + '</h4>'
				+ "</section>";
		}
		str += '</div>';
	}
	str += '<a id="garagedoor-add-new" class="btn space-top-xs list-btn add-new-btn">Add New</a>';
	str += '<h3 class="space-top">Switch Sensors</h3>';
	if (d.switchsensors) {
		str += '<div class="space-top-xs clearfix">';
		for (id in d.switchsensors) {
			if (!d.switchsensors.hasOwnProperty(id)) {
				continue;
			}
			str += '<section id="switchsensor-' + id + '" class="col col-2 device-cell device">'
				+ '<img class="switchsensor-' + id + '" src="assets/images/switch.png">'
				+ '<h4 class="space-top-xs">' + id + '</h4>'
				+ "</section>";
		}
		str += '</div>';
	}
	str += '<a id="switchsensor-add-new" class="btn space-top-xs list-btn add-new-btn">Add New</a>';
	str += '<h3 class="space-top">Fans</h3>';
	if (d.fans) {
		str += '<div class="space-top-xs clearfix">';
		for (id in d.fans) {
			if (!d.fans.hasOwnProperty(id)) {
				continue;
			}
			str += '<section id="fan-' + id + '" class="col col-2 device-cell device">'
				+ '<img class="fan-' + id + '" src="assets/images/fan.png">'
				+ '<h4 class="space-top-xs">' + id + '</h4>'
				+ "</section>";
		}
		str += '</div>';
	}
	str += '<a id="fan-add-new" class="btn space-top-xs list-btn add-new-btn">Add New</a>';
	str += '<h3 class="space-top">Level Sensors</h3>';
	if (d.levelsensors) {
		str += '<div class="space-top-xs clearfix">';
		for (id in d.levelsensors) {
			if (!d.levelsensors.hasOwnProperty(id)) {
				continue;
			}
			str += '<section id="levelsensor-' + id + '" class="col col-2 device-cell device">'
				+ '<div class="level-sensor-wrap--list">'
				+ '<div class="level-sensor--list levelsensor-' + id + '">'
				+ '</div>'
				+ '</div>'
				+ '<h4 class="space-top-xs">' + id + '</h4>'
				+ "</section>";
		}
		str += '</div>';
	}
	str += '<a id="levelsensor-add-new" class="btn space-top-xs list-btn add-new-btn">Add New</a>';
	str += '<h3 class="space-top">Motors</h3>';
	if (d.motors) {
		str += '<div class="space-top-xs clearfix">';
		for (id in d.motors) {
			if (!d.motors.hasOwnProperty(id)) {
				continue;
			}
			str += '<section id="motor-' + id +'" class="col col-2 device-cell device">'
				+ '<img class="motor-' + id + '" src="assets/images/motor.png">'
				+ '<h4 class="space-top-xs">' + id + '</h4>'
				+ "</section>";
		}
		str += '</div>';
	}
	str += '<a id="motor-add-new" class="btn space-top-xs list-btn add-new-btn">Add New</a>';
	str += '<h3 class="space-top">Tanks</h3>'
	if (d.tanks) {
		str += '<div class="space-top-xs clearfix">';
		for (id in d.tanks) {
			if (!d.tanks.hasOwnProperty(id)) {
				continue;
			}
			str += '<section id="tank-' + id + '" class="col col-2 device-cell device">'
				+ '<div class="tank--list tank-' + id + '">'
				+ '<div class="tank-level--list">'
				+ '</div>'
				+ '</div>'
				+ '<h4 class="space-top-xs">' + id + '</h4>'
				+ "</section>";
		}
		str += '</div>';
	}
	str += '<a id="tank-add-new" class="btn space-top-xs list-btn add-new-btn">Add New</a>';
	deviceWrap.html(str);
}

function updateDeviceStatus(d) {
	if (!d) {
		return;
	}
	if (d.lamp) {
		for (id in d.lamp) {
			if (!d.lamp.hasOwnProperty(id)) {
				continue;
			}
			if (d.lamp[id].status === 'on') {
				$('.lamp-' + id).attr('src', 'assets/images/lamp-on.png');
			} else if (d.lamp[id].status === 'off') {
				$('.lamp-' + id).attr('src', 'assets/images/lamp-off.png');
			}
		}
	}
	if (d.garageDoor) {
		for (id in d.garageDoor) {
			if (!d.garageDoor.hasOwnProperty(id)) {
				continue;
			}
			if (d.garageDoor[id].status === 'open') {
				$('.garagedoor-' + id).attr('src', 'assets/images/garage-open.png');
			} else if (d.garageDoor[id].status === 'closed') {
				$('.garagedoor-' + id).attr('src', 'assets/images/garage-closed.png');
			}
		}
	}
	if (d.switchSensor) {
		for (id in d.switchSensor) {
			if (!d.switchSensor.hasOwnProperty(id)) {
				continue;
			}
			if (d.switchSensor[id].status === 'on') {
				$('.switchsensor-' + id).attr('src', 'assets/images/switch-on.png');
			} else if (d.switchSensor[id].status === 'off') {
				$('.switchsensor-' + id).attr('src', 'assets/images/switch-off.png');
			}
		}
	}
	if (d.fan) {
		for (id in d.fan) {
			if (!d.fan.hasOwnProperty(id)) {
				continue;
			}
			if (d.fan[id].status === 'on') {
				$('.fan-' + id).attr('src', 'assets/images/fan-on.png');
				$('.fan-' + id).css('animation', parseInt(3000 - d.fan[id].level / 100 * 2700, 10) + 'ms linear infinite rotate');
			} else if (d.fan[id].status === 'off') {
				$('.fan-' + id).attr('src', 'assets/images/fan-off.png');
				$('.fan-' + id).css('animation', 'none');
			}
		}
	}
	if (d.levelSensor) {
		for (id in d.levelSensor) {
			if (!d.levelSensor.hasOwnProperty(id)) {
				continue;
			}
			if (d.levelSensor[id].status === 'on') {
				$('.levelsensor-' + id).parent().css('border-color', '#07ff57');
				$('.levelsensor-' + id).css({
					'background-color': '#07ff57',
					'left': parseInt(d.levelSensor[id].level * 90 / 100 + 5, 10) + '%'
				});
			} else if (d.levelSensor[id].status === 'off') {
				$('.levelsensor-' + id).parent().css('border-color', 'white');
				$('.levelsensor-' + id).css({
					'background-color': 'white',
					'left': '5%'
				});
			}
		}
	}
	if (d.motor) {
		for (id in d.motor) {
			if (!d.motor.hasOwnProperty(id)) {
				continue;
			}
			if (d.motor[id].status === 'on') {
				$('.motor-' + id).attr('src', 'assets/images/motor-on.png');
			} else if (d.motor[id].status === 'off') {
				$('.motor-' + id).attr('src', 'assets/images/motor-off.png');
			}
		}
	}
	if (d.tank) {
		for (id in d.tank) {
			if (!d.tank.hasOwnProperty(id)) {
				continue;
			}
			if (d.tank[id].status === 'on') {
				$('.tank-' + id).css('border-color', '#07ff57');
				$('.tank-' + id + ' .tank-level--list').css({
					'background-color': '#07ff57',
					'height': d.tank[id].level / deviceData.tanks[id].capacity * 90 + '%'
				});
			} else if (d.tank[id].status === 'off') {
				$('.tank-' + id).css('border-color', 'white');
				$('.tank-' + id + ' .tank-level--list').css({
					'background-color': 'white',
					'height': d.tank[id].level / deviceData.tanks[id].capacity * 90 + '%'
				});
			}
		}
	}
}

function updateStatusPage(type, id) {
	if (!type || !id) {
		return;
	}
	var str = '';
	str += '<div class="clearfix">'
		+ '<h3 class="pull-left">Status</h3>'
		+ '<div class="status-div">';
	if (type === 'lamp') {
		$('#device-image-page').html('<img src="assets/images/lamp.png" class="device--page lamp-' + id + '">');
		if (deviceStatus.lamp && deviceStatus.lamp[id]) {
			str += deviceStatus.lamp[id].status;
		} else {
			$('#device-image-page img').attr('src', 'assets/images/lamp.png');
			str += 'off';
		}
	} else if (type === 'garagedoor') {
		$('#device-image-page').html('<img src="assets/images/garage.png" class="device--page garagedoor-' + id + '">');
		if (deviceStatus.garageDoor && deviceStatus.garageDoor[id]) {
			str += deviceStatus.garageDoor[id].status;
		} else {
			$('#device-image-page img').attr('src', 'assets/images/garage.png');
			str += 'closed';
		}
	} else if (type === 'switchsensor') {
		$('#device-image-page').html('<img src="assets/images/switch.png" class="device--page switchsensor-' + id + '">');
		if (deviceStatus.switchSensor && deviceStatus.switchSensor[id]) {
			str += deviceStatus.switchSensor[id].status;
		} else {
			$('#device-image-page img').attr('src', 'assets/images/switch.png');
			str += 'off';
		}
	} else if (type === 'fan') {
		$('#device-image-page').html('<img src="assets/images/fan.png" class="device--page fan-' + id + '">');
		if (deviceStatus.fan && deviceStatus.fan[id]) {
			str += deviceStatus.fan[id].status;
		} else {
			$('#device-image-page img').attr('src', 'assets/images/fan.png');
			str += 'off';
		}
		str += '</div>'
			+ '</div>'
			+ '<div class="clearfix space-top-xs">'
			+ '<h3 class="pull-left">Speed</h3>'
			+ '<div class="status-div">';
		if (deviceStatus.fan && deviceStatus.fan[id]) {
			str += deviceStatus.fan[id].level;
		} else {
			str += '0';
		}
	} else if (type === 'levelsensor') {
		var str2 = '';
		str2 += '<div class="level-sensor-wrap--list device--page h-center">'
			+ '<div class="level-sensor--list levelsensor-' + id + '">'
			+ '</div>'
			+ '</div>';
		$('#device-image-page').html(str2);
		if (deviceStatus.levelSensor && deviceStatus.levelSensor[id]) {
			str += deviceStatus.levelSensor[id].status;
		} else {
			str += 'off';
		}
		str += '</div>'
			+ '</div>'
			+ '<div class="clearfix space-top-xs">'
			+ '<h3 class="pull-left">Level</h3>'
			+ '<div class="status-div">';
		if (deviceStatus.levelSensor && deviceStatus.levelSensor[id]) {
			str += deviceStatus.levelSensor[id].level;
		} else {
			$('.levelsensor-' + id).parent().css('border-color', '#777');
			$('.levelsensor-' + id).css({
				'background-color': '#777',
				'left': '5%'
			});
			str += '0';
		}
	} else if (type === 'motor') {
		$('#device-image-page').html('<img src="assets/images/motor.png" class="device--page motor-' + id + '">');
		if (deviceStatus.motor && deviceStatus.motor[id]) {
			str += deviceStatus.motor[id].status;
		} else {
			$('#device-image-page img').attr('src', 'assets/images/motor.png');
			str += 'off';
		}
	} else if (type === 'tank') {
		var str2 = '';
		str2 += '<div class="tank--list tank-' + id + ' device--page h-center">'
			+ '<div class="tank-level--list">'
			+ '</div>'
			+ '</div>';
		$('#device-image-page').html(str2);
		if (deviceStatus.tank && deviceStatus.tank[id]) {
			if (deviceStatus.tank[id].status === 'off') {
				str += 'not requesting';
			} else {
				str += 'requesting';
			}
		} else {
			str += 'not requesting';
		}
		str += '</div>'
			+ '</div>'
			+ '<div class="clearfix space-top-xs">'
			+ '<h3 class="pull-left">Level</h3>'
			+ '<div class="status-div">';
		if (deviceStatus.tank && deviceStatus.tank[id]) {
			str += deviceStatus.tank[id].level + ' litres';
		} else {
			$('.tank-' + id).css('border-color', '#777');
			$('.tank-' + id + ' .tank-level--list').css({
				'background-color': '#777',
				'height': 0
			});
			str += '0 litres';
		}
	}
	str += '</div>'
		+ '</div>';
	$('#device-status-page').html(str);
}

function updateInfoPage(type, id) {
	if (!deviceData || !type || !id) {
		return;
	}
	var str = '';
	str += '<p class="space-top-small">';
	if (type === 'lamp') {
		str += 'A lamp with id '
			+ '<span">' + id + '</span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true">' + deviceData.lamps[id].name + '</span>'
			+ ' which consumes '
			+ '<span class="editable watts-input" contenteditable="true">' + deviceData.lamps[id].watts + '</span>'
			+ ' watts of power.'
	} else if (type === 'garagedoor') {
		str += 'A garage door with id '
			+ '<span>' + id + '</span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true">' + deviceData.garagedoors[id].name + '</span>.';
	} else if (type === 'switchsensor') {
		str += 'A switch sensor with id '
			+ '<span>' + id + '</span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true">' + deviceData.switchsensors[id].name + '</span>.';
	} else if (type === 'fan') {
		str += 'A fan with id '
			+ '<span>' + id + '</span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true">' + deviceData.fans[id].name + '</span>'
			+ ' which consumes '
			+ '<span class="editable watts-input" contenteditable="true">' + deviceData.fans[id].watts + '</span>'
			+ ' watts of power.'
	} else if (type === 'levelsensor') {
		str += 'A level sensor with id '
			+ '<span>' + id + '</span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true">' + deviceData.levelsensors[id].name + '</span>.';
	} else if (type === 'motor') {
		str += 'A motor with id '
			+ '<span>' + id + '</span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true">' + deviceData.motors[id].name + '</span>'
			+ ' which consumes '
			+ '<span class="editable watts-input" contenteditable="true">' + deviceData.motors[id].watts + '</span>'
			+ ' watts of power, and provides water at a rate of '
			+ '<span class="editable rate-input" contenteditable="true">' + deviceData.motors[id].rate + '</span>'
			+ ' litres per second.';
	} else if (type === 'tank') {
		str += 'A tank with id '
			+ '<span>' + id + '</span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true">' + deviceData.tanks[id].name + '</span>'
			+ ' with capacity '
			+ '<span class="editable capacity-input" contenteditable="true">' + deviceData.tanks[id].capacity + '</span>'
			+ ' litres.'
	}
	str += '</p>';
	$('#device-info-page').html(str);
	str = '<a class="btn device-put-btn" id="' + type + '-put-btn">Update Details</a>'
		+ '&nbsp;&nbsp;'
		+ '<a class="btn device-delete-btn" id="' + type + '-delete-btn">Delete</a>';
	$('#device-info-page-update-btn').html(str);
}

function showAddNewDevicePage(type) {
	if (!type) {
		return;
	}
	var str = '';
	str += '<p>';
	if (type === 'lamp') {
		str += 'Add a new lamp with id '
			+ '<span class="editable id-input" contenteditable="true"></span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true"></span>'
			+ ' which consumes '
			+ '<span class="editable watts-input" contenteditable="true"></span>'
			+ ' watts of power.'
	} else if (type === 'garagedoor') {
		str += 'Add a new garage door with id '
			+ '<span class="editable id-input" contenteditable="true"></span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true"></span>.';
	} else if (type === 'switchsensor') {
		str += 'Add a new switch sensor with id '
			+ '<span class="editable id-input" contenteditable="true"></span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true"></span>.';
	} else if (type === 'fan') {
		str += 'Add a new fan with id '
			+ '<span class="editable id-input" contenteditable="true"></span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true"></span>'
			+ ' which consumes '
			+ '<span class="editable watts-input" contenteditable="true"></span>'
			+ ' watts of power.'
	} else if (type === 'levelsensor') {
		str += 'Add a new level sensor with id '
			+ '<span class="editable id-input" contenteditable="true"></span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true"></span>.';
	} else if (type === 'motor') {
		str += 'Add a new motor with id '
			+ '<span class="editable id-input" contenteditable="true"></span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true"></span>'
			+ ' which consumes '
			+ '<span class="editable watts-input" contenteditable="true"></span>'
			+ ' watts of power, and provides water at a rate of '
			+ '<span class="editable rate-input" contenteditable="true"></span>'
			+ ' litres per second.';
	} else if (type === 'tank') {
		str += 'Add a new tank with id '
			+ '<span class="editable id-input" contenteditable="true"></span>'
			+ ' and name '
			+ '<span class="editable name-input" contenteditable="true"></span>'
			+ ' with capacity '
			+ '<span class="editable capacity-input" contenteditable="true"></span>'
			+ ' litres.'
	}
	str += '</p>'
		+ '<div class="h-center-wrap space-top-small">'
		+ '<a class="btn device-post-btn" id="' + type + '-post-btn">Add</a>'
		+ '</div>';
	$('#add-device-info-page').html(str);
}

function getFormData(container, obj) {
	obj.id = $(container + ' .id-input').html();
	obj.name = $(container + ' .name-input').html();
	obj.watts = $(container + ' .watts-input').html();
	obj.rate = $(container + ' .rate-input').html();
	obj.capacity = $(container + ' .capacity-input').html();
}

function showClients(type, id) {
	if (!type || !id || !deviceData) {
		return;
	}
	var str = '';
	var clientid;
	var clientArray;
	if (type === 'lamp') {
		if (deviceData.lamps && deviceData.lamps[id] && deviceData.lamps[id].clients.switchSensor) {
			clientid = deviceData.lamps[id].clients.switchSensor._id;
			str += '<p>Switch Sensor</p>'
				+ '<div class="space-top-xs">'
				+ '<span class="client-id--list">' + clientid + '</span>'
				+ '<a class="btn client-delete-btn" id="lamp-switchsensor-' + id + '-' + clientid + '-client-delete-btn">Delete</a>'
				+ '</div>';
		}
		str += '<div class="space-top-small">'
			+ '<p>Update switch sensor client to id '
			+ '<span class="editable client-id-add-field" contenteditable="true"></span>'
			+ '.</p>'
			+ '<a id="lamp-add-client-btn" class="btn space-top-xs add-client-btn">Update</a>'
			+ '</div>';
	} else if (type === 'garagedoor') {
		if (deviceData.garagedoors && deviceData.garagedoors[id] && deviceData.garagedoors[id].clients.switchSensor) {
			clientid = deviceData.garagedoors[id].clients.switchSensor._id;
			str += '<p>Switch Sensor</p>'
				+ '<div class="space-top-xs">'
				+ '<span class="client-id--list">' + clientid + '</span>'
				+ '<a class="btn client-delete-btn" id="garagedoor-switchsensor-' + id + '-' + clientid + '-client-delete-btn">Delete</a>'
				+ '</div>';
		}
		str += '<div class="space-top-small">'
			+ '<p>Update switch sensor client to id '
			+ '<span class="editable client-id-add-field" contenteditable="true"></span>'
			+ '.</p>'
			+ '<a id="garagedoor-add-client-btn" class="btn space-top-xs add-client-btn">Update</a>'
			+ '</div>';
	} else if (type === 'switchsensor') {
		clientArray = deviceData.switchsensors && deviceData.switchsensors[id] && deviceData.switchsensors[id].clients.lamps;
		if (clientArray && clientArray.length) {
			str += '<p>Lamps</p>';
			clientArray.forEach(function (el) {
				clientid = el._id;
				str += '<div class="space-top-xs">'
					+ '<span class="client-id--list">' + clientid + '</span>'
					+ '<a class="btn client-delete-btn" id="lamp-switchsensor-' + clientid + '-' + id + '-client-delete-btn">Delete</a>'
					+ '</div>';
			});
		}
		clientArray = deviceData.switchsensors && deviceData.switchsensors[id] && deviceData.switchsensors[id].clients.garageDoors;
		if (clientArray && clientArray.length) {
			str += '<p class="space-top-small">Garage Doors</p>';
			clientArray.forEach(function (el) {
				clientid = el._id;
				str += '<div class="space-top-xs">'
					+ '<span class="client-id--list">' + clientid + '</span>'
					+ '<a class="btn client-delete-btn" id="garagedoor-switchsensor-' + clientid + '-' + id + '-client-delete-btn">Delete</a>'
					+ '</div>';
			});
		}
	} else if (type === 'fan') {
		if (deviceData.fans && deviceData.fans[id] && deviceData.fans[id].clients.levelSensor) {
			clientid = deviceData.fans[id].clients.levelSensor._id;
			str += '<p>Level Sensor</p>'
				+ '<div class="space-top-xs">'
				+ '<span class="client-id--list">' + clientid + '</span>'
				+ '<a class="btn client-delete-btn" id="fan-levelsensor-' + id + '-' + clientid + '-client-delete-btn">Delete</a>'
				+ '</div>';
		}
		str += '<div class="space-top-small">'
			+ '<p>Update level sensor client to id '
			+ '<span class="editable client-id-add-field" contenteditable="true"></span>'
			+ '.</p>'
			+ '<a id="fan-add-client-btn" class="btn space-top-xs add-client-btn">Update</a>'
			+ '</div>';
	} else if (type === 'levelsensor') {
		clientArray = deviceData.levelsensors && deviceData.levelsensors[id] && deviceData.levelsensors[id].clients.fans;
		if (clientArray && clientArray.length) {
			str += '<p>Fans</p>';
			clientArray.forEach(function (el) {
				clientid = el._id;
				str += '<div class="space-top-xs">'
					+ '<span class="client-id--list">' + clientid + '</span>'
					+ '<a class="btn client-delete-btn" id="fan-levelsensor-' + clientid + '-' + id + '-client-delete-btn">Delete</a>'
					+ '</div>';
			});
		}
	} else if (type === 'motor') {
		clientArray = deviceData.motors && deviceData.motors[id] && deviceData.motors[id].clients.tanks;
		if (clientArray && clientArray.length) {
			str += '<p>Tanks</p>';
			clientArray.forEach(function (el) {
				clientid = el._id;
				str += '<div class="space-top-xs">'
					+ '<span class="client-id--list">' + clientid + '</span>'
					+ '<a class="btn client-delete-btn" id="motor-tank-' + id + '-' + clientid + '-client-delete-btn">Delete</a>'
					+ '</div>';
			});
		}
		str += '<div class="space-top-small">'
			+ '<p>Add a new tank client with id '
			+ '<span class="editable client-id-add-field" contenteditable="true"></span>'
			+ '.</p>'
			+ '<a id="motor-add-client-btn" class="btn space-top-xs add-client-btn">Add</a>'
			+ '</div>';
	} else if (type === 'tank') {
		clientArray = deviceData.tanks && deviceData.tanks[id] && deviceData.tanks[id].clients.motors;
		if (clientArray && clientArray.length) {
			str += '<p>Motors</p>';
			clientArray.forEach(function (el) {
				clientid = el._id;
				str += '<div class="space-top-xs">'
					+ '<span class="client-id--list">' + clientid + '</span>'
					+ '<a class="btn client-delete-btn" id="motor-tank-' + clientid + '-' + id + '-client-delete-btn">Delete</a>'
					+ '</div>';
			});
		}
	}
	$('#clients-page').html(str);
}

$('#device-wrap').on('click', '.device', function () {
	var fullid = $(this).attr('id').split('-');
	if (fullid.length !== 2) {
		return;
	}
	var type = fullid[0];
	var id = fullid[1];
	currentStatusPage.type = type;
	currentStatusPage.id = id;
	updateStatusPage(type, id);
	updateDeviceStatus(deviceStatus);
	updateInfoPage(type, id);
	showClients(type, id);
	$('#device-page-wrap').removeClass('hidden');
});

$('#device-wrap').on('click', '.add-new-btn', function () {
	var fullid = $(this).attr('id').split('-');
	var type = fullid[0];
	showAddNewDevicePage(type);
	$('#add-device-page-wrap').removeClass('hidden');
});

$('#add-device-info-page').on('click', '.device-post-btn', function () {
	var fullid = $(this).attr('id');
	var type = fullid.split('-')[0];
	var obj = { };
	getFormData('#add-device-info-page', obj);
	$.post('http://localhost:3000/api/' + type + '/' + obj.id, obj)
	.done(function () {
		window.alert('Device added successfully.');
	})
	.fail(function () {
		window.alert('An error occurred in adding the device.');
	})
	.always(function () {
		$('#add-device-page-wrap').addClass('hidden');
		getDevices();
	});
});

$('#device-info-page-update-btn').on('click', '.device-put-btn', function () {
	var fullid = $(this).attr('id');
	var type = fullid.split('-')[0];
	var obj = { };
	getFormData('#device-info-page', obj);
	$.ajax({
		method: 'PUT',
		url: 'http:localhost:3000/api/' + type + '/' + currentStatusPage.id,
		data: obj
	})
	.done(function () {
		window.alert('Device updated successfully.');
	})
	.fail(function () {
		window.alert('An error occurred while updating the device.');
	})
	.always(function () {
		getDevices();
	});
});

$('#device-info-page-update-btn').on('click', '.device-delete-btn', function () {
	if (!deviceData) {
		return;
	}
	var type = currentStatusPage.type;
	var id = currentStatusPage.id;
	$.ajax({
		method: 'DELETE',
		url: 'http://localhost:3000/api/' + type + '/' + id 
	})
	.done(function () {
		window.alert('Device deleted successfully.');
		$('#device-page-wrap').addClass('hidden');
	})
	.fail(function () {
		window.alert('An error occurred while deleting the device.');
	})
	.always(function () {
		getDevices();
	});
});

$('#clients-page').on('click', '.add-client-btn', function () {
	var type = currentStatusPage.type;
	var id = currentStatusPage.id;
	var clientid = $('.client-id-add-field').html();
	clientid = clientid && parseInt(clientid, 10);
	if (isNaN(clientid) || !clientid.toString().length) {
		window.alert('Invalid client id.');
		return;
	}
	var clientType;
	if (type === 'garagedoor') {
		type = 'garageDoor';
	}
	if (type === 'lamp' || type === 'garageDoor') {
		clientType = 'switchSensor';
	} else if (type === 'fan') {
		clientType = 'levelSensor';
	} else if (type === 'motor') {
		clientType = 'tank';
	} else {
		return;
	}
	if (type === 'lamp' || type === 'fan' || type === 'garageDoor') {
		var deleteid = $('.client-id--list').html();
		if (deleteid) {
			deleteClient(clientType, deleteid, type, id);
		}
	}
	$.post('http://localhost:3000/api/' + type + '/' + id + '/client/' + clientType, { id: clientid })
	.done(function () {
		$.post('http://localhost:3000/api/' + clientType + '/' + clientid + '/client/' + type, { id: id })
		.done(function () {
			window.alert('Client added successfully.');
		})
		.fail(function () {
			'An error occurred. The client may not have been added both ways.';
		})
		.always(function () {
			getDevices();
		});
	})
	.fail(function () {
		window.alert('An error occurred.');
	});
});

function deleteClient(type, id, ctype, cid) {
	if (type === 'lamp' || type === 'garagedoor' || type === 'fan') {
		if (ctype === 'switchsensor') {
			ctype = 'switchSensor';
		} else if (ctype === 'levelsensor') {
			ctype = 'levelSensor';
		}
		$.ajax({
			method: 'DELETE',
			url: 'http://localhost:3000/api/' + type + '/' + id + '/client/' + ctype
		})
		.fail(function () {
			window.alert('An error occurred');
		})
		.always(function () {
			getDevices();
		});
	} else {
		if (ctype === 'garagedoor') {
			ctype = 'garageDoor';
		}
		$.ajax({
			method: 'DELETE',
			url: 'http://localhost:3000/api/' + type + '/' + id + '/client/' + ctype + '/' + cid
		})
		.fail(function () {
			window.alert('An error occurred');
		})
		.always(function () {
			getDevices();
		});
	}
}

$('#clients-page').on('click', '.client-delete-btn', function () {
	var fullid = $(this).attr('id').split('-');
	var type1 = fullid[0];
	var type2 = fullid[1];
	var id1 = fullid[2];
	var id2 = fullid[3];
	deleteClient(type1, id1, type2, id2);
	deleteClient(type2, id2, type1, id1);
});

$('#device-page-wrap-close').click(function () {
	$('#device-page-wrap').addClass('hidden');
});
$('#add-device-page-wrap-close').click(function () {
	$('#add-device-page-wrap').addClass('hidden');
});

function getDevices() {
	$.getJSON('http://localhost:3000/api/devices')
	.done(function (data) {
		if (!data) {
			window.alert('An error occurred');
			return;
		}
		if (data.err === 1) {
			window.alert('There was an error in getting all the devices');
		}
		deviceData = data;
		showDevices(data);
		showClients(currentStatusPage.type, currentStatusPage.id);
		socket.emit('get status');
	})
	.fail(function () {
		window.alert('There was an error in getting devices.');
	});
}
getDevices();

socket.on('status', function (d) {
	deviceStatus = d;
	if (deviceData && deviceStatus) {
		showDevices(deviceData);
		updateStatusPage(currentStatusPage.type, currentStatusPage.id);
		updateDeviceStatus(deviceStatus);
	}
});
