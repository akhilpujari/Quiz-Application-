window.addEventListener("pageshow", function() {
    let token = localStorage.getItem("token");
    if(!token){
        window.location.href = "index.html";
    }
});

$(document).ready(function(){
    let token = localStorage.getItem("token");
    $('#signout').click(function(){
        // localStorage.clear();
        // window.location.href = 'index.html';
        $.ajax({
            url :"/api/logout.php",
            method :"POST",
            headers:{
                Authorization : token 
            },
            success : function(response){
                console.log(response);
                localStorage.clear();
                window.location.href = 'index.html';

            },
            error : function(error){
                console.log("Something went wrong",error);
            }
        })

    })

    $.ajax({
        url:"/api/dashboard.php",
        method : "GET",
        headers :{
            Authorization : token
        },
        success : function(response){
            let data = JSON.parse(response);
            $('#name').text('Hi,' +' '+ data.data.username);
            localStorage.setItem("username", data.data.username);
        }, 
        error : function(error){
            console.log(error);
        }
    })
})