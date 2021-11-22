const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//retorna todos os alunos
router.get('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM ALUNO;',
            (error, resultado,fields) =>{
                if(error){return res.status(500).send({error: error})}
                return res.status(200).send({response: resultado})
            }
        )
    });
});

//retorna um aluno em especifico
router.get('/login',(req, res, next)=>{
    const id = req.params.id_aluno;
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM ALUNO WHERE ra = ? AND senha= ?;',
            [req.body.ra,req.body.senha],
            (error, resultado,fields) =>{
                if(error){return res.status(500).send({error: error})}
                if (resultado.length){
                    return res.status(200).send({response: resultado})
                }else{
                    return res.status(200).send({response: "RA ou senha incorretos."})
                }
                
                
            }
        )
    })

});

//insere um aluno
router.post('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}

        conn.query(
            'insert into aluno (ra,email,senha,nome,bio,empregado,foto)values(?,?,?,?,?,?,?)',
            [req.body.ra, req.body.email,req.body.senha,req.body.nome,req.body.bio,req.body.empregado,req.body.foto],
            
            (error, resultado, field) => {
                conn.release();
                if(error){
                    if (error.errno == 1062){
                        return res.status(500).send({response: "RA já cadastrado"})
                    }
                    return res.status(500).send({error: error})
                }

                res.status(201).send({
                    mensagem: 'Aluno inserido com sucesso',
                    idaluno: resultado.insertId
                 });
            }
            
        )
    });

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