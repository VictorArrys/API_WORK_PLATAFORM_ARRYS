const express = require('express');
const router = express.Router()
const fs = require('fs')
const path = require('path');

const pathRouter = `${__dirname}`
// Configuración de rutas según el entorno
const removeExtension = (fileName) => {
    return fileName.split('.').shift() 
} 

fs.readdirSync(pathRouter).forEach((file) => {
    if (file.startsWith('paths_') && file.endsWith('.js')) {
        const fileWithoutExt = removeExtension(file)
        const skip = ['index'].includes(fileWithoutExt)
        if(!skip){
            router.use(require(`./${fileWithoutExt}`))
            console.log('Ruta cargada:', `./${fileWithoutExt}`);
        }
        
    }
});

module.exports = router;
