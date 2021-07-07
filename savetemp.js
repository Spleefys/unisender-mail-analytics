const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require("fs");

var xhr2 = new XMLHttpRequest();
var xhr3 = new XMLHttpRequest();
var tempzz = new Array();

//Получение данных о шаблонах от Юнисендера
xhr2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var obj2 = JSON.parse(this.responseText);
        for (var i = 0; i < obj2.result.length; i++) {
            if (obj2.result[i].title.startsWith('YOUR_DOMAIN_NAME')) {//Называем шаблоны начиная с доменного имени и проверяем принадлежность шаблона данному домену, если доменов несколько (ex. Domain "Название шаблона"), а также добавляем такие же проверки для других доменов
                tempzz.push({
                    id: 0,
                    subject: obj2.result[i].subject,
                    pic: obj2.result[i].fullsize_screenshot_url,
                    date: 0,
                    count: 0,
                    stats: 'none',
                    clicks: 0,
                    read: 0,
                    spam: 0
                });
            }
        }
        fs.writeFile("./db/templateszz.json", JSON.stringify(tempzz) , function(error){
            if(error) throw error; // если возникла ошибка
            console.log("Запись шаблонов ZZ 1-100 завершена.");//Записываем шаблоны одного домена от 1 до 100 в JSON-файл
        });
    }
    else {
        obj2 = false;
    }
};
//Запрос
xhr2.open("GET", "https://api.unisender.com/ru/api/getTemplates?format=json&api_key=YOUR_API_KEY&limit=100", true);//Укажите API key Unisender'а
xhr2.send();

xhr3.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var obj3 = JSON.parse(this.responseText);
        for (var i = 0; i < obj3.result.length; i++) {
            if (obj3.result[i].title.startsWith('YOUR_DOMAIN_NAME')) {//Называем шаблоны начиная с доменного имени и проверяем принадлежность шаблона данному домену, если доменов несколько (ex. Domain "Название шаблона"), а также добавляем такие же проверки для других доменов
                tempzz.push({
                    id: 0,
                    subject: obj3.result[i].subject,
                    pic: obj3.result[i].fullsize_screenshot_url,
                    date: 0,
                    count: 0,
                    stats: 'none',
                    clicks: 0,
                    read: 0,
                    spam: 0
                });
            }
        }
        fs.writeFile("./db/templateszz.json", JSON.stringify(tempzz) , function(error){
            if(error) throw error; // если возникла ошибка
            console.log("Запись шаблонов ZZ 100+ завершена.");//Записываем шаблоны одного домена от 100 до 200 в JSON-файл
        });
    }
    else {
        obj3 = false;
    }
};
//Запрос
xhr3.open("GET", "https://api.unisender.com/ru/api/getTemplates?format=json&api_key=YOUR_API_KEY&limit=100&offset=100", true);//Укажите API key Unisender'а
xhr3.send();