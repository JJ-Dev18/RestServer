const { response, request } = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    const {limite = 5,desde= 1 } = req.query;
    const query = {estado : true}
  

     const [total, usuarios ] = await Promise.all([
         Usuario.countDocuments(query),
         Usuario.find(query)
         .skip(Number(desde))
         .limit(Number(limite))

     ])
    res.json({
       total,
       usuarios
    });
}

const usuariosPost = async (req, res = response) => {

  
    
    const {nombre,correo,password,rol} = req.body;
    const usuario = new Usuario({nombre,correo,password,rol});
     //Verificar si el correo existe 
     
    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password,salt)

    await usuario.save()
    res.json({
        msg: 'post API - usuariosPost',
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const {_id,password, google,correo, ...rest} = req.body;

    //TODO Validar contra bse de datos
    if(password){
         const salt = bcrypt.genSaltSync();
         rest.password = bcrypt.hashSync(password, salt);
    }
     
    const usuario = await Usuario.findByIdAndUpdate(id,rest)
    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params
    //Fisicamente lo borramos 

    const usuario = await Usuario.findByIdAndUpdate(id,{estado : false})
    res.json({
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}