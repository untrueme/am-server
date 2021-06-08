function query(options) {
    return async function (context) {
        let start = context.req.url.indexOf('?');
        if (start >=0) {
            let qstr = decodeURIComponent(context.req.url.slice(start+1));
            let qarr = qstr.split('&');
            context.query = qarr.reduce( (a,i) => {
                let qpart = i.split('=');
                a[qpart[0]] =
                    qpart[1].replace(/\+/g, ' ') || '';
                return a;
            },{})
        }
    }
}

export default query;