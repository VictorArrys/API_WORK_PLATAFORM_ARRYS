const express = require('express')
const router = express.Router()
const fs = require('fs')

const { validarQuery } = require('../../utils/validaciones/validarQuery')


//Respuestas
const mensajes = require('../../utils/mensajes')

const pathRouter = `${__dirname}`

const removerExtension = (fileName) =>{
    return fileName.split('.').shift()
}

fs.readdirSync(pathRouter).filter((file) =>{
    const fileWithoutExt = removerExtension(file)
    const skip = ['routes'].includes(fileWithoutExt)

    if(!skip){
        router.use(`${fileWithoutExt}`, require(`./${fileWithoutExt}`))
    }

})

router.get('*', (req,res) =>{
    console.log('La ruta que busca no existe')
    res.status(404)
    res.json(mensajes.peticionNoEncontrada)

})

module.exports = router
