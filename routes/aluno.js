const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const mysql2 = require('../mysql');
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

//retorna todos os alunos REFAT
router.get('/', async(req, res, next) => {
    if(req.query.id_aluno){
    try {
        const result = await mysql2.execute(`SELECT id_aluno,ra,email,nome,telefone,bio,empregado,foto FROM aluno where id_aluno = ${req.query.id_aluno};`);
        return res.status(200).send({response: result});
    } catch (error) {
        return res.status(500).send({error: error})
    }
}else{
    try {
        const result = await mysql2.execute(`SELECT id_aluno,ra,email,nome,telefone,bio,empregado,foto FROM aluno;`);
        return res.status(200).send({response: result});
    } catch (error) {
        return res.status(500).send({error: error})
    }
}

});
//retorna o usuario do login REFAT

router.post('/login',async (req, res, next)=>{
    if(req.body.ra & req.body.senha){
        try {
            const result = await mysql2.execute(`SELECT id_aluno,ra,email,nome,telefone,bio,empregado,foto,github FROM aluno WHERE ra = ? AND senha= ?;`,
            [req.body.ra,req.body.senha]);
            if(result.length){
                const response = {
                    success: "true",
                    data: result.map(alu =>{
                        return {
                            id_aluno: alu.id_aluno,
                            ra: alu.ra,
                            email: alu.email,
                            nome: alu.nome,
                            telefone : alu.telefone,
                            bio: alu.bio,
                            empregado: alu.empregado,
                            foto: alu.foto,
                            github: alu.github
                        }
                    })
                }
                return res.status(201).send({response})
            }else{
                return res.status(401).send({response: "RA ou senha incorretos."});
            }
        } catch (error) {
            return res.status(500).send({error: error})
        }
    }

});

//insere um aluno REFAT
router.post('/',upload.single('aluno_imagem'), async(req, res, next) => { 
    if ( req.body.senha === req.body.confirmPassword){
        try {
            if (req.file){
                return res.status(201).send({response: "IMG NOT WORKING !!!"});
            }else{
                try {
                    const result = await mysql2.execute(`insert into aluno (ra,email,senha,nome,telefone,bio,empregado,foto,github)values(?,?,?,?,?,?,?,?,?)`,
                        [req.body.ra,req.body.email,req.body.senha,req.body.nome,req.body.telefone,req.body.bio,req.body.empregado,null,req.body.github]);
                        if(result){
                            try {
                                const result2 = await mysql2.execute(`SELECT id_aluno,ra,email,nome,telefone,bio,empregado,foto,github FROM aluno WHERE id_aluno  = ?;`,
                                [result.insertId]);
                                if(result2.length){
                                    const response = {
                                        success: "true",
                                        data: result2.map(alu =>{
                                            return {
                                                id_aluno: alu.id_aluno,
                                                ra: alu.ra,
                                                email: alu.email,
                                                nome: alu.nome,
                                                telefone : alu.telefone,
                                                bio: alu.bio,
                                                empregado: alu.empregado,
                                                foto: alu.foto,
                                                github: alu.github
                                            }
                                        })
                                    }
                                    return res.status(201).send({response});
                                }else{
                                    return res.status(401).send({response: "Aluno não cadastrado"})
                                }
                            } catch (error) {
                                console.log(error)
                                return res.status(500).send({error: error})
                            }
                            
                                
                        }

                } catch (error) {
                        if (error.errno == 1062){
                            return res.status(401).send({response: "RA já cadastrado"})
                        }
                        return res.status(500).send({error: error})
                }
            }
        } catch (error) {
            return res.status(500).send({error: error});
        }
    }else{
        return res.status(401).send({response: "Senhas não coincidem"})
    }
});

//altera um aluno REFAT
router.patch('/', async(req, res, next) => {
    try {
        const result = await mysql2.execute(`UPDATE ALUNO SET ra =?, email = ?, senha = ?, nome = ?, bio = ?, empregado = ?, foto = ?, github = ? where id_aluno = ?;`,
        [req.body.ra, req.body.email,req.body.senha,req.body.nome,req.body.bio,req.body.empregado,req.body.foto, req.body.github, req.body.id_aluno]);

        if (result.affectedRows == 0 ) {
            return res.status(401).send({response: "Aluno não alterado"})
        }else{
            res.status(202).send({response: 'Dados alterados coom sucesso'});
        }

    } catch (error) {
        return res.status(500).send({error: error})
    }
});

//deleta um aluno REFAT
router.delete('/', async(req, res, next) => {
    if(req.body.id_aluno){
        try {
            const result = await mysql2.execute(`DELETE FROM aluno WHERE id_aluno= ?;`,
            [req.body.id_aluno]);
            if (result.affectedRows =0 ) {
                return res.status(500).send({response: "Aluno não excluido"})
            }else{
                res.status(200).send({mensagem: 'Aluno excluido com sucesso'});
            }
        } catch (error) {
            return res.status(500).send({error: error})
        }
    }
    
});

module.exports = router;




