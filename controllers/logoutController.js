const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users = data
    }
}

const fsPromises = require('fs').promises;
const path = require('path');


const handleLogout = async (req,res) => {

    //on Client, also delete the accessToken
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); //Successful and not content to send

    //is refresh token in db?
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);
    
    if(!foundUser) {
        //if we found a user without that refreshToken
        //but if we reached till here the cookie has to be deleted
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure:true });
        res.sendStatus(204);//successfull but no content
    }

    //Delete refresh token in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken:''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)

    );

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true });
    //when we are on prod environment we also need to set secure flag as True
    //when we want to clear cookie from https we need to apply that^^
    res.sendStatus(204);
}

module.exports = {handleLogout}