const express = require('express');
const router = express.Router();
const mysql = require('../mysql');
const mysql2 = require('../mysql').pool;

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
                        //console.log(tamanho2)
                        try {
                            if (tamanho2>0){
                                let x = 0;
                                while(tamanho2>x){
                                    vaga_cand = json2[x]['id_vaga_fk']
                                    //console.log(json2[x]['id_vaga_fk'])
                                   // console.log("I : "+i+" vaga : "+vaga)
                                   // console.log("X : "+x+" vaga_cand : "+vaga_cand)
                                    if (vaga == vaga_cand){
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
            
            return res.status(200).send({response: json});
        } catch (error) {
            return res.status(500).send({error: error})
        }
    }
});

//retorna todas vagas ou se passar por parâmetro query o id da empresa
// router.get('/', (req, res, next) => {
//     if(req.query.company){
//         mysql.getConnection((error,conn)=>{
//             if(error){return res.status(500).send({error: error})}
//             var json = {};
//             conn.query(
//                 `SELECT * FROM vaga where id_empresa_fk = ?;`,
//                 [req.query.company],
//                 (error, resultado,fields) =>{
//                     if(error){return res.status(500).send({error: error})}
//                     if(resultado.length >0){
//                         var string =JSON.stringify(resultado);
//                         var json =JSON.parse(string);
//                         //console.log(json.length)
//                         //console.log(json[1]['id_vaga'])
//                         //================================================================================================================================
//                        let tamanho = json.length 
//                        let vaga = 0;
//                        let vaga_cand = 0;
//                         for (let i =0;i<tamanho;i++){
//                             vaga = json[i]['id_vaga'];
//                             console.log('I ='+i+' vaga: '+vaga);
//                             conn.query(
//                                 `SELECT id_vaga_fk,id_candidatura,id_aluno, ra,email,nome,telefone,bio FROM candidatura inner join aluno on 
//                                 candidatura.id_aluno_fk = aluno.id_aluno where id_vaga_fk = ?;`,
//                                 [vaga],
//                                 (error, resultado2,fields) =>{
//                                     if(error){return res.status(500).send({error: error})}
//                                     if(resultado2.length >0){
//                                         var string2 =JSON.stringify(resultado2);
//                                         var json2 =JSON.parse(string2);
//                                         //console.log(json)
//                                         //console.log(json2)
                                       
//                                        let tamanho2 = json2.length;
//                                         for (let x = 0; x<tamanho2; x++){
//                                             vaga_cand = json2[x]['id_vaga_fk']
//                                             console.log('X ='+x+' vaga_cand: '+vaga_cand);

//                                             //console.log('I ='+i)
//                                             //console.log ('X ='+x)
//                                             if (vaga == vaga_cand){
//                                                 console.log("é")
//                                             }
//                                         }
                                        
//                                     }
//                                 });

//                         }
                        
//                        // console.log(json)
//                          return res.status(200).send({response: json});
//                         // adicionar um foreach ou for para não retornar todos os ids, retornar somente um id por vez
                                                
//                     }else{
//                         return res.status(404).send({response: "Não há vagas cadastradas"});
//                     }
                    
//                 }
//             )
            
            



//         });
//     }
//     else{
//         mysql.getConnection((error,conn)=>{
//             if(error){return res.status(500).send({error: error})}
//             conn.query(
//                 'SELECT * FROM vaga;',
//                 (error, resultado,fields) =>{
//                     if(error){return res.status(500).send({error: error})}
//                     return res.status(200).send({response: resultado})
//                 }
//             )
//         });
//     }
        
// });


// candidaturas passando por parâmetro body o id_aluno ou

router.get('/candidatura', async (req, res, next) => {
    if(req.body.id_aluno){
        try {
            const result = await mysql.execute(`SELECT * FROM candidatura inner join vaga on 
                candidatura.id_vaga_fk= vaga.id_vaga where candidatura.id_aluno_fk = ?;`,
                [req.body.id_aluno]);
                return res.status(200).send({response: result});

        } catch (error) {
            return res.status(500).send({error: error})
        }
        
                    
            
    }else if (req.body.id_vaga){
        try {
            const result = await mysql.execute(`SELECT candidatura.id_candidatura, candidatura.id_vaga_fk, aluno.id_aluno, 
        aluno.ra,aluno.email,aluno.nome,aluno.telefone,aluno.bio,aluno.empregado,aluno.foto,aluno.github 
        FROM candidatura inner join aluno on candidatura.id_aluno_fk= aluno.id_aluno where candidatura.id_vaga_fk = ?;`,
        [req.body.id_vaga]);
        return res.status(200).send({response: result})
        } catch (error) {
            return res.status(500).send({error: error})
        }
        
    }
});

// router.get('/candidatura', (req, res, next) => {
//     if(req.body.id_aluno){
//         mysql.getConnection((error,conn)=>{
//             if(error){return res.status(500).send({error: error})}
//             conn.query(
//                 `SELECT * FROM candidatura inner join vaga on 
//                 candidatura.id_vaga_fk= vaga.id_vaga where candidatura.id_aluno_fk = ?;`,
//                 [req.body.id_aluno],
//                 (error, resultado,fields) =>{
//                     conn.release();
//                     if(error){return res.status(500).send({error: error})}
//                     return res.status(200).send({response: resultado});

//                 }
//             )
//         });
//     }else if (req.body.id_vaga){
//         mysql.getConnection((error,conn)=>{
//             if(error){return res.status(500).send({error: error})}
//             conn.query(
//                 `SELECT candidatura.id_candidatura, candidatura.id_vaga_fk, aluno.id_aluno, aluno.ra,aluno.email,aluno.nome,aluno.telefone,aluno.bio,aluno.empregado,aluno.foto,aluno.github FROM candidatura inner join aluno on candidatura.id_aluno_fk= aluno.id_aluno where candidatura.id_vaga_fk = ?;`,
//                 [req.body.id_vaga],
//                 (error, resultado,fields) =>{
//                     conn.release();
//                     if(error){return res.status(500).send({error: error})}
//                     return res.status(200).send({response: resultado});

//                 }
//             )
//         });
//     }
// });

//Insere uma candidatura
router.post('/candidatura', (req, res, next) => {
    if (req.body.id_aluno, req.body.id_vaga){
        mysql2.getConnection((error,conn)=>{
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

                            mysql2.getConnection((error,conn)=>{
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
        mysql2.getConnection((error,conn)=>{
            if(error){return res.status(500).send({error: error})}
            conn.query(
                'SELECT * FROM empresa where id_empresa = ?;',
                [req.body.id_empresa],
                (error, result,fields) =>{
                    if(error){return res.status(500).send({error: error})}
                    //return res.status(500).send({response: resultado.length})
                    if(result.length == 1){
                        mysql2.getConnection((error,conn)=>{
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
    mysql2.getConnection((error,conn)=>{
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
    mysql2.getConnection((error,conn)=>{
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