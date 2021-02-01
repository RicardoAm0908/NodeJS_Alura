const fs = require('fs')
const path = require('path')

module.exports = (pathFile, fileName, callBack) => {
    const validTypes = ['jpg', 'pgn', 'jpeg']
    const type = path.extname(pathFile)

    if(validTypes.indexOf(type.substring(1)) == -1){
        const erro = "Tipo inválido"
        callBack(erro, "")
        return
    }

    const pathNewFile = `./assets/imagens/${fileName}${type}`
    if (!fs.existsSync('./assets/imagens')){
        fs.mkdirSync('./assets/imagens');
    }
    fs.createReadStream(pathFile)
        .pipe(fs.createWriteStream(pathNewFile))
        .on('finish', () => callBack(false, pathNewFile))    
}