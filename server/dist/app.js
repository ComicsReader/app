'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _comicsDm = require('comics-dm5');

var dm5 = _interopRequireWildcard(_comicsDm);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

/* setup dotenv */
try {
	_fs2.default.accessSync('.env', _fs2.default.F_OK);
	require('dotenv').config();
} catch (e) {
	_fs2.default.createReadStream('.sample.env').pipe(_fs2.default.createWriteStream('.env'));
}

// parse application/x-www-form-urlencoded
app.use(_bodyParser2.default.urlencoded({ extended: false }));
// parse application/json
app.use(_bodyParser2.default.json());

var func = {
	fetchComicsInfo: {
		args: ['comicID']
	},
	getChapterImages: {
		args: ['cid']
	}
};

var parseBody = function parseBody(body) {
	var method = (0, _keys2.default)(func).filter(function (m) {
		return m.indexOf(body.function) > -1;
	})[0];
	if (typeof method === 'undefined') {
		return { error: 'function name error' };
	}

	var args = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)(func[method].args), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var k = _step.value;

			if (typeof body.args === 'undefined' || typeof body.args[k] === 'undefined') {
				return { error: 'argments error' };
			}
			args = [].concat((0, _toConsumableArray3.default)(args), [body.args[k]]);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return {
		method: dm5[method],
		args: args
	};
};

app.post('/api', function () {
	var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
		var _req$headers$authoriz, _req$headers$authoriz2, type, key, _parseBody, error, method, args, results;

		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (req.headers.authorization) {
							_context.next = 4;
							break;
						}

						res.json({ error: 'No credentials sent!' });
						_context.next = 33;
						break;

					case 4:
						_req$headers$authoriz = req.headers.authorization.split(' ');
						_req$headers$authoriz2 = (0, _slicedToArray3.default)(_req$headers$authoriz, 2);
						type = _req$headers$authoriz2[0];
						key = _req$headers$authoriz2[1];

						if (!(type !== 'Token')) {
							_context.next = 13;
							break;
						}

						res.json({ error: 'Error authorization type, should be \'Token\', get \'' + type + '\' instead' });
						return _context.abrupt('return');

					case 13:
						if (!(key !== process.env.API_KEY)) {
							_context.next = 17;
							break;
						}

						res.json({ error: 'Wrong API key' });

						_context.next = 33;
						break;

					case 17:
						if (!(typeof req.body === 'undefined')) {
							_context.next = 21;
							break;
						}

						res.json({ error: 'Body not Provided' });

						_context.next = 33;
						break;

					case 21:
						_parseBody = parseBody(req.body);
						error = _parseBody.error;
						method = _parseBody.method;
						args = _parseBody.args;

						if (!error) {
							_context.next = 29;
							break;
						}

						res.json({ error: error });_context.next = 33;
						break;

					case 29:
						_context.next = 31;
						return method.apply(undefined, (0, _toConsumableArray3.default)(args));

					case 31:
						results = _context.sent;

						res.json((0, _extends3.default)({}, results));

					case 33:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

app.listen(process.env.PORT || 3000, function () {
	console.log('server started');
});