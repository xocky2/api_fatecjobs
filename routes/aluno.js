const express = require('express');
const router = express.Router();


//retorna todos os alunos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Usando o GET dentro da rota de Alunos'
    });
});

//insere um aluno
router.post('/', (req, res, next) => {
    const aluno = {
        nome: req.body.nome,
        ra: req.body.ra
    };
    res.status(201).send({
        mensagem: 'Usando o POST dentro da rota de Alunos',
        alunoCriado: aluno
     });
});

//retorna um aluno em especifico
router.get('/:id_aluno',(req, res, next)=>{
    const id = req.params.id_aluno;
    if(id == 1){
        res.status(200).send({
            mensagem: 'Usando o GET de um aluno especifico',
            id: id
        })
    }else {
        res.status(200).send({
            mensagem: 'Usange o GET de um aluno especifico id genérico'
        });
    };

});

//altera um aluno
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH dentro da rota de Alunos'
     });
});

//deleta um aluno
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o DELETE dentro da rota de Alunos'
     });
});


module.exports = router;