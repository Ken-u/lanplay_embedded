var currentServer;

function updateEndpoint() {
	var selectedEndpoint = document.getElementById("optionsDropdown").value;
	currentServer = selectedEndpoint;
	socket.send("relayServer=" + selectedEndpoint);
	console.log("update Choice: " + selectedEndpoint);
}

function openSetting() {
	document.getElementById("setting").style.display = "block";
	fetchServerListForLanPlay();
}

function closeSetting() {
	document.getElementById("setting").style.display = "none";
}

function startLanplay() {
	// 更新全局变量和触发数据刷新
	var selectedEndpoint = document.getElementById("optionsDropdown").value;
	socket.send("relayServer=" + selectedEndpoint);
	socket.send("start");
}

function stopLanplay() {
	socket.send("stop");
}

// Global
var optionsData = [];

// 初始化下拉列表
  function initializeDropdown() {
    var dropdown = document.getElementById("optionsDropdown");

    // 清空现有选项
    dropdown.innerHTML = "";

    // 创建新的选项
    for (var i = 0; i < optionsData.length; i++) {
      var option = document.createElement("option");
      option.value = optionsData[i];
      option.text = optionsData[i];
	  if (optionsData[i] === currentServer) {
		  option.selected = true;
	  }
      dropdown.appendChild(option);
    }
  }

// 更新下拉列表的选项
  function updateOptions(newOptions) {
    optionsData = newOptions;
    initializeDropdown();
  }
  
  function fetchServerListForLanPlay() {
	  var serverXhr = new XMLHttpRequest();
				serverXhr.onreadystatechange = function() {
					if (serverXhr.readyState === 4 && serverXhr.status === 200) {
						var serverData = JSON.parse(serverXhr.responseText);
						console.log(serverData);
						updateOptions(serverData);
					}
				};
				serverXhr.open("GET", "http://192.168.31.188:8002/?param=func&get_server_list=192.168.1.1:1234", true);
				serverXhr.send();
  }