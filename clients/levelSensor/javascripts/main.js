var $redLine = $('.red-line');
var $level = $('.level');

var socket = io.connect('http://localhost:3000', { query: 'id=1&type=levelSensor' });

function sliderChanged() {
	var level = parseInt($redLine.val(), 10);
	if (level === 0) {
		socket.emit('status', { status: 'off', level: level });
	} else {
		socket.emit('status', { status: 'on', level: level });
	}
}

$redLine.change(function () {
	$level.html($(this).val());
	sliderChanged();
});

socket.on('connected', function () {
	sliderChanged();
});
