var level = 0;
var capacity = 500;

var $status = $('#tank-status');
var $level = $('.water-level');

var requesting = false;
var $requestMessage = $('.request-message');

function requestWater() {
	requesting = true;
	socket.emit('get water');
	$requestMessage.fadeOut(250);
	setTimeout(function () {
		$requestMessage.html('Tap To Stop Water');
		$requestMessage.fadeIn(250);
	}, 250);
}

function stopRequestingWater() {
	requesting = false;
	socket.emit('stop water');
	$requestMessage.fadeOut(250);
	setTimeout(function () {
		$requestMessage.html('Tap To Request Water');
		$requestMessage.fadeIn(250);
	}, 250);
}

function showOverflowMessage() {
	requesting = false;
	$requestMessage.fadeOut(250);
	setTimeout(function () {
		$requestMessage.html('<span style="color: #c77">Overflow!</span>');
		$requestMessage.fadeIn(250);
		setTimeout(stopRequestingWater, 700);
	}, 250);
}

$(window).click(function () {
	if (requesting) {
		stopRequestingWater();
	} else {
		if (level < capacity) {
			requestWater();
		} else {
			showOverflowMessage();
		}
	}
});

var socket = io.connect('http://localhost:3000', { query: 'id=2&type=tank' });
socket.on('connected', function () {
	socket.emit('level', { level: level });
	if (requesting) {
		socket.emit('get water');
	}
});
socket.on('water', function (message) {
	var newLevel = level + message.capacity;
	if (!requesting) {
		socket.emit('stop water');
	}
	if (newLevel > capacity) {
		level = capacity;
		stopRequestingWater();
		showOverflowMessage();
	} else {
		level = newLevel;
		if (level === capacity) {
			stopRequestingWater();
		}
	}
	socket.emit('level', { level: level });
	var percentLevel = level / capacity * 100;
	$status.html(parseInt(percentLevel, 10));
	$level.css('height', percentLevel + '%');
});
