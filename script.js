const fs = require("fs");

let tempzz = JSON.parse(fs.readFileSync("./db/templateszz.json", "utf8"));//Берем шаблоны из JSON-файла

let campzz = JSON.parse(fs.readFileSync("./db/campzz.json", "utf8"));//Берем рассылки из JSON-файла

for (var i = 0; i < tempzz.length; i++) {
    for (var j = 0; j < campzz.length; j++) {
        if (tempzz[i].subject == campzz[j].subject) {
            tempzz[i].date = campzz[j].date;
            tempzz[i].count = campzz[j].count;
            tempzz[i].stats = campzz[j].stats;
            tempzz[i].clicks = campzz[j].clicks;
            tempzz[i].read = campzz[j].read;
            tempzz[i].spam = campzz[j].spam;
        }
    }
}// Собираем все для отображения на странице

//Создание сервера
const http = require("http");
const host = 'YOUR_IP_HERE'; //ex. 'localhost'
const port = 82; //ex. 80
//Рендер страниц
const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    if(req.url === "/home" || req.url === "/") {
        res.write(`<html><head><meta charset="utf-8"><title>Анализ шаблонов</title><style>body{margin: 0}.main{margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; width: 100%; background: linear-gradient(210deg, #D1C4E9, #A3B3DD, #6DA3C9);}.button{font-size: 32px; font-weight: 600; color: #ffffff; background-color: #1EB980; border-radius: 6px; transition: all .3s; box-shadow: 0 2px 10px #005D57; padding: 20px; margin: 10px 0; text-decoration: none; cursor:pointer;}.button:hover{box-shadow: 0 20px 30px -10px #005D57; font-size: 34px;}</style></head><body><div class="main"><h1>Выберите домен Unisender:</h1><a class="button" href="/domen1">Шаблоны с домена</a></div>`);//Указать на кнопке домен или добавить кнопки и добавить страницы для других доменов
        res.write(`</body></html>`); 
    }
    else if(req.url == "/domen1"){
        res.write(`<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Zanzaim</title><style>body{margin: 0; background: linear-gradient(210deg, #D1C4E9, #A3B3DD, #6DA3C9); padding: 10px; color: #0a0a0a;} a{font-size: 24px; font-weight: 600; color: #0a0a0a; cursor:pointer;}.all{font-size: 32px; margin: 10px 0 10px 0; text-align: center;}table{border: 5px solid #015C56; border-collapse: collapse;}.table_sort th{cursor:pointer; border: none; color: #33333D; background-color: #37EEBA; border: 3px solid #015C56; font-size: 21px;}.table_sort td{text-align: center; font-weight: 600; font-size: 18px; border: 3px solid #015C56;}</style></head><body><a href="/">&larr;Назад</a><p class="all">Всего шаблонов: ${tempzz.length}</p><table class="table_sort" border="1" width="100%">`);
        res.write(`<thead><tr><th>Последняя отправка &#8597;</th><th>Клики &#8597;</th><th>Число отправок &#8597;</th><th>Прочтения &#8597;</th><th>Жалобы &#8597;</th><th>Тема</th><th>Изображение</th></tr></thead>`);
        for (var i = 0; i < tempzz.length; i++){
            res.write(`<tr><td>${tempzz[i].date}</td><td>${tempzz[i].clicks}</td><td>${tempzz[i].count}</td><td>${tempzz[i].read}</td><td>${tempzz[i].spam}</td><td><a href="${tempzz[i].stats}" target="_blank">${tempzz[i].subject}</a></td><td><img src="${tempzz[i].pic}" width="300" height="400"></td></tr>`);
        }
        res.write(`</table><script>document.addEventListener('DOMContentLoaded', () => {

            const getSort = ({ target }) => {
                const order = (target.dataset.order = -(target.dataset.order || -1));
                const index = [...target.parentNode.cells].indexOf(target);
                const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
                const comparator = (index, order) => (a, b) => order * collator.compare(
                    a.children[index].innerHTML,
                    b.children[index].innerHTML
                );
                
                for(const tBody of target.closest('table').tBodies)
                    tBody.append(...[...tBody.rows].sort(comparator(index, order)));
        
                for(const cell of target.parentNode.cells)
                    cell.classList.toggle('sorted', cell === target);
            };
            
            document.querySelectorAll('.table_sort thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));
            
        });</script></body></html>`);
    }//Создаем страницу по адресу host:port/domen1 на которой в таблице отображаем статистику от Unisender и делаем сортировки на JS, чтобы сортировать рассылки по клику на название столбца
    else{
        res.write("<h2>404 - Not found</h2>");
    }
    res.end();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Сервер запущен, статистика отправок на: http://${host}:${port}`);
});
