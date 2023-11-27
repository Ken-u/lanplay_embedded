function addServerToList(serverAddr) {
    var serverXhr = new XMLHttpRequest();
	serverXhr.onreadystatechange = function() {
		if (serverXhr.readyState === 4 && serverXhr.status === 200) {
			var serverData = serverXhr.responseText;
			console.log(serverData);
		}
	};
	serverXhr.open("GET", "http://192.168.31.188:8002/?param=func&add_server=" + serverAddr, true);
	serverXhr.send();
}

function removeServerFromList(serverAddr) {
	var serverXhr = new XMLHttpRequest();
	serverXhr.onreadystatechange = function() {
		if (serverXhr.readyState === 4 && serverXhr.status === 200) {
			var serverData = serverXhr.responseText;
			console.log(serverData);
		}
	};
	serverXhr.open("GET", "http://192.168.31.188:8002/?param=func&remove_server=" + serverAddr, true);
	serverXhr.send();
}

function openModal() {
	document.getElementById("serverMgr").style.display = "block";
}

function closeModal() {
	document.getElementById("serverMgr").style.display = "none";
}

function addServer() {
	var inputText = document.getElementById('inputBoxModal').value;
	addServerToList(inputText);
	closeModal();
}

function removeServer() {
	var inputText = document.getElementById('inputBoxModal').value;
	removeServerFromList(inputText);
	closeModal();
}