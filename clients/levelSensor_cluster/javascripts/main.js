var $redLine = $('.red-line');
var $level = $('.level');

var socket = [];
for (var i = 2; i <= 6; i++) {
	var s = io.connect('http://localhost:3000', { query: 'id=' + i + '&type=levelSensor' });
	socket.push(s);
	(function (s, index) {
		s.on('connected', function () {
			sliderChanged(index - 2);
		});
	}(s, i));
}

function sliderChanged(index) {
	var level = parseInt($redLine.eq(index).val(), 10);
	if (level === 0) {
		socket[index].emit('status', { status: 'off', level: level });
	} else {
		socket[index].emit('status', { status: 'on', level: level });
	}
}

$('.red-line').change(function () {
	var index = $(this).parent().index();
	console.log(index);
	$level.eq(index).html($(this).val());
	sliderChanged(index);
});
