const express = require('express');
const app = express();
const morgan = require('morgan');
//const bodyParser = require('body-parser');
const cors = require('cors');


const rotaAluno = require('./routes/aluno');
const rotaEmpresa = require('./routes/empresa');
const rotaVaga = require('./routes/vaga');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false })) //apenas dados simples
app.use(express.json())//apenas json de entrada no body
app.use(cors());

/*

app.use((req,res,next)=>{
    res.header('Acces-Control-Allow-Origin','*');
    res.header('Acces-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type,Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
})

*/

app.use('/aluno', rotaAluno);
app.use('/empresa', rotaEmpresa);
app.use('/vaga', rotaVaga);


// Quando não econtra rota, entra aqui 
app.use((req,res,next)=>{
    const erro = new Error('Ops, rota não encontrada');
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