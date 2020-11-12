$(function(){
    // console.log('JS connected')
    var socket = io();
        socket.on('connect', function() {
            if(!localStorage.getItem('username')){
                $("#myModal").modal({backdrop: 'static' , keyboard: false});
                $('.modal-title').text("Please enter your username");
                $('#modalInput').val("");
            }
        });

    // MANIPULATING MODAL, IF ENTER then click

    $("#modalInput").on('keyup', function (key) {
        if ($(this).val().length > 0 ){
            $("#modalButton").attr('disabled',false);
            if (key.keyCode==13 ) {
                $('#modalButton').click();
            }
        }
        else {
            $("#modalButton").attr('disabled',true);
        }
    });

    //MODAL ON CLICK
    $("#modalButton").on('click', function () {
        // action for new username
        if (!localStorage.getItem('username')) {    
            var username=$('#modalInput').val();
            socket.emit('new username',{'username':username});
        } 
    });

    socket.on('add username', data=> {
        localStorage.setItem('username',data["username"]);
        $('#username').text(localStorage.getItem('username'));
    });

    // Send messages on enter
    $("#message").on('keyup', function (key) {
        if(key.keyCode===13 ) {
            $('#sendMsg').click();
        }
    });

    // SEND MESSAGES ON CLICK

    $('#sendMsg').on('click', function(){
        var msg = $("#message").val();
        var user = localStorage.username
        socket.send({"msg": msg, "username" : user})
    });
    
    //Receiving data and displaying messages 
    socket.on('message', data =>{
        
        // Display Username
        const nick = document.createElement('strong')
        nick.className='nickname';
        nick.innerHTML = data.username;
        $('.single-message-area').append(nick);
        $('.single-message-area').append(' : ')

        // Display message
        const msg = document.createElement('span')
        msg.className='message-text'
        msg.innerHTML = data.msg;
        $('.single-message-area').append(msg);

        // Display date and time
        const sentOn = document.createElement('p')
        sentOn.className='date';
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();
        var date = today.getFullYear()+ "/" + (today.getMonth()+1) + "/" + today.getDate();
        sentOn.innerHTML = time +"  "+ date;
        $('.single-message-area').append(sentOn);
    });
})
