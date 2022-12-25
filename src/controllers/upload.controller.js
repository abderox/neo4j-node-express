import fs from 'fs-extra';
import path from 'path';
import { image_to_text, pdf_to_text } from '../utils/filesManip';



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
    const {analysis} = req.params;

    const maxSize = 8 * 1024 * 1024;

    if (!req.files.file) {
        return res.status(400).send('No files were uploaded.');
    }

    


    if (req.files.file > maxSize) {
        return res.status(400).send('File too large');
    }

    
    const filePath = path.join(process.cwd(), 'src', 'media', `${name}.${req.files.file.name.split('.').pop()}`)


    req.files.file.mv(filePath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        // image types 
        let img_ext = [
            'jpg',
            'jpeg',
            'png',
            'bmp',
        ]


        if (analysis === "yes") {
            // check if file is image
            if (img_ext.includes(req.files.file.name.split('.').pop())) {
                
                console.log("image file")
                // convert image to text
                return new Promise((
                    resolve, reject) => {
                    image_to_text(name+"."+req.files.file.name.split('.').pop());
                    resolve();
                }).then(() => {
                    // convert pdf to text
                    return res.send(
                        {
                            message: "File is being processed!",
                            name: name+"."+req.files.file.name.split('.').pop()
                        }
                    )
                }).catch(
                    (err) => {
                        res.status(404).send(
                            {
                                message: "Error occured while processing file!",
                                name: name+"."+req.files.file.name.split('.').pop()
                            }
                        )
                    }
                )

            }
            else if (req.files.file.name.split('.').pop() === 'pdf') {

                console.log("pdf file")
                // convert pdf to text
                return new Promise((
                    resolve, reject) => {
                    pdf_to_text(name+"."+req.files.file.name.split('.').pop());
                    resolve();
                }).then(() => {
                    // convert pdf to text
                    return res.send(
                        {
                            message: "File is being processed!",
                            name: name+"."+req.files.file.name.split('.').pop()
                        }
                    )
                }
                ).catch(
                    (err) => {
                        res.status(404).send(
                            {
                                message: "Error occured while processing file!",
                                name: name+"."+req.files.file.name.split('.').pop()
                            }
                        )
                    }
                )
            }

        
        }


        res.send('File uploaded!');
       
    });


}


export default {
    downloadfile,
    uploadfile,
}