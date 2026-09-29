const jwt = require('jsonwebtoken');

function verifyAuthentication(req,res,next){
    try{
        let token = req.headers.authorization
        if(!token){
            return res.status(401)({message:"No bearer token, Authentication denied"})
        }
        token = token.split(' ')[1];
        const decodePayload = jwt.verify(token, process.env.JWT_KEY);
        console.log(decodePayload);
        req.user = decodePayload;
        next();

    }catch(error){
        console.error(error);
        res.status(401).json({message:"Token is invalid"});
    }
}

module.exports = verifyAuthentication;