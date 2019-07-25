/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    //res.render('index', { title: 'Express' });
    res.send(`
<a href="/graphql">GraphQL</a>
    `);
});

export default router;