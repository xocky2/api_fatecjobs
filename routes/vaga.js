const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//retorna todas vagas ou se passar por parâmetro body o id da empresa
router.get('/', (req, res, next) => {
    if(req.body.idempresa){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT * FROM vaga where idempresa_fk = ?;`,
                [req.body.idempresa],
                (error, resultado,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                    return res.status(200).send({response: resultado});

                }
            )
        });
    }else{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM vaga;',
            (error, resultado,fields) =>{
                if(error){return res.status(500).send({error: error})}
                return res.status(200).send({response: resultado})
            }
        )
    });
    }
});

// candidaturas passando por parâmetro body o idaluno ou
router.get('/candidatura', (req, res, next) => {
    if(req.body.idaluno){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT * FROM vaga where idaluno_fk = ?;`,
                [req.body.idaluno],
                (error, resultado,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                    return res.status(200).send({response: resultado});

                }
            )
        });
    }else if (req.body.idvaga){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT * FROM vaga where idvaga_fk = ?;`,
                [req.body.idvaga],
                (error, resultado,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                    return res.status(200).send({response: resultado});

                }
            )
        });
    }
});

//insere uma vaga
router.post('/', (req, res, next) => {
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
    
            conn.query(
                'insert into vaga (idempresa_fk,descricao,localizacao,salario,tipo) values(?,?,?,?,?);',
                [req.body.idempresa, req.body.descricao, req.body.localizacao, req.body.salario, req.body.tipo],
                (error, resultado, field) => {
                    conn.release();
                    if(error){return res.status(500).send({error: error})}
                    res.status(201).send({
                        mensagem: 'Vaga cadastrada com sucesso',
                        idempresa: resultado.insertId
                     });
                }
                
            )
        });
    

});


//altera vaga
router.patch('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'UPDATE vaga SET descricao = ?,localizacao = ?,salario = ?,tipo = ?',
            [req.body.descricao, req.body.localizacao, req.body.salario, req.body.tipo],
            
            (error, resultado, field) => {
                conn.release();
                if(error){return res.status(500).send({error: error})}
                if (resultado.affectedRows == 0 ) {
                    return res.status(500).send({response: "Vaga não alterada"})
                }else{
                    res.status(202).send({response: 'Vaga alterada com sucesso'});
                }
                
            }
            
        )
    });
});

//deleta vaga
router.delete('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM vaga WHERE idvaga= ?',
            [req.body.idempresa],
            
            (error, resultado, field) => {
                conn.release();
                if(error){
                    return res.status(500).send({error: error})
                }

                if (resultado.affectedRows == 0 ) {
                    return res.status(500).send({response: "Vaga não excluida"})
                }else{
                    res.status(202).send({mensagem: 'Vaga excluida com sucesso'});
                }
                
            }
            
        )
    });
});


module.exports = router;