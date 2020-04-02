const express = require('express'); // vai fazer a tratativa de mostrar o arquivo estatico
const path = require('path'); //padrão do node

const app = express(); //informar ao app que vai ter uma porta que vai ser acessada pelo socket
const server = require('http').createServer(app); //Definindo o protocolo HTTP
const io = require('socket.io')(server) //Procolo wss


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) =>{
    res.render('index.html');
});


let messages = []

io.on('connection', socket =>{
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('sendMessage', data =>{
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })
})

server.listen(3000);