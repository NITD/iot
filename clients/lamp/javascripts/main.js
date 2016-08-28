$('#ip-btn').click(function () {
	var server = $('#ip-input').val();
	var status = 'off';

	var $body = $('body');
	var $status = $('.lamp-status');

	function switchLampOn() {
		status = 'on';
		socket.emit('status', { status: status });
		$body.addClass('on');
		$status.fadeOut(250);
		setTimeout(function () {
			$status.html('on');
			$status.addClass('on');
			$status.fadeIn(250);
		}, 250);
	}

	function switchLampOff() {
		status = 'off';
		socket.emit('status', { status: status });
		$body.removeClass('on');
		$status.fadeOut(250);
		setTimeout(function () {
			$status.html('off');
			$status.removeClass('on');
			$status.fadeIn(250);
		}, 250);
	}

	var socket = io.connect('http://' + server, { query: 'id=1&type=lamp' });
	socket.on('connected', function () {
		socket.emit('status', { status: status });
		socket.emit('get status');
	});
	socket.on('status', function (message) {
		if (message.status === 'on') {
			switchLampOn();
		} else {
			switchLampOff();
		}
	});
	socket.on('disconnect', switchLampOff);

	$('#ip-page').fadeOut(200);
});
