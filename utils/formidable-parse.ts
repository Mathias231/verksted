import formidable from 'formidable';
import IncomingForm from 'formidable/Formidable';
import { IncomingMessage } from 'http';

export const formidableParseAsync = async (
  req: IncomingMessage,
  form: IncomingForm,
): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> =>
  await new Promise((resolve, reject) =>
    form.parse(req, (error, fields, files) => {
      if (error) return reject(error);
      resolve({
        fields: fields,
        files: files,
      });
    }),
  );
