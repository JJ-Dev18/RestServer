
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.get('/', usuariosGet );

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),

    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligaotorio").not().isEmpty(),
    check("password", "El password es obligaotorio minimo 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    check('rol').custom(esRoleValido),
    // check("rol", "No es un rol valido").isIn(['ADMIN_ROLE','USER_ROLE']),
    validarCampos
  ],usuariosPost);

router.delete('/:id',[
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
     validarCampos
], 
  usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;