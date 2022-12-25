import T from "tesseract.js"
// import fs-extra
import fs from "fs-extra";
// topic modeling
import lda from 'lda';
//text cleaning 
import TextCleaner from 'text-cleaner';
//pdf to text
import PdfParse from "pdf-parse";

import path from 'path';


export const image_to_text = (fileName) => {

    const filePath = path.join(process.cwd(), 'src','media',fileName);
    //save to 
    const saveTo = path.join(process.cwd(), 'src','media', 'img_to_text',fileName.split('.').shift() + ".txt");

    T.recognize(filePath, 'eng', { logger: e => console.log(e) }).then(
        out => {
            // write to file
            console.log(out);
            fs.outputFile(saveTo, out.data.text, err => {
                if (err) {
                    console.log(err);
                }
            }
            )


        }
    )
}




export const topic_modeling = (fileName, topics, words) => {

    var text;

    const filePath = path.join(process.cwd(), 'src','media','pdf_to_text',fileName);


    const contents = fs.readFileSync(filePath, 'utf-8');
    text = contents.toString();

    //  text = TextCleaner(text).removeChars({ replaceWith: ' ' }).trim().valueOf();
    // console.log("🚀 ~ file: pdf_to_text.js:14 ~ documents", text)
    text = TextCleaner(text).removeStopWords().valueOf()
    console.log("🚀 ~ file: pdf_to_text.js:16 ~ documents", text)

    // Extract sentences.

    var documents = text.split('\n');
    // var documents = text.match(/[^\.!\?]+[\.!\?]+/g);
    // split documents by \n



    console.log("🚀 ~ file: pdf_to_text.js:11 ~ documents", documents)



    var result = lda(documents, topics, words);

    var obj = {}
    // For each topic.
    for (var i in result) {
        var row = result[i];
        // console.log('Topic ' + (parseInt(i) + 1));


        // For each term.
        let array = [];
        for (var j in row) {
            var term = row[j];
            array.push(term.term + ' (' + term.probability + '%)');
            // console.log(term.term + ' (' + term.probability + '%)');
        }
        obj['Topic ' + (parseInt(i) + 1)] = array;

        console.log('');
    }
    return obj;
}


export const pdf_to_text = (fileName) => {

    // directory path
    // console.log(process.cwd())
    const filePath = path.join(process.cwd(), 'src','media',fileName);

    console.log(filePath)
    var objInfo = {};

    PdfParse(filePath).then(function (data) {

        objInfo["info"] = data.info;
        objInfo["metadata"] = data.metadata;
        objInfo["version"] = data.version;
        objInfo["numpages"] = data.numpages;


        console.log(fileName.split('.').shift() + ".txt")
        // remove empty lines with one line
        // console.log(data.text.replace(/\n\s*\n\s* /g,"\n"));
        data.text = data.text.replace(/\n\s*\n\s* /g, "\n");

        //save to 
        const filePath = path.join(process.cwd(), 'src','media', 'pdf_to_text',fileName.split('.').shift() + ".txt");

        fs.outputFile(filePath, data.text, err => {
            if (err) {
                console.log(err);
            }
        }
        )

        return objInfo;

    });

}
