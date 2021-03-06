const express = require('express');
const router = express.Router();
const mysql = require('../mysql');
const mysql2 = require('../mysql').pool;


// get vagas REFAT
router.get('/', async (req, res, next) => {
    if (req.query.company){
        try {
            const result = await mysql.execute("SELECT * FROM vaga where id_empresa_fk = ?;",[req.query.company]);
            let string =JSON.stringify(result);
            let json =JSON.parse(string);
            let tamanho = json.length 
            if (tamanho>0){
                for (let i =0;i<tamanho;i++){
                    vaga = json[i]['id_vaga'];
                   const result2 = await mysql.execute(`SELECT id_vaga_fk,id_candidatura,id_aluno, ra,email,nome,telefone,bio FROM candidatura inner join aluno on 
                    candidatura.id_aluno_fk = aluno.id_aluno where id_vaga_fk = ?;`,[vaga]);
                        let string2 =JSON.stringify(result2);
                        let json2 =JSON.parse(string2);
                        let tamanho2 = json2.length;
                        //console.log(tamanho2)
                        try {
                            if (tamanho2>0){
                                console.log("entrou")
                                let x = 0;
                                while(tamanho>x){
                                    vaga_cand = json2[x]['id_vaga_fk']
                                    console.log("I : "+i+" vaga : "+vaga)
                                    console.log("X : "+x+" vaga_cand : "+vaga_cand)
                                    if (vaga == vaga_cand){
                                        console.log("é")
                                       // console.log(json2)
                                        json[i].candidatura = json2                         
                                    }
                                    x++;
                                }
                                
                            }
                        } catch (error) {
                            console.log(error)
                        }
                         

    
                }
            }
            
            return res.status(200).send(json);
        } catch (error) {
            return res.status(500).send({error: error})
        }
            
    }else{
        try {
            const result = await mysql.execute("SELECT * FROM vaga ;",);
            let string =JSON.stringify(result);
            let json =JSON.parse(string);
            let tamanho = json.length 
            if (tamanho>0){
                for (let i =0;i<tamanho;i++){
                    vaga = json[i]['id_vaga'];
                   const result2 = await mysql.execute(`SELECT id_vaga_fk,id_candidatura,id_aluno, ra,email,nome,telefone,bio FROM candidatura inner join aluno on 
                    candidatura.id_aluno_fk = aluno.id_aluno where id_vaga_fk = ?;`,[vaga]);
                        let string2 =JSON.stringify(result2);
                        let json2 =JSON.parse(string2);
                        let tamanho2 = json2.length;
                        try {
                            if (tamanho2>0){
                                let x = 0;
                                while(tamanho2>x){
                                    vaga_cand = json2[x]['id_vaga_fk']
                                    if (vaga == vaga_cand){
                                        json[i].candidatura = json2                         
                                    }
                                    x++;
                                }
                                
                            }
                        } catch (error) {
                            console.log(error)
                        }
                         

    
                }
            }
            
            return res.status(200).send({response: json});
        } catch (error) {
            return res.status(500).send({error: error})
        }
    }
});


// get candidaturas passando por parâmetro body o id_aluno ou id_vaga REFAT
router.get('/candidatura', async (req, res, next) => {
    if(req.query.id_aluno){
        try {
            const result = await mysql.execute(`SELECT * FROM candidatura inner join vaga on 
                candidatura.id_vaga_fk= vaga.id_vaga where candidatura.id_aluno_fk = ?;`,
                [req.query.id_aluno]);
                if(result){
                    return res.status(200).send({response: result})
                }else{
                    return res.status(404).send({response: "Nenhuma candidatura encontrada para o aluno "+req.query.id_aluno});
                }
                return res.status(200).send({response: result});

        } catch (error) {
            return res.status(500).send({error: error})
        }
        
                    
            
    }else if (req.query.id_vaga){
        try {
            const result = await mysql.execute(`SELECT candidatura.id_candidatura, candidatura.id_vaga_fk, aluno.id_aluno, 
        aluno.ra,aluno.email,aluno.nome,aluno.telefone,aluno.bio,aluno.empregado,aluno.foto,aluno.github 
        FROM candidatura inner join aluno on candidatura.id_aluno_fk= aluno.id_aluno where candidatura.id_vaga_fk = ?;`,
        [req.query.id_vaga]);
        if(result){
            return res.status(200).send({response: result})
        }else{
            return res.status(404).send({response: "Nenhuma candidatura encontrada para a vaga "+req.query.id_vaga});
        }
        
        } catch (error) {
            return res.status(500).send({error: error})
        }
        
    }
});


//Insere uma candidatura REFAT
router.post('/candidatura', async(req, res, next) => {
    try {
        if (req.body.id_aluno, req.body.id_vaga){
            const result = await mysql.execute(`SELECT * FROM aluno where id_aluno = ?;`,
            [req.body.id_aluno]);

            if (result.length == 1){
                try {
                    const result2 = await mysql.execute(`insert into candidatura (id_aluno_fk,id_vaga_fk) values(?,?);`,
                    [req.body.id_aluno, req.body.id_vaga]);

                    if(result2){
                        console.log(result2.insertId);
                        try {
                            const result3 = await mysql.execute(`select id_candidatura,nome_fantasia,titulo,descricao from candidatura 
                        inner join vaga on id_vaga_fk = vaga.id_vaga inner join empresa on vaga.id_empresa_fk = empresa.id_empresa where id_candidatura = ?;`,
                            [result2.insertId]);
                            const response = {
                                success: "true",
                                data: result3.map(cand =>{
                                    return {
                                        id_candidatura: cand.id_candidatura,
                                        nome_fantasia: cand.nome_fantasia,
                                        titulo: cand.titulo,
                                        descricao: cand.descricao
                                    }
                                })
                            }
                            return res.status(201).send({response});

                        } catch (error) {
                            return res.status(500).send({error: error})
                        }
                        
                    }

                } catch (error) {
                    return res.status(500).send({error: error})
                }
                

                
            }else{
                return res.status(404).send({error: "Vaga não encontrada"})
            }
        }else{
        return res.status(401).send({
            response: 'id_aluno e id_vaga são campos obrigatórios'
        });
    }
    } catch (error) {
        return res.status(500).send({error: error})
    }
    
});

//insere uma vaga REFAT
router.post('/', async(req, res, next) => {
    if(req.body.id_empresa){
        try {
            const result = await mysql.execute(`SELECT * FROM empresa where id_empresa = ?;`,
                [req.body.id_empresa]);
               // return res.status(200).send({response: result});
            if(result.length == 1){
                try {
                    const result = await mysql.execute(`insert into vaga 
                    (id_empresa_fk,titulo,descricao,localizacao,salario,tipo) 
                    values(?,?,?,?,?,?);`,
                    [req.body.id_empresa,req.body.titulo,req.body.descricao, 
                    req.body.localizacao, req.body.salario, req.body.tipo]);
                    //return res.status(200).send({response: result});
                 const insertid = result.insertId;
                    try {
                        console.log(insertid)
                        const result2 = await mysql.execute(`SELECT * FROM vaga WHERE id_vaga = ?;`,
                        [insertid]);
                        if(result2.length==1){
                            const response ={
                                message: "Vaga cadastrada com sucesso.",
                                data: result2.map(vag =>{
                                    return {
                                        tipo: vag.tipo,
                                        salario: vag.salario,
                                        id_empresa: vag.id_empresa,
                                        titulo: vag.titulo,
                                        localizacao: vag.localizacao,
                                        descricao: vag.descricao
                                    }
                                })
                            }
                            return res.status(201).send({response: response})
                        }
                        
                    } catch (error) {
                        console.log(error)
                        return res.status(500).send({error: error})
                    }

                } catch (error) {
                    return res.status(500).send({error: error})
                }
            }else{
                return res.status(404).send({message: 'Empresa não encontrada'})
            }
        } catch (error) {
            return res.status(500).send({error: error});
        }
        
    }else{
        return res.status(500).send({response: 'id_empresa é um dado obrigatório'});
    }

});
//altera vaga REFAT
router.patch('/', async (req, res, next) => {
    try {
        const result = await mysql.execute(`UPDATE vaga SET descricao = ?,localizacao = ?,salario = ?,tipo = ? where id_vaga = ?;`,
        [req.body.descricao, req.body.localizacao, req.body.salario, req.body.tipo, req.body.id_vaga]);

        if (result.affectedRows == 0 ) {
            return res.status(401).send({response: "Vaga não alterada ou não encontrada"})
        }else{
            res.status(202).send({response: 'Vaga alterada com sucesso'});
        }
    } catch (error) {
        return res.status(500).send({error: error})
    }
    

});
//deleta vaga REFAT
router.delete('/', async (req, res, next) => {
    if(req.body.id_vaga){
        try {
            const result = await mysql.execute(`DELETE FROM vaga WHERE id_vaga= ?`,
            [req.body.id_vaga]);
            if (result.affectedRows == 0 ) {
                return res.status(500).send({response: 'Vaga não excluida'});
            }else{
                res.status(202).send({response: 'Vaga excluida com sucesso'});
            }
        } catch (error) {
            return res.status(500).send({error: error});
        }
    }else{
        res.status(404).send({response: 'id_vaga é um campo obrigatório'});
    }
});

module.exports = router;
