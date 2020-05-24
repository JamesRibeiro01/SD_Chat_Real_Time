const express = require('express'); // vai fazer a tratativa de mostrar o arquivo estatico
const path = require('path'); //padrão do node

const app = express(); //informar ao app que vai ter uma porta que vai ser acessada pelo socket
const server = require('http').createServer(app); //Definindo o protocolo HTTP
const io = require('socket.io')(server) //Procolo wss


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

function encryptedMessage(message, criptoOption) {
    var chave = '';
    var CARACTERES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var encrypted = '';
    //console.log(message, criptoOption)
    //console.log(message.length)
    chave = message.length;
    message = message.toUpperCase();
    for (let caractere of message) {
        if (CARACTERES.includes(caractere)) {
            num = CARACTERES.search(caractere);
            if(criptoOption == 'SIM' || criptoOption == 'sim'){
                num = num + chave;
            }else if (criptoOption == 'NAO' || criptoOption == 'nao'){
                num = num - chave
            }

            if(num >= CARACTERES.length){
                num = num - CARACTERES.length;
            }else if(num < 0){
                num = num + CARACTERES.length;
                encrypted = encrypted + CARACTERES[num];
            }else{
                encrypted = encrypted + caractere;
            }
    
            if(criptoOption == 'SIM' || criptoOption == 'sim'){
                console.log('Texto Criptografado é: ' + encrypted)
            }
        }


    }
}

let messages = []

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
        encryptedMessage(data.message, data.criptoOption);
    })

})
server.listen(3000);
