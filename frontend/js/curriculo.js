const form =
document.getElementById(
"curriculoForm"
);

if(form){

form.addEventListener(
"submit",
(e)=>{

e.preventDefault();

alert(
"Currículo gerado!"
);

});

}