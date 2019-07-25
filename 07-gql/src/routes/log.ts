/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
	console.log('params');
	console.dir(req.params);
	console.log('query');
	console.dir(req.query);
	res.send('good');
});

export default router;