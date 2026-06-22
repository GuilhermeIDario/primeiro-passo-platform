const loginForm =
document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit",(e)=>{

        e.preventDefault();

        window.location.href =
        "dashboard.html";
    });
}

const cadastroForm =
document.getElementById("cadastroForm");

if(cadastroForm){

    cadastroForm.addEventListener("submit",(e)=>{

        e.preventDefault();

        alert(
            "Conta criada com sucesso!"
        );

        window.location.href =
        "login.html";
    });
}