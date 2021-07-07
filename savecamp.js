const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require("fs");
const dateFormat = require("dateformat");
var now = new Date();
now.setDate(now.getDate() - 1);

var date = dateFormat(now, "yyyy-mm-dd hh:MM:ss");
var xhr = new XMLHttpRequest();
var xhr3 = new XMLHttpRequest();
var xhr4 = new XMLHttpRequest();
var campzz = new Array();
var camp2zz = new Array();
var statzz = new Array();
var counter = 1;

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var obj = JSON.parse(this.responseText);
        for (var i = 0; i < obj.result.length; i++) {
            if (obj.result[i].sender_email == 'YOUR_EMAIL_ADRESS' && (obj.result[i].list_id == 14416237 || obj.result[i].list_id == 19485335) && obj.result[i].status != 'canceled') {
                campzz.push({
                    id: obj.result[i].id,
                    subject: obj.result[i].subject,
                    date: obj.result[i].start_time,
                    count: 1,
                    stats: obj.result[i].stats_url,
                    clicks: 0,
                    read: 0,
                    spam: 0
                });
            }
        }//Создаем массив с рассылками от нужного нам адреса уходящих по нужным нам спискам и статусом "Завершена"
        console.log("Поиск кампаний ZZ....");
        for (var j = 0; j < campzz.length; j++) {
            //Формируем статистику по каждой рассылке
            var clicksc, readc, spamc = 0;
            let obj_temp = campzz[j];
            var cont = false;
            for(var f = 0; f < camp2zz.length; f++) {
                if(camp2zz[f].subject === obj_temp.subject) {
                    cont = true;
                    break;
                }
            }
            if(cont) {
                continue;
            }
            xhr3.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var obj3 = JSON.parse(this.responseText);
                    statzz.push({
                        clicks: obj3.result.clicked_all,
                        read: obj3.result.read_all,
                        spam: obj3.result.spam
                    });
                }
                else {
                    obj3 = false;
                }
            };
            xhr3.open("GET", `https://api.unisender.com/ru/api/getCampaignCommonStats?format=json&api_key=YOUR_API_KEY&campaign_id=${obj_temp.id}`, false);
            xhr3.send();
            clicksc = statzz[counter-1].clicks;
            readc = statzz[counter-1].read;
            if(statzz[counter-1].spam == undefined) {
                spamc = spamc;
            }
            else {
                spamc = spamc + statzz[counter-1].spam;
            }
            //Очищаем от дублей и подводим статистику
            for(var i=(j + 1); i < campzz.length; i++) {
                if(((obj_temp.subject === campzz[i].subject)) && ((obj_temp.date < campzz[i].date) == 1)){
                    obj_temp = campzz[i];
                    xhr4.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var obj4 = JSON.parse(this.responseText);
                            statzz.push({
                                clicks: obj4.result.clicked_all,
                                read: obj4.result.read_all,
                                spam: obj4.result.spam
                            });
                        }
                        else {
                            obj4 = false;
                        }
                    };
                    xhr4.open("GET", `https://api.unisender.com/ru/api/getCampaignCommonStats?format=json&api_key=YOUR_API_KEY&campaign_id=${obj_temp.id}`, false);
                    xhr4.send();
                    clicksc = clicksc + statzz[counter].clicks;
                    readc = readc + statzz[counter].read;
                    if(statzz[counter].spam == undefined) {
                        spamc = spamc;
                    }
                    else {
                        spamc = spamc + statzz[counter].spam;
                    }
                    counter++;
                }
            }
            obj_temp.count = counter;
            obj_temp.clicks = Math.round(clicksc/counter);
            obj_temp.read = Math.round(readc/counter);
            obj_temp.spam = Math.round(spamc/counter);
            clicksc = 0;
            readc = 0;
            spamc = 0;
            camp2zz.push(obj_temp);
            counter = 1;
            statzz = [];
        }
        var new_array = camp2zz.sort((a, b) => a.date.localeCompare(b.date));
        camp2zz = new_array;
        fs.writeFile("./db/campzz.json", JSON.stringify(camp2zz) , function(error){
            if(error) throw error; // если возникла ошибка
            console.log("Запись кампаний ZZ завершена.");//Завершена запись в БД на JSON рассылок одного домена
        });
    }
};
//Запрос на кампании
xhr.open("GET", `https://api.unisender.com/ru/api/getCampaigns?format=json&api_key=YOUR_API_KEY&from=2020-07-01 00:00:00&to=${date}`, false);//Меняем Api key и дату с которой начинать считать отправленные рассылки, анализируются рассылки по день до текущего дня
xhr.send();
