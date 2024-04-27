
//al cargar la pagina:
document.addEventListener("DOMContentLoaded", function() {
    requestApi()
});


var state = "Soleado";
var icon = "☀️";

function requestApi() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=43.2981&longitude=-7.6813&current=temperature_2m,is_day,rain,snowfall,cloud_cover&forecast_days=1"; //tiempo para vilalba
    const http = new XMLHttpRequest(); //inicializamos una peticion http
    http.open("GET", url) // le pasamos la url de la api
    http.onreadystatechange = function() { //al ser realizada...
        if (this.readyState == 4 && this.status == 200) { //comprobamos que ha sido realizada correctamente
            console.log("Peticion realizada");
            iconChanger(this.response);
            parseResponse(this.response); // le pasamos la respuesta de la peticion a la API (usmaos this porque estamos en ambito de funcion)
            var container = document.querySelector("body")
            if (dayCondition(this.response) === true) {
                container.className = "dia";      
            }else{
                container.className = "noche";
            }
        };
    };
    http.send();
};

function parseResponse(response) {
    let parsedResponse = JSON.parse(response);
    let data = document.querySelector(".data");
    data.textContent = parsedResponse.current.temperature_2m + "ºC | " + state;
}

function dayCondition(response) {
    let parsedResponse = JSON.parse(response);
    day = parsedResponse.current.is_day;
    if (day === 1) {
        return true;
    }else{
        return false;
    }
}

function iconChanger(response) {
    let parsedResponse = JSON.parse(response);
    let weatherIcon = document.querySelector(".icon");
    if (parsedResponse.current.rain > 0  && parsedResponse.current.rain < 50){
        icon = "🌦️";
        state = "Parcialmente lluvioso";
    }else if (parsedResponse.current.rain > 50){
        icon = "🌧️";
        state = "Muy lluvioso";
    }else if (parsedResponse.current.snowfall>10){
        icon = "🌨️";
        state = "Nevada";
    }else if (parsedResponse.current.cloud_cover < 40) {
        icon = "☀️";
        state = "Soleado";
    }else if (parsedResponse.current.cloud_cover > 40 && parsedResponse.current.cloud_cover < 80) {
        icon = "⛅";
        state = "Parcialmente nublado";
    }else if (parsedResponse.current.cloud_cover > 80) {
        icon = "☁️";
        state = "Nublado";
    }
    weatherIcon.textContent = icon;
}