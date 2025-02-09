const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req,res) => {
    const{ user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({"message": "Username and password are required."});
    const foundUser = await User.findOne({ username: user }).exec();
    console.log(`username is ${user}`);
    //usersDB.users.map(person => console.log(person.username));
    if(!foundUser) return res.sendStatus(401);//Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles).filter(Boolean);
        //create JWTs to send to use with other route we want protected in API
        const accessToken = jwt.sign(
            { 
                "UserInfo": 
                {
                    "username":foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5s'}
        );
        const refreshToken = jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        //Saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None',secure:true, maxAge: 24 * 60 * 60 * 1000});// secure:true, => add in production env
        res.json({ roles, accessToken });
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};