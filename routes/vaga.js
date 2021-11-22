const express = require('express');
const router = express.Router();


//retorna todas as vagas
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna as vagas'
    });
});

//insere uma vaga
router.post('/', (req, res, next) => {
    const vaga = {
        descricao: req.body.descricao,
        localizacao: req.body.localzacao,
        salario: req.body.salario,
        tipo: req.body.tipo
    }

    res.status(201).send({
        mensagem: 'Vaga cadastrada',
        vagaCadastrada: vaga
     });
});

//retorna  vagas de acordo com o ID do ALUNO
router.get('/:id_aluno',(req, res, next)=>{
    const id = req.params.id_aluno;
    if(id == 1){
        res.status(200).send({
            mensagem: 'Vagas XYZ do ALUNO',
            id: id
        })
    }else {
        res.status(200).send({
            mensagem: 'Usange o GET de uma vaga especifica id genérico'
        });
    };

});

//retorna uma vaga de acordo com o ID da EMPRESA
router.get('/:id_empresa',(req, res, next)=>{
    const id = req.params.id_empresa;
    if(id == 1){
        res.status(200).send({
            mensagem: 'Vagas XYZ da empresa',
            id: id
        })
    }else {
        res.status(200).send({
            mensagem: 'Usange o GET de uma vaga especifica id genérico'
        });
    };

});


//deleta uma vaga
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Vaga excluida com sucesso'
     });
});

module.exports = router;