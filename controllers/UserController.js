const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')

const schemaRegister = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
})
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
})

var userController = {}

userController.register = async(req, res) => {
    const { error } = schemaRegister.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const existEmail = await User.findOne({ email: req.body.email });
    if (existEmail) return res.status(400).json({ error: 'Email ya registrado' })

    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
    });

    try {
        const savedUser = await user.save();
        res.json({
            error: null,
            data: savedUser
        })
    } catch (error) {
        res.status(404).json(error)
    }
};

userController.login = async(req, res) => {
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña no válida' })

    const token = jwt.sign({
        id: user._id,
        name: user.name
    }, process.env.TOKEN_SECRET)

    res.json({
        error: null,
        data: 'exito bienvenido',
        token: token
    })
}

module.exports = userController;