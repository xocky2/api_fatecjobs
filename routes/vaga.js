const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//retorna todas vagas ou se passar por parâmetro body o id da empresa
router.get('/', (req, res, next) => {
    if(req.body.id_empresa){
        mysql.getConnection((error,conn)=>{
            if(error){return res.statutipos(500).send({error: error})}
            conn.query(
                `SELECT * FROM vaga where id_empresa_fk = ?;`,
                [req.body.id_empresa],
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

// candidaturas passando por parâmetro body o id_aluno ou
router.get('/candidatura', (req, res, next) => {
    if(req.body.id_aluno){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT * FROM candidatura inner join vaga on 
                candidatura.id_vaga_fk= vaga.id_vaga where candidatura.id_aluno_fk = ?;`,
                [req.body.id_aluno],
                (error, resultado,fields) =>{
                    conn.release();
                    if(error){return res.status(500).send({error: error})}
                    return res.status(200).send({response: resultado});

                }
            )
        });
    }else if (req.body.id_vaga){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT candidatura.id_candidatura, candidatura.id_vaga_fk, aluno.id_aluno, aluno.ra,aluno.email,aluno.nome,aluno.telefone,aluno.bio,aluno.empregado,aluno.foto,aluno.github FROM candidatura inner join aluno on candidatura.id_aluno_fk= aluno.id_aluno where candidatura.id_vaga_fk = ?;`,
                [req.body.id_vaga],
                (error, resultado,fields) =>{
                    conn.release();
                    if(error){return res.status(500).send({error: error})}
                    return res.status(200).send({response: resultado});

                }
            )
        });
    }
});

//Insere uma candidatura
router.post('/candidatura', (req, res, next) => {
    if (req.body.id_aluno, req.body.id_vaga){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT * FROM aluno where id_aluno = ?;`,
                [req.body.id_aluno],
                (error, resultado,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                   // return res.status(200).send({response: resultado});
                   if (resultado.length == 1){
                    conn.query(
                        `SELECT * FROM vaga where id_vaga = ?;`,
                        [req.body.id_vaga],
                        (error, resultado,fields) =>{
                            if(error){return res.status(500).send({error: error})}
                           // return res.status(200).send({response: resultado});
                           if (resultado.length == 1){

                            mysql.getConnection((error,conn)=>{
                                if(error){return res.status(500).send({error: error})}
                                conn.query('insert into candidatura (id_aluno_fk,id_vaga_fk) values(?,?);',
                                    [req.body.id_aluno, req.body.id_vaga],
                                    (error, resultado, field) => {
                                        conn.release();
                                        if(error){return res.status(500).send({error: error})}
                                        return res.status(201).send({
                                            response: 'Candidatura realizada com sucesso',
                                            id_candidatura: resultado.insertId
                                         });
                                    }
                                    
                                )
                            });



                           }else{
                            return res.status(404).send({error: "Vaga não encontrada"})
                           }
        
                        }
                    )
                   }else{
                    return res.status(404).send({error: "Aluno não encontrado"})
                   }

                }
            )
        });


}else{
    return res.status(401).send({
        response: 'id_aluno e id_vaga são campos obrigatórios'
     });
}


});

//insere uma vaga
router.post('/', (req, res, next) => {
    if (req.body.id_empresa){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                'SELECT * FROM empresa where id_empresa = ?;',
                [req.body.id_empresa],
                (error, result,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                    //return res.status(500).send({response: resultado.length})
                    if(result.length == 1){
                        mysql.getConnection((error,conn)=>{
                            if(error){return res.status(500).send({error: error})}
                            conn.query(
                                'insert into vaga (id_empresa_fk,titulo,descricao,localizacao,salario,tipo) values(?,?,?,?,?,?);',
                                [req.body.id_empresa,req.body.titulo,req.body.descricao, req.body.localizacao, req.body.salario, req.body.tipo],
                                (error, resultado, field) => {
                                    conn.release();
                                    if(error){return res.status(500).send({error: error})}
                                    res.status(201).send({
                                        response: 'Vaga cadastrada com sucesso',
                                        id_vaga: resultado.insertId
                                     });
                                }
                                
                            )
                        });
                    }else{
                        return res.status(404).send({
                            response: 'Empresa não econtrada'
                         });

                    }

                }
            )
        });

    }else{
        return res.status(401).send({
            response: 'id_empresa é um dado obrigatório'
         });
    }
    

});


//altera vaga
router.patch('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'UPDATE vaga SET descricao = ?,localizacao = ?,salario = ?,tipo = ? where id_vaga = ?' ,
            [req.body.descricao, req.body.localizacao, req.body.salario, req.body.tipo, req.body.id_vaga],
            
            (error, resultado, field) => {
                conn.release();
                if(error){return res.status(500).send({error: error})}
                if (resultado.affectedRows == 0 ) {
                    return res.status(401).send({response: "Vaga não alterada ou não encontrada"})
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
            'DELETE FROM vaga WHERE id_vaga= ?',
            [req.body.id_vaga],
            
            (error, resultado, field) => {
                conn.release();
                if(error){
                    return res.status(500).send({error: error})
                }

                if (resultado.affectedRows == 0 ) {
                    return res.status(500).send({response: "Vaga não excluida"})
                }else{
                    res.status(202).send({response: 'Vaga excluida com sucesso'});
                }
                
            }
            
        )
    });
});


module.exports = router;