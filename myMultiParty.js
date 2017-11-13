
var multiparty;

function Enter(key, room, role)
{

    multiparty = new MultiParty({
        "key": key,  /* SkyWay key */
        "room": room,
        "video": false
    });

    multiparty.on('my_ms', function (video)
    {
        console.log("Enter room");
    }).on('open', function (myid)
    {
		multiparty.listAllPeers(function (lists){
			if(lists[0] == null){
				if(role == 1){
					EnterError("There is no host in this room!");
					multiparty.close();
					return;
				}
			}else{
				if(role == 0){
					EnterError("Sorry! This room is already used!");
					multiparty.close();
					return;
				}
				if(lists[1] != null){
					EnterError("This room is already full!");
					multiparty.close();
					return;
				}
			}
			gameInstance.SendMessage('ProjectManager', 'SceneChange', 1);
		})
    }).on('peer_ms', function (video)
    {
        console.log("get other data");
        // create peer video
        var vNode = MultiParty.util.createVideoNode(video);
        $(vNode).appendTo("#streams");
        videoval = document.getElementById(video["id"]);
        document.getElementById(video["id"]).style.display = "none";
        gameInstance.SendMessage('ProjectManager', 'EnterPartner');
    }).on('ms_close', function (peer_id)
    {
        console.log("exit other");
        // remove peer video
        $("#" + peer_id).remove();
        gameInstance.SendMessage('ProjectManager', 'ExitPartner');
    }).on('message', function (message)
    {
        
        gameInstance.SendMessage('Partner', 'GetData', message["data"]);
    });

    multiparty.start();

}

function EnterError(message){
	alert(message);
}

function SendData(message) {
    multiparty.send(message);
}