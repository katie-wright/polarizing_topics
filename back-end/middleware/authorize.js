const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=> {
	let authToken = req.headers.authorization || req.body.token || req.param.authorization;
	if (authToken){
		jwt.verify(authToken, 'secretKatie', (err, decoded)=>{
			if (err) {
				res.status(403);
				res.json({ success: false, message: 'Failed to authenticate token.' });
			}
			else {
				req.decoded = decoded;
				next();
			}
		});
	}
	else {
		res.status(403);
		res.send({
			success: false,
			message: 'No token provided.'
		});
	}
	
}

