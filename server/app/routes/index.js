const UserController = require('../controllers/UserController');
const ChannelController = require('../controllers/ChannelController');
const Channel = new ChannelController();
const User = new UserController();
const START_TIME = new Date();

class AppRouter{
    constructor(app){
        this.app = app;
        this.setupRouter = this.setupRouter.bind(this);
        this.setupRouter();
    }
    setupRouter(){
        const app = this.app;
        console.log("AppRouter works");

        app.get('/',(req,res,next)=>{
           return (res.json({startTime: START_TIME}));
        });

        // app.post('/users/channel',(req,res,next)=>{
        //     const body = req.body;
        //     Channel.create(body).then(channel=>{
        //
        //     });
        //     res.status(200).json(body);
        // });

        app.get('/me/channels',(req,res,next)=>{
            let user = req.headers.authorization;
            console.log('req',user);
            return res.json({id:'works'});


        });

        app.post('/users/search',(req,res,next)=>{
            const query = req.body.search;
            User.search(query).then(users=>{
                res.status(200).json(users);
            })
        });

        app.post('/users',(req,res,next)=>{
            const body = req.body;
            User.create(body).then(user=>{
                user.set('password',undefined);
                return res.status(200).json(user);
             }).catch(err=>{
                return res.status(503).json({
                    error:err
                });
             })
        });

        app.get('/users/:id', (req,res,next)=>{
            const userId = req.params.id;
            User.load(userId).then(user=>{
                user.set('password',undefined);
                return res.status(200).json(user);
            }).catch(err=>{
                return res.status(404).json({
                    error:err
                })
            });
        });
        app.post('/users/login',(req,res,next)=>{
            const body = req.body;
            console.log(body);
            User.login(body).then(user=>{
                user.password = undefined;
                return res.status(200).json(user);
            }).catch(err=>{
                return res.status(401).json({
                    error:err
                })
            });
        });

        app.get('/channels/:id',(req,res,next)=>{
            const channelId = req.params.id;
            console.log(channelId);
            if(!channelId){
                return res.status(404).json({error:"Not found"});
            }
           Channel.load(channelId).then(channel=>{
               const members = channel.members;

               return res.status(200).json(channel);
           }).catch(err=>{
               return res.status(404).json({error:"Not found"});
           })
        })
    }
}
module.exports = AppRouter;
exports.START_TIME = START_TIME;
