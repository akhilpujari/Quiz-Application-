const formfields = [
    {
        id : 'firstname',
        label : 'firstname',
        rules : ['required','min:3','max:15']
    },
    {
        id : 'lastname',
        label : 'lastname',
        rules : ['required','min:3','max:15']
    },
    {
        id : 'username',
        label : 'username',
        rules : ['required','min:3','max:15']
    },
    {
        id : 'password',
        label : 'password',
        rules : ['required','min:6','max:20']
    },
    {
        id : 'confirm_password',
        label : 'confirm_password',
        rules : ['required','min:6','max:20','confirm_password']
    }
]
function form_validation(field){
    let value = $(`#${field.id}`).val();
    let valid = true;
    for(let rule of field.rules){
        if(rule == 'required'){
            if(!value || value == ""){
                $(`#error${field.label}`).text('Please fill this field');
                valid = false;
            }
        }
        if(rule.startsWith('min')){
            let min = rule.split(':')[1];
            if(value.length < min){
                $(`#error${field.label}`).text('Please enter atleast 3 characters');
                valid = false;
            }
        }
        if(rule.startsWith('max')){
            let max = rule.split(':')[1];
            if(value.length > max){
                $(`#error${field.label}`).text('Please enter atmost 10 characters');
                valid = false;
            }
        }
        if(rule == 'confirm_password'){
            if(value != $('#password').val()){
                $(`#error${field.label}`).text('Password does not match');
                valid = false;
            }
        }
    }
    return valid;

}
function register(event){
    event.preventDefault();
    let status = true;
    for(let field of formfields){
        let formfield = form_validation(field)
        status = status && formfield;
    }
    if(status){
        $.ajax({
            url : "/api/registration.php",
            method : 'POST',
            data : {
                firstname : $('#firstname').val(),
                lastname : $('#lastname').val(),
                username : $('#username').val(),
                password : $('#password').val(),
                confirm_password : $('#confirm_password').val()
            },
            headers : {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            success : function(response){
                console.log(response);
                $('#errormsg').text('');
                window.location.href = 'index.html';
            },
            error : function(error){
                console.log(error);
                let errormsg = JSON.parse(error.responseText);
                $('#errormsg').text(errormsg.message);
            }
        })
    }
    else{
        console.log('Please fill all the fields');
    }
}