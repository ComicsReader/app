import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

import * as dm5 from 'comics-dm5';

const app = express();

/* setup dotenv */
try {
	fs.accessSync('.env', fs.F_OK);
	require('dotenv').config();
} catch (e) {
	fs.createReadStream('.sample.env')
		.pipe(fs.createWriteStream('.env'));
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.json({message: 'Hello World'});
});

const func = {
	fetchComicsInfo: {
		args: ['comicID']
	},
	getChapterImages: {
		args: ['cid']
	}
};

const parseBody = (body) => {
	let method = Object.keys(func).filter(m => m.indexOf(body.function) > -1)[0];
	if (typeof method === 'undefined') { return { error: 'function name error' }; }

	let args = [];
	for (let k of func[method].args) {
		if (typeof body.args === 'undefined' || typeof body.args[k] === 'undefined') {
			return { error: 'argments error' };
		}
		args = [...args, body.args[k]];
	}

	return {
		method: dm5[method],
		args: args
	};
};

app.post('/api', async (req, res) => {
	if (!req.headers.authorization) {
		res.json({ error: 'No credentials sent!' });
	} else {
		const [type, key] = req.headers.authorization.split(' ');

		if (type !== 'Token') {
			res.json({ error: `Error authorization type, should be 'Token', get '${type}' instead` });
			return;

		} else if (key !== process.env.API_KEY) {
			res.json({ error: 'Wrong API key'});

		} else if (typeof req.body === 'undefined') {
			res.json({ error: 'Body not Provided' });

		} else {
			const { error, method, args } = parseBody(req.body);

			if (error) { res.json({error}); }
			else {
				const results = await method(...args);
				res.json({
					...results
				});
			}
		}
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log('server started');
});
