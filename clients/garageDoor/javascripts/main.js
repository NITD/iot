$('#ip-btn').click(function () {
	var server = $('#ip-input').val();

	var status = 'closed';

	var $status = $('.door-status');
	var $door = $('.door');

	function openDoor() {
		status = 'open';
		$door.addClass('open');
		socket.emit('status', { status: status });
		$status.fadeOut(250);
		setTimeout(function () {
			$status.addClass('open');
			$status.html('open');
			$status.fadeIn(250);
		}, 250);
	}

	function closeDoor() {
		status = 'closed';
		$door.removeClass('open');
		socket.emit('status', { status: status });
		$status.fadeOut(250);
		setTimeout(function () {
			$status.removeClass('open');
			$status.html('closed');
			$status.fadeIn(250);
		}, 250);
	}

	var socket = io.connect('http://' + server, { query: 'id=1&type=garageDoor' });
	socket.on('connected', function () {
		socket.emit('status', { status: status });
		socket.emit('get status');
	});
	socket.on('status', function (message) {
		if (message.status === 'on') {
			openDoor();
		} else {
			closeDoor();
		}
	});
	socket.on('disconnect', closeDoor);

	$('#ip-page').fadeOut(200);
});
