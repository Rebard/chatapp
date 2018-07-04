const User = require('../models/user'),
    Channel = require('../models/channel'),
    bcrypt = require('bcrypt'),
    {OrderedMap} = require('immutable');

const saltRound = 10;

class UserController{
    constructor(){
       this.users = new OrderedMap();
    }
    getUsersFromChannel(channelId){
        Channel.findAll({
            include:[{
                model:User,as:'Users',
                where:{channelId:{$col:'channel.channelId'}}
            }]
        }).then(channels=>{
            return channels;
        }).catch(err=>console.log(err));
    }
    search(query){
        return new Promise((resolve)=>{
            User.findAll().then(res=>{
                let users = [];
                res.forEach(user=>{
                   if(user.name.toLowerCase().includes(query.toLowerCase()) )
                       users.push(user);
                });
                resolve(users);
            }).catch(err=>{
               console.log(err);
            })
        });


    }

    login(user){
        const email = user.email;
        const pass = user.password;
        return new Promise((resolve,reject)=>{
            User.findOne({ where:{ email:email } }).then(user=>{
                if(!user)
                   return reject("Такого пользователя не существует");
                const isMatch = bcrypt.compareSync(pass,user.password);
                return isMatch? resolve(user): reject("Неверно введен пароль");
            })
        });
    }
    load(id){
        return new Promise((resolve,reject)=>{
            const userInCache = this.users.get(id);
            if (userInCache)
                return resolve(userInCache);
            User.findById(id).then(user=>{
                if(user){
                    this.users = this.users.set(id,user);
                    return resolve(user);
                }
                return reject("Пользователь не найден");
            }).catch(err => console.log(err))
        });
    }

    beforeSave(user,callback = ()=>{}){
        let errors = [];
        const fields = ['name', 'password'];
        const validations = {
            name: {
                errorMessage: 'Заполните поле имя',
                do: () => {
                    const name = user.name;
                    return name.length;
                }
            },
            password: {
                errorMessage: 'Пароль должен иметь более 3 символов',
                do: () => {
                    const password = user.password;
                    return password.length < 3? false: true;
                }
            }
        };

        fields.forEach((field) => {
            const fieldValidation = validations[field];
            if (fieldValidation) {
                const isValid = fieldValidation.do();
                const msg = fieldValidation.errorMessage;
                if (!isValid) {
                    errors.push(msg);
                }
            }
        });

        if (errors.length) {
            const err = errors.join(',');
            return callback(err, null);
        }

        const email = user.email;
        const userId = user.id;

        User.findOne({ where: {email: email} }).then(res => {
            console.log(res);
            if(res)
                return callback({message: "Email уже существует"}, null);
            const password = user.password;
            const hashPassword = bcrypt.hashSync(password, saltRound);

            const userFormatted = {
                id: userId,
                name: user.name,
                email: email,
                password: hashPassword,
                created: new Date(),
            };
            return callback(null, userFormatted);
        });
    }

    create(user) {
        return new Promise((resolve, reject) => {
            this.beforeSave(user, (err, user) => {
                if(err)
                    return reject(err);
                User.create(user).then(user => {
                    const userId = user.id;
                    this.users = this.users.set(userId,user);
                    return resolve(user);
                }).catch(error=>{
                    console.log(error);
                })
            });
        });
    }
}
module.exports = UserController;