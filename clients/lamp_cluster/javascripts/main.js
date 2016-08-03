var statusList = [];
for (var i = 0; i < 9; i += 1) {
	statusList[i] = 'off';
}

var socket = [];

var $lamps = $('.lamp');

function switchLampOn(index) {
	statusList[index] = 'on';
	socket[index].emit('status', { status: status });
	$lamps.eq(index).addClass('on');
	var $status = $lamps.eq(index).find('.status');
	$status.fadeOut(250);
	setTimeout(function () {
		$status.html('on');
		$status.fadeIn(250);
	}, 250);
}

function switchLampOff(index) {
	statusList[index] = 'off';
	socket[index].emit('status', { status: status });
	$lamps.eq(index).removeClass('on');
	var $status = $lamps.eq(index).find('.status');
	$status.fadeOut(250);
	setTimeout(function () {
		$status.html('off');
		$status.fadeIn(250);
	}, 250);
}

for (var i = 2; i <= 10; i += 1) {
	var s = io.connect('http://localhost:3000', { query: 'id=' + i + '&type=lamp' });
	socket.push(s);
	(function (s, index) {
		s.on('connected', function () {
			s.emit('status', { status: status[i - 2] });
			s.emit('get status');
		});

		s.on('status', function (message) {
			if (message.status === 'on') {
				switchLampOn(index - 2);
			} else {
				switchLampOff(index - 2);
			}
		});

		s.on('disconnect', function () {
			switchLampOff(index - 2);
		});
	}(s, i));
}
