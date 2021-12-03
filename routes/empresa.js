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


//retorna todas empresas
router.get('/', (req, res, next) => {
    if(req.body.nome_fantasia){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT id_empresa,email,nome_fantasia,area_atuacao,telefone,cidade,bio,foto FROM empresa where nome_fantasia like ("%${req.body.nome_fantasia}%");`,
                (error, resultado,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                    return res.status(200).send({response: resultado});
                   

                }
            )
        });
        //return res.status(200).send({response: req.body})
        //prcura por ID
    }else if(req.body.id_empresa){
        mysql.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                `SELECT id_empresa,email,nome_fantasia,area_atuacao,telefone,cidade,bio,foto FROM empresa where id_empresa = ${req.body.id_empresa};`,
                (error, resultado,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                    if (!resultado.length){return res.status(404).send({response: "Empresa não encontrada"})};
                    return res.status(200).send({response: resultado});
                   

                }
            )
        });

    }else{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT id_empresa,email,nome_fantasia,area_atuacao,telefone,cidade,bio,foto FROM empresa;',
            (error, resultado,fields) =>{
                if(error){return res.status(500).send({error: error})}
                return res.status(200).send({response: resultado})
            }
        )
    });
    }
});

//login empresa
router.post('/login',(req, res, next)=>{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT id_empresa,email,nome_fantasia,area_atuacao,telefone,cidade,bio,foto FROM empresa WHERE email = ? AND senha= ?;',
            [req.body.email,req.body.senha],
            (error, resultado,fields) =>{
                conn.release();
                if(error){return res.status(500).send({error: error})}
                if (resultado.length){
                    return res.status(200).send({response: resultado})
                 /*  
                   const response = {
                    success: "true",
                    data: resultado.map(empr =>{
                        return {
                            email: empr.email,
                            nome_fantasia: empr.nome_fantasia,
                            telefone: empr.telefone,
                            area_atuacao: empr.area_atuacao,
                            cidade : empr.cidade,
                            bio: empr.bio
                        }
                    })
                }

                return res.status(201).send({
                    response
                 })
                 */
                }else{
                    return res.status(401).send({response: "Email ou senha incorretos."})
                }
                
                
            }
        )
    })

});

//insere uma empresa
router.post('/',  upload.single('empresa_imagem'),(req, res, next) => {
    if ( req.body.senha === req.body.confirmPassword){
        // if para verificar se existe um arquivo na requisição
        if (req.file){ 
            mysql.getConnection((error,conn)=>{
                if(error){return res.status(500).send({error: error})}
        
                conn.query(
                    'insert into empresa (email,senha,nome_fantasia,area_atuacao,cidade,bio,foto) values(?,?,?,?,?,?,?);',
                    [req.body.email, req.body.senha, req.body.nome_fantasia, req.body.area_atuacao, req.body.cidade, req.body.bio, req.file.path],
                    
                    (error, resultado, field) => {
                        conn.release();
                        if(error){
                            if (error.errno == 1062){
                                return res.status(401).send({response: "Email já cadastrado"})
                            }
                            return res.status(500).send({error: error})
                        }
                        
                        res.status(201).send({
                            
                         });
                    }
                    
                )
            });
            // caso não exista uma file na requisião ele cai neste else e faz um insert null no banco
        }else{
            mysql.getConnection((error,conn)=>{
                if(error){return res.status(500).send({error: error})}
        
                conn.query(
                    'insert into empresa (email,senha,nome_fantasia,area_atuacao,cidade,bio,foto) values(?,?,?,?,?,?,?);',
                    [req.body.email, req.body.senha, req.body.nome_fantasia, req.body.area_atuacao, req.body.cidade, req.body.bio,null],
                    
                    (error, resultado, field) => {
                        if(error){
                            if (error.errno == 1062){
                                return res.status(401).send({response: "Email já cadastrado"})
                            }
                            return res.status(500).send({error: error})
                        }
                        //res.status(201).send({ });
                        conn.query(
                            'select * from empresa where id_empresa = ?;',
                            [resultado.insertId],
                            (error, result, field) => {
                                conn.release();
                                if(error){
                                    return res.status(500).send({error: error})
                                }
                                if(result.length == 1){
                                  const response = {
                                    success: "true",
                                    data: result.map(empr =>{
                                        return {
                                            email: empr.email,
                                            nome_fantasia: empr.nome_fantasia,
                                            telefone: empr.telefone,
                                            area_atuacao: empr.area_atuacao,
                                            cidade : empr.cidade,
                                            bio: empr.bio
                                        }
                                    })
                                }
                                return res.status(201).send({
                                    response
                                 })
                                }
                                
        
                              
                            }
                            
                        )
                    }
                    
                )
                
                

            });
        }
        
    }else{
        return res.status(401).send({response: "Senha não coincidem"})
    }
    

});


//altera empresa
router.patch('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'UPDATE empresa SET email =?, senha = ?, nome_fantasia = ?, area_atuacao = ?,cidade = ?, bio = ?, foto = ? where id_empresa = ?;',
            [req.body.email, req.body.senha, req.body.nome_fantasia, req.body.area_atuacao, req.body.cidade, req.body.bio, req.body.foto, req.body.id_empresa],
            
            (error, resultado, field) => {
                conn.release();
                if(error){return res.status(500).send({error: error})}

                if (resultado.affectedRows == 0 ) {
                    return res.status(500).send({response: "Empresa não alterada"})
                }else{
                    res.status(202).send({response: 'Dados alterados com sucesso'});
                }
                
            }
            
        )
    });
});

//deleta empresa
router.delete('/', (req, res, next) => {
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM empresa WHERE id_empresa= ?',
            [req.body.id_empresa],
            
            (error, resultado, field) => {
                conn.release();
                if(error){
                    return res.status(500).send({error: error})
                }

                if (resultado.affectedRows == 0 ) {
                    return res.status(500).send({response: "empresa não excluida"})
                }else{
                    res.status(202).send({response: 'Empresa excluida com sucesso'});
                }
                
            }
            
        )
    });
});


module.exports = router;