import fs from "fs";

import { Server } from '@slq/serv';
import { config } from "@am/loader";

import json from './middlewares/json.js'
import query from './middlewares/query.js'


const web = new Server();

web.registerMiddleware('json', json({ limit: '5Mb' }));
web.registerMiddleware('query', query());

if (config.https_port && config.ssl_keyfile && config.ssl_certfile) {
    web.run(config.https_port, {
        key: fs.readFileSync(config.ssl_keyfile),
        cert: fs.readFileSync(config.ssl_certfile)
    });
    console.log(`\nApplication listening on port ${config.https_port} \n  https://${config.localhost_subdomain ? config.localhost_subdomain + '.' : ''}localhost:${config.https_port}/`);
}

if (config.http_port) {
    web.run(config.http_port);
    console.log(`\nApplication listening on port ${config.http_port} \n  http://${config.localhost_subdomain ? config.localhost_subdomain + '.' : ''}localhost:${config.http_port}/`);
}
export { web };