const express=require("express");
const router=express.Router();

const{
    login,
    register,
    obtenerPerfil
}=require("../controllers/authController");
const { verificarToken } = require("../middlewares/auth");

router.post("/login",login);
router.post("/register",register);
router.get("/me", verificarToken, obtenerPerfil);

module.exports = router;