
			var endpoints = [];

			var gameList = []; // 全局变量，用于存储游戏列表
			
			// Fetch game data from tinfoil
			// And server list from lan-play server manager
			fetchGameDataAndServerList();

			// 初始化磁块显示和获取游戏数据
			fetchServerList();
			setInterval(fetchServerList, 5000);

			function fetchData(url, tile) {
				var endpoint = "http://"+url+"/graphql";
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4 && xhr.status === 200) {
						var data = JSON.parse(xhr.responseText);
						displayData(data, tile);
					}
				};
				xhr.open("POST", endpoint, true);
				xhr.setRequestHeader("Content-Type", "application/json");

				// GraphQL查询服务器状态
				var graphqlQuery = '{ "query": "query { room { ip contentId hostPlayerName nodeCountMax nodeCount advertiseDataLen advertiseData nodes { ip isConnected playerName } }}" }';
				xhr.send(graphqlQuery);
			}

			function fetchGameDataAndServerList() {
				var gameXhr = new XMLHttpRequest();
				gameXhr.onreadystatechange = function () {
					if (gameXhr.readyState === 4 && gameXhr.status === 200) {
						var gameData = JSON.parse(gameXhr.responseText);
						gameList = gameData.data;
					}
				};
				gameXhr.open("GET", "https://tinfoil.media/Title/ApiJson/", true);
				gameXhr.send();
			}
			
			function fetchServerList() {
				var serverXhr = new XMLHttpRequest();
				serverXhr.onreadystatechange = function() {
					if (serverXhr.readyState === 4 && serverXhr.status === 200) {
						var serverData = JSON.parse(serverXhr.responseText);
						endpoints = serverData;
						console.log(serverData);
						createTiles();
					}
				};
				serverXhr.open("GET", "http://192.168.31.188:8002/?param=func&get_server_list=192.168.1.1:1234", true);
				serverXhr.send();
			}

			function createTiles() {
				var graphqlDataElement = document.getElementById("tiles");

				// 清除之前的磁块
				graphqlDataElement.innerHTML = '';

				// 为每个endpoint创建一个磁块
				endpoints.forEach(function (endpoint) {
					var tile = document.createElement("div");
					tile.className = "tile";
					tile.innerHTML = `<div><p>${endpoint}</p></div>`;
					graphqlDataElement.appendChild(tile);

					// 初始获取数据
					fetchData(endpoint, tile);
				});
			}

			// Function to decode byte array to string
			function decodeByteArray(byteArray, encoding) {
				let decoder = new TextDecoder(encoding);
				return decoder.decode(new Uint8Array(byteArray));
			}

			// 在gameList中查找对应的game信息
			function getGameDataById(contentId) {
				return gameList.find(function (game) {
					return game.id.toUpperCase() === contentId.toUpperCase();
				});
			}

			function displayData(data, tile) {
				var rooms = data.data.room;

				if (Array.isArray(rooms)) {
					var roomInfo = document.createElement("div");
					roomInfo.className = "roomInfo";

					rooms.forEach(function (room) {
						// 处理contentId为ffffffffffffffff的特殊情况
						var contentId = room.contentId === "ffffffffffffffff" ? "0100B04011742000" : room.contentId;
						var game = getGameDataById(contentId);
						var gameName = "Unknow";
						if (game) {
							// 创建一个虚拟的DOM元素
							var tempElement = document.createElement('div');
							tempElement.innerHTML = game.name;
							gameName = tempElement.querySelector('a').textContent;
						}

						var roomTile = document.createElement("div");
						roomTile.className = "table-container";
						roomTile.innerHTML = ""; // Clear previous content

						// Icon/Game Name/Host Player Name
						var header = document.createElement("div");
						header.className = "table-row";
						var iconCell = document.createElement("div");
						iconCell.className = "table-cell";
						var img = document.createElement("img");
						var url = `https://tinfoil.media/ti/${contentId}/64/64`;
						img.src = url;
						iconCell.appendChild(img);
						header.appendChild(iconCell);

						var gameNameCell = document.createElement("div");
						gameNameCell.className = "table-cell";
						gameNameCell.innerHTML = gameName;
						header.appendChild(gameNameCell);

						var hostInfo = document.createElement("div");
						hostInfo.className = "table-cell";

						var adata = room.advertiseData;
						var byteData = new Uint8Array(adata.match(/[\da-f]{2}/gi).map(function (h) {return parseInt(h, 16)}));
						hostPlayerNintendoName = decodeByteArray(byteData, 'utf-16');	
						hostInfo.innerHTML = room.hostPlayerName;
						//hostInfo.innerHTML = hostPlayerNintendoName;
						header.appendChild(hostInfo);
						roomTile.appendChild(header);

						for (var i = 0; i < room.nodeCountMax/*room.nodes.length*/; i++) {
							var strPlayerName = "";
							var strIp = "";
							if (i < room.nodeCount) {
								strPlayerName = room.nodes[i].playerName;
								strIp = room.nodes[i].ip;
							}
							var row = document.createElement("div");
							row.className = "table-row";

							var cell = document.createElement("div");
							cell.className = "table-cell";
							cell.innerHTML = strPlayerName;
							row.appendChild(cell);

							var cell1 = document.createElement("div");
							cell1.className = "table-cell";
							cell1.innerHTML = strIp;
							row.appendChild(cell1);

							roomTile.appendChild(row);
						}
						roomInfo.appendChild(roomTile);
					});
					tile.appendChild(roomInfo);
				} else {
					tile.innerHTML += `<p><strong>No data available.</strong></p>`;
				}
			}