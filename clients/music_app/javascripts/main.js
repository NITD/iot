var socket = io.connect('http://localhost:3000', { query: 'type=app&appType=music' });

var playing = false;
var isChrome = !!window.chrome && !!window.chrome.webstore;

function prepareSong() {
	var mediaSource = new MediaSource();
	var $audio = document.getElementById('audio');
	$audio.src = window.URL.createObjectURL(mediaSource);
	mediaSource.addEventListener('sourceopen', function (event) {
		var format;
		if (isChrome) {
			format = 'audio/mpeg';
		} else {
			format = 'audio/mp3';
		}
		var sourceBuffer = mediaSource.addSourceBuffer(format);
		var queue = [];
		var check = 1;
		socket.on('chunk', function (data) {
			if (check === 1) {
				sourceBuffer.appendBuffer(data);
				check = 2;
			} else {
				queue.push(data);
			}
		});
		function updateFromQueue() {
			if (queue.length) {
				var data = queue.shift();
				sourceBuffer.appendBuffer(data);
			} else {
				setTimeout(updateFromQueue, 100);
			}
		}
		sourceBuffer.addEventListener('updateend', function () {
			updateFromQueue();
		});
	});
}

socket.on('connected', function () {
	socket.emit('get list');
});

socket.on('list', function (list) {
	var $list = $('.music-list');
	list.forEach(function (song) {
		var str = '<div class="song">' + song + '</div>';
		var $str = $(str);
		$str.click(songClicked);
		$list.append($str);
	});
});

function songClicked() {
	prepareSong();
	socket.emit('play', { song: $(this).html() });
	$('.song-name').html($(this).html());
	$('.play-page').fadeIn(500);
}

$('.cancel').click(function (e) {
	e.stopPropagation();
	$('.play-page').fadeOut(500);
	document.getElementById('audio').pause();
	playing = false;
	setTimeout(function () {
		$('.tap-message').html('Tap To Play');
	}, 500);
});

$('.play-page').click(function () {
	if (playing) {
		playing = false;
		document.getElementById('audio').pause();
		$('.tap-message').fadeOut(250);
		setTimeout(function () {
			$('.tap-message').html('Tap To Play');
			$('.tap-message').fadeIn(250);
		}, 250);
	} else {
		playing = true;
		document.getElementById('audio').play();
		$('.tap-message').fadeOut(250);
		setTimeout(function () {
			$('.tap-message').html('Tap To Pause');
			$('.tap-message').fadeIn(250);
		}, 250);
	}
});
