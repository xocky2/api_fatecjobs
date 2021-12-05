conn.query(`SELECT id_vaga_fk,id_candidatura,id_aluno, ra,email,nome,telefone,bio FROM candidatura inner join aluno on candidatura.id_aluno_fk = aluno.id_aluno where id_vaga_fk = ?;`,
    [json[x]['id_vaga']],
    (error, resultado1,fields) =>{
        
        if(error){return res.status(500).send({error: error})}

    });