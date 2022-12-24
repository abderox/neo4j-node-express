import fs from 'fs-extra';
import path from 'path';



const downloadfile = async (req, res) => {

    const { name } = req.params

    if (name) {
        const filePath = path.join(process.cwd(), 'src', 'media', `${name}`)

        console.log(filePath)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.status(500).send({ message: 'Error retrieving file' })
            } else {
                res.status(200).send(data)
            }
        })
    }
    else {
        res.status(200).send({ message: 'No file was found !' })
    }

}



const uploadfile = async (req, res) => {


    const { name } = req.params

    const maxSize = 8 * 1024 * 1024;

    if (!req.files.file) {
        return res.status(400).send('No files were uploaded.');
    }

    


    if (req.files.file > maxSize) {
        return res.status(400).send('File too large');
    }

    console.log("metadata")
    console.log(req.files.file)
    const filePath = path.join(process.cwd(), 'src', 'media', `${name}.${req.files.file.name.split('.').pop()}`)


    req.files.file.mv(filePath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded!');
    });


}


export default {
    downloadfile,
    uploadfile,
}