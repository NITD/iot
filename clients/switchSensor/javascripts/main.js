$('#ip-btn').click(function () {
	var server = $('#ip-input').val();

	var status = 'off';

	var $status = $('.switch-status');
	var $redLine = $('.red-line');

	var socket = io.connect('http://' + server, { query: 'id=1&type=switchSensor' });

	socket.on('connected', function () {
		socket.emit('status', { status: status });
	});

	function switchOn() {
		status = 'on';
		socket.emit('status', { status: status });
		$redLine.addClass('on');
		$status.fadeOut(250);
		setTimeout(function () {
			$status.html('on');
			$status.fadeIn(250);
		}, 250);
	}

	function switchOff() {
		status = 'off';
		socket.emit('status', { status: status });
		$redLine.removeClass('on');
		$status.fadeOut(250);
		setTimeout(function () {
			$status.html('off');
			$status.fadeIn(250);
		}, 250);
	}

	$('.sensor-page-main').get(0).addEventListener('click', function () {
		if (status === 'off') {
			switchOn();
		} else {
			switchOff();
		}
	});

	$('#ip-page').fadeOut(200);
});
