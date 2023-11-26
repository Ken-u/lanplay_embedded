// WebSocket连接
			const socket = new WebSocket('ws://192.168.31.188:8001', "switch-lan-play-rpc");

			socket.onopen = function(event) {
				console.log('WebSocket连接已打开:', event);
				// Auth with lan-play-rpc
				socket.send("cxz-switch");
			};

			socket.onmessage = function(event) {
				console.log('收到消息:', event.data);
				displayMessage(event.data);
			};

			socket.onclose = function(event) {
				console.log('WebSocket连接已关闭:', event);
			};

			function displayMessage(message) {
				const outputDiv = document.getElementById('output');
				outputDiv.innerHTML += `<p>${message}</p>`;
			}
			
			// 获取刷新时间的输入框
			var refreshTimeInput = document.getElementById("refreshTime");

			// 更新刷新时间
			function updateRefreshTime() {
				// 获取新的刷新时间
				var newRefreshTime = refreshTimeInput.value;

				// 清除之前的定时器
				clearInterval(intervalId);

				// 更新磁块显示
				createTiles();
			}
			
function clearMessage() {
	const outputDiv = document.getElementById('output');
	outputDiv.innerHTML = ``;
}
function openWS() {
	document.getElementById("wsDebug").style.display = "block";
}

function closeWS() {
	document.getElementById("wsDebug").style.display = "none";
}

function sendMessage() {
	var inputText = document.getElementById('wsMessageModal').value;
	socket.send(inputText);
}