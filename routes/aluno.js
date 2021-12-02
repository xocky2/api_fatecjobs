const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, './uploads/')
    },
    
    filename: function(req,file,cb){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
});
const upload = multer({storage: storage});



//retorna todos os alunos
router.get('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT id_aluno,ra,email,nome,telefone,bio,empregado,foto,github FROM aluno;',
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
            'SELECT id_aluno,ra,email,nome,telefone,bio,empregado,foto,github FROM aluno WHERE ra = ? AND senha= ?;',
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
router.post('/',upload.single('aluno_imagem'), (req, res, next) => { 
    //console.log(req.file);
        if ( req.body.senha === req.body.confirmPassword){
            if (req.file){
                mysql.getConnection((error,conn)=>{
                    if(error){return res.status(500).send({error: error, path:storage.destination})}
        
                    conn.query(
                        'insert into aluno (ra,email,senha,nome,telefone,bio,empregado,foto,github)values(?,?,?,?,?,?,?,?,?)',
                        [req.body.ra,req.body.email,req.body.senha,req.body.nome,req.body.telefone,req.body.bio,req.body.empregado,req.file.path, req.body.github],
                        
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
                                id_aluno: resultado.insertId
                             });
                        }
                        
                    )
                });
            }else{
                mysql.getConnection((error,conn)=>{
                    if(error){return res.status(500).send({error: error, path:storage.destination})}
        
                    conn.query(
                        'insert into aluno (ra,email,senha,nome,telefone,bio,empregado,foto,github)values(?,?,?,?,?,?,?,?,?)',
                        [req.body.ra,req.body.email,req.body.senha,req.body.nome,req.body.telefone,req.body.bio,req.body.empregado,null, req.body.github],
                        
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
                                id_aluno: resultado.insertId
                             });
                        }
                        
                    )
                });
            }
    
}else{
    return res.status(500).send({response: "Senhas não coincidem"})
}

});


//altera um aluno
router.patch('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'UPDATE ALUNO SET ra =?, email = ?, senha = ?, nome = ?, bio = ?, empregado = ?, foto = ?, github = ? where id_aluno = ?',
            [req.body.ra, req.body.email,req.body.senha,req.body.nome,req.body.bio,req.body.empregado,req.body.foto, req.body.github, req.body.id_aluno],
            
            (error, resultado, field) => {
                conn.release();
                if(error){return res.status(500).send({error: error})}

                if (resultado.affectedRows == 0 ) {
                    return res.status(500).send({response: "Aluno não alterado"})
                }else{
                    res.status(202).send({response: 'Dados alterados csom sucesso'});
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
            'DELETE FROM aluno WHERE id_aluno= ?',
            [req.body.id_aluno],
            
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