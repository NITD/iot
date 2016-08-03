var status = 'off';
var level = 0;

var $fan = $('.fan');
var $status = $('#fan-status');
var $statusWrap = $('.fan-status-wrap');

var socket = io.connect('http://localhost:3000', { query: 'id=1&type=fan' });

function changeFanStatus(message) {
	level = message.level;
	$status.html(level);
	if (message.status === 'on') {
		status = 'on';
		var duration = 3000 - level / 100 * 2700;
		duration = parseInt(duration, 10) + 'ms';
		var animation = duration + ' linear infinite rotate';
		$fan.css('animation', 'none');
		setTimeout(function () {
			$fan.css('animation', animation);
		});
	} else {
		status = 'off';
		$fan.css('animation', 'none');
	}
	socket.emit('status', { status: status, level: level });
}

socket.on('connected', function () {
	socket.emit('status', { status: status, level: level });
	socket.emit('get status');
});
socket.on('status', function (message) {
	changeFanStatus(message);
});
socket.on('disconnect', function () {
	changeFanStatus({ status: 'off', level: 0 });
});
