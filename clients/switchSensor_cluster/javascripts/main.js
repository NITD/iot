var statusList = [];
for (var i = 0; i < 5; i += 1) {
	statusList[i] = 'off';
}

var $sensor = $('.sensor');

var socket = [];
for (i = 2; i <= 6; i += 1) {
	var s = io.connect('http://localhost:3000', { query: 'id=' + i + '&type=switchSensor' });
	socket.push(s);
	(function (s, index) {
		s.on('connected', function () {
			s.emit('status', { status: statusList[index - 2] });
		});
	}(s, i));
}

function switchOn(index) {
	statusList[index] = 'on';
	socket[index].emit('status', { status: statusList[index] });
	$sensor.eq(index).addClass('on');
	var $status = $sensor.eq(index).find('.status');
	$status.fadeOut(250);
	setTimeout(function () {
		$status.html('on');
		$status.fadeIn(250);
	}, 250);
}

function switchOff(index) {
	statusList[index] = 'off';
	socket[index].emit('status', { status: statusList[index] });
	$sensor.eq(index).removeClass('on');
	var $status = $sensor.eq(index).find('.status');
	$status.fadeOut(250);
	setTimeout(function () {
		$status.html('off');
		$status.fadeIn(250);
	}, 250);
}

$('.sensor').click(function () {
	var index = $(this).index();
	console.log(index);
	if (statusList[index] === 'off') {
		switchOn(index);
	} else {
		switchOff(index);
	}
});
