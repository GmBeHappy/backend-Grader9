const bcrypt = require('bcryptjs')
const {validatorRegister} = require('../../validation')
const {UserModel} = require('../../models')

module.exports = function registerUser(req, res) {
    const { err, isValid } = validatorRegister(req.body)

    if (!isValid) {
        return res.status(400).json(err);
    }

    UserModel.findOne({nickName: req.body.nickName})
    .then(user => {
        if (user) {
            return res.status(400).json({ nickName: "Nickname already exists" })
        } else {
            const newUser = new UserModel({
                nickName: req.body.nickName,
                password: req.body.password,
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    newUser.password = hash
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
        }
    })
}