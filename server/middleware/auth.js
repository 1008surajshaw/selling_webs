const jwt = require("jsonwebtoken")
const SECRET = "Suraj"
const authentication = (req,res,next) =>{
    const authHeadder = req.headers.authentication;
    if(authHeadder){
        const token = authHeadder.split(' ')[1];
        jwt.verify(token,SECRET,(err,user) =>{
            if(err){
                return req.sendStatus(403);
            }
            req.user = user;
            next();
        })
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    authentication,
    SECRET
}