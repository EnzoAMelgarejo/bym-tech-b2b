import axios from 'axios';
import FormData from 'form-data';

const apiUrl = process.env.API_FILE_SERVER;

export async function uploadFile(files) {
    try {
        const formData = new FormData();
        files.forEach((file:any)=>{

            formData.append('file', file.data, {
                filename: file.filename,
                contentType: file.type
            });
        })

        
        const response = await axios.post(apiUrl, formData);
        const urls:Array<string>=[]
        response.data.forEach((file:any)=>{
            urls.push(file.url)
        })
    
        return urls;
    } catch (err) {
        console.error('Error al subir el archivo:', err);
        throw err;
    }
}