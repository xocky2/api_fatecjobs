const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');


const rotaAluno = require('./routes/aluno');
const rotaVaga = require('./routes/vaga');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false})); //apenas dados simples
app.use(bodyParser.json()); //apenas json de entrada no body

app.use('/aluno', rotaAluno);
app.use('/vaga', rotaVaga);

// Quando não econtra rota, entra aqui 
app.use((req,res,next)=>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});


//Tratamento de outros erros
app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;