import { Request, Response } from 'express';

export async function fileUpload(req: Request, res: Response) {
  try {
    return res.json(req.file);
  } catch (error) {
    console.log(`[Error] File upload error!\n\t${error}`);
    return res.status(500).json({ message: 'File upload error 500' });
  }
}
