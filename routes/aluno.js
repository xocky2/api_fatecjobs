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
router.post('/login',(req, res, next)=>{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM ALUNO WHERE ra = ? AND senha= ?;',
            [req.body.ra,req.body.senha],
            (error, resultado,fields) =>{
                conn.release();
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
    if ( req.body.senha === req.body.confirmPassword){
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}

        conn.query(
            'insert into aluno (ra,email,senha,nome,bio,empregado,foto,github)values(?,?,?,?,?,?,?,?)',
            [req.body.ra, req.body.email,req.body.senha,req.body.nome,req.body.bio,req.body.empregado,req.body.foto, req.body.github],
            
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
}else{
    return res.status(500).send({response: "Senhas não coincidem"})
}

});


//altera um aluno
router.patch('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'UPDATE ALUNO SET ra =?, email = ?, senha = ?, nome = ?, bio = ?, empregado = ?, foto = ?, github = ? where idaluno = ?',
            [req.body.ra, req.body.email,req.body.senha,req.body.nome,req.body.bio,req.body.empregado,req.body.foto, req.body.github, req.body.idaluno],
            
            (error, resultado, field) => {
                conn.release();
                if(error){return res.status(500).send({error: error})}

                if (resultado.affectedRows == 0 ) {
                    return res.status(500).send({response: "Aluno não alterado"})
                }else{
                    res.status(202).send({response: 'Dados alterados com sucesso'});
                }
                
            }
            
        )
    });
});

//deleta um aluno
router.delete('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM aluno WHERE idaluno= ?',
            [req.body.idaluno],
            
            (error, resultado, field) => {
                conn.release();
                if(error){
                    return res.status(500).send({error: error})
                }

                if (resultado.affectedRows =0 ) {
                    return res.status(500).send({response: "Aluno não excluido"})
                }else{
                    res.status(202).send({mensagem: 'Aluno excluido com sucesso'});
                }
                
            }
            
        )
    });
});


module.exports = router;