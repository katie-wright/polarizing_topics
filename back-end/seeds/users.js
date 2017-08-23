const User = require('../models/User');

const createAnonymous = [
    {username: 'Anonymous'}
]

module.exports = ()=>{
    User.find({}, (err,users)=>{
        if (err) {
            console.log(err)
        }
        else {
            if (users.length === 0) {
                User.collection.insert(createAnonymous, (err, user)=>{
                    console.log(user);
                })
            }
        }
    })
}