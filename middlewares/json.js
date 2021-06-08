import { parse as parseFormadata } from 'querystring';
import JSONParse from "json-parse-safe";
const parseContent = rawType => {
    if (!rawType) return raw => raw
    else if (rawType.indexOf('json') > -1) return JSONParse;
    else if (rawType.indexOf('x-www-form-urlencoded') > -1) return raw => ({ ...parseFormadata(raw) });
    else if (rawType.indexOf('multipart') > -1) return 'multipart';
    else return raw => raw
}

function json(options) {
    return async function (context) {
        return new Promise((resolve, reject) => {
            const contentType = context.req.headers['content-type']
            const parser = parseContent(contentType)

            if (parser !== 'multipart') {
                let formData

                context.req.on('data', data => {
                    if (!formData) formData = Buffer.from(data)
                    else formData = Buffer.concat([formData, data])
                })

                context.req.on('error', (err) => reject(err))

                context.req.on('end', () => {
                    const parsedData = parser(Buffer.isBuffer(formData) ? formData.toString() : formData)
                    context.body = parsedData;
                    resolve()
                })
            }
        });
    }
}

export default json;