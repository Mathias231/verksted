import { prisma } from '@/lib/db';
import { NextApiRequestWithUser, getUser } from '@/middlewares/user';
import { formidableParseAsync } from '@/utils/formidable-parse';
import formidable from 'formidable';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

// Finds user and puts it inside req object
router.use(getUser);

router.post(async (req, res) => {
  if (!req.user) return res.status(401).send('Not logged in');

  if (req.user.user.role !== 'ADMIN')
    return res.status(401).send('Not Authorized');

  const form = new formidable.IncomingForm({
    uploadDir: 'public/img',
    keepExtensions: true,
  });

  let { files } = await formidableParseAsync(req, form);
  let file: formidable.File;

  if (Array.isArray(files.image)) {
    file = files.image[0];
  } else {
    file = files.image;
  }

  if (!file.mimetype?.startsWith('image')) {
    return res.status(400).send('Invalid file type');
  }

  const response = await prisma.image
    .create({
      data: {
        name: file.originalFilename || file.newFilename,
        internalName: file.newFilename,
        path: file.filepath,
      },
    })
    .catch((err) => {
      return res.status(404).send(err);
    });

  if (!response) return res.status(404).send('Error: ' + response);

  res.status(200).send({
    imageId: response.id,
  });
});

export default router.handler({
  onError(err, req, res) {
    console.log(err);
    res.status(500).send('');
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
