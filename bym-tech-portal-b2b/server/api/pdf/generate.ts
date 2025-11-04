import axios from 'axios';
import pdf from 'html-pdf';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError';

async function generatePDFfromURL(url) {
  try {
    const response = await axios.get(url);
    const htmlContent = response.data;
    return new Promise((resolve, reject) => {
      pdf.create(htmlContent).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  } catch (error) {
    throw error;
  }
}

// Endpoint que maneja las solicitudes HTTP
export default defineEventHandler(async (event) => {
  try {
    switch (event.method) {
      case 'GET':
        const { url } = getQuery(event);
        if (!url) {
          throw new Error('URL parameter is required');
        }
        const pdfBuffer = await generatePDFfromURL(url);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
          },
          body: pdfBuffer.toString('base64'),
          isBase64Encoded: true,
        };
      default:
        throw new Error(`Unsupported HTTP method: ${event.method}`);
    }
  } catch (error) {
    return throwError(event.path, codeError.BYMTECH002.code, 404, 'es', error.message);
  }
});
