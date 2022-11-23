import { Express } from 'express';

import * as SampleController from './controllers/sample.controller';

export default function (app: Express) {
  app.get('/', SampleController.sample);
}
