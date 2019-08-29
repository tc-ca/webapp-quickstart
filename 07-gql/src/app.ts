import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as https from 'https';
import * as fs from 'fs';

import graphql from './routes/graphql';
import index from './routes/index';
import log from './routes/log';
import { database } from './db';

async function main() {
	await database.query`'SELECT 1'`;

    const app = express();
    app.use(morgan('combined'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/', index);
    app.use('/log', log);
    app.use('/graphql', graphql);

    {
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err['status'] = 404;
            next(err);
        });
        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use((err: any, req, res, next) => {
                res.status(err['status'] || 500);
                res.send(err);
            });
        }
        // production error handler
        // no stacktraces leaked to user
        app.use((err: any, req, res, next) => {
            res.status(err.status || 500);
            res.send(err.message);
        });
    }

    app.set('port', process.env.PORT || 3000);
    
    // const server = https.createServer({
    //     key: fs.readFileSync('./certs/domain.key'),
    //     cert: fs.readFileSync('./certs/domain.crt')
    // }, app);
    let server = app.listen(app.get('port'), function () {
        console.log(`Express server started at ${new Date().toLocaleTimeString()} listening on port ${server.address().port}`);
    })    
}

main();