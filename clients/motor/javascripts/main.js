var status = 'off';

var $status = $('.motor-status');
var $motor = $('.motor-icon');

function switchMotorOn() {
	status = 'on';
	socket.emit('status', { status: status });
	$motor.fadeOut(250);
	$status.fadeOut(250);
	setTimeout(function () {
		$motor.attr('src', 'assets/images/motor-green.png');
		$status.html('on');
		$motor.fadeIn(250);
		$status.fadeIn(250);
	}, 250);
}

function switchMotorOff() {
	status = 'off';
	socket.emit('status', { status: status });
	$motor.fadeOut(250);
	$status.fadeOut(250);
	setTimeout(function () {
		$motor.attr('src', 'assets/images/motor-white.png');
		$status.html('off');
		$motor.fadeIn(250);
		$status.fadeIn(250);
	}, 250);
}

var socket = io.connect('http://localhost:3000', { query: 'id=1&type=motor' });
socket.on('connected', function () {
	socket.emit('status', { status: status });
	socket.emit('get status');
});
socket.on('status', function (message) {
	if (message.status === 'on') {
		switchMotorOn();
	} else {
		switchMotorOff();
	}
});
socket.on('disconnect', switchMotorOff);
