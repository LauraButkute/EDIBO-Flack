$(function(){
    console.log('JS connected')

    var socket = io();
        socket.on('connect', function() {
            if(!localStorage.getItem('username')){
                $("#myModal").modal({backdrop: 'static' , keyboard: false});
                $('.modal-title').text("Please enter your username");
                $('#modalInput').val("");
            }
            
            console.log('SOCKET connected')
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
        var msg = $('#message').val()
        if(key.keyCode===13 ) {
            $('#sendMsg').click();
        }
        spcket.send(msg)
    });

    // SEND MESSAGES ON CLICK

    $('#sendMsg').on('click', function(){
        var msg = $('#message').val()
        socket.send(msg)
    });
    
    

    //Receiving data and displaying messages 
    socket.on('message', data =>{
        console.log(data)
        // Display Username
        const span = document.createElement('span')
        span.innerHTML = localStorage.username;
        $('.message-display-area').append(span);
        const sentOn = document.createElement('span')
        // Display date and time
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();
        var date = today.getFullYear()+ "/" + (today.getMonth()+1) + "/" + today.getDate();
        sentOn.innerHTML = time +" "+ date;
        $('.message-display-area').append(sentOn);
        // Display message
        const message = document.createElement('p')
        message.innerHTML = data;
        $('.message-display-area').append(message)
    });
})