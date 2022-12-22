const { Router } = require('express');
const User = require('../models/User');
const easyvk = require('easyvk');

const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ id: id });
        if(user) {
            res.status(201).json(user);
        } else {
            res.status(201).json(false);
        }
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json(users);
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.post('/leaders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const users = await User.find();
        const filterUsers = [...users].filter(function (el) {
            return el.personalNumber !== 0;
        });

        const sortedUsers = filterUsers.sort(function(a, b) {
            return b.points - a.points;
        });

        const result = sortedUsers.slice(0, 10);

        let index = sortedUsers.findIndex(user => user.id === parseInt(id));
        let isOnList = result.some(user => user.id === parseInt(id));

        res.status(201).json({result ,index, isOnList});
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { id, firstName, lastName, personalNumber } = req.body;
        const checkUser = await User.findOne({
            id: id,
        });
        if (checkUser) {
            return res.status(201).json(checkUser);
        }
        const user = new User(
            { id, firstName, lastName,
                tryCounter: 0, listQuestionsAnswered: [],
                points: 0, personalNumber,
                isAuth: true, isPublishedPost: false,
                isSubscribedGroup: false, linkToPost: "",
                dateOfLastScore: ""});
        await user.save();
        return res.status(201).json(user);
    } catch (e) {
        return res.status(200).json(e.message);
    }
});

router.post('/addTry/', async (req, res) => {
    try {
        const { id, number } = req.body;
        const user = await User.findOne({ id: id });
        user.tryCounter += 1;
        user.listQuestionsAnswered.push(number);
        await user.save();
        if(user) {
            res.status(201).json(user);
        } else {
            res.status(201).json(false);
        }
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.post('/addAnswer/', async (req, res) => {
    try {
        const { id, answer } = req.body;
        const user = await User.findOne({ id: id });
        // user.tryCounter += 1;
        if(answer) {
            user.points += 1;
            user.dateOfLastScore = new Date().toString();
        }

        await user.save();
        if(user) {
            res.status(201).json(user);
        } else {
            res.status(201).json(false);
        }
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.put('/', async (req, res) => {
    try {
        const { id, personalNumber } = req.body;

        User.findOneAndUpdate({ id: id },
            {$set:{ personalNumber: personalNumber }}, {new: true}).then((data) => {
            res.status(201).json(data)
        });

    } catch (e) {
        return res.status(200).json(e.message);
    }
});


router.put('/', async (req, res) => {
    try {
        const { id, personalNumber } = req.body;

        User.findOneAndUpdate({ id: id },
            {$set:{ personalNumber: personalNumber }}, {new: true}).then((data) => {
            res.status(201).json(data)
        });

    } catch (e) {
        return res.status(200).json(e.message);
    }
});

router.put('/post', async (req, res) => {
    try {
        const { id, linkToPost } = req.body;

        User.findOneAndUpdate({ id: id },
            {$set:{ linkToPost: linkToPost, isPublishedPost: true }}, {new: true}).then((data) => {
            res.status(201).json(data)
        });

    } catch (e) {
        return res.status(200).json(e.message);
    }
});

router.get('/subscribed/:id', async (req, res) => {
    try {
        const id = req.params.id;
        easyvk({
            token: process.env.TOKEN
        }).then(async vk => {
            vk.call('groups.isMember', {
                user_id: id,
                group_id: 147189911,
            }).then( data => {
                const isSubscribe = data.getFullResponse().response;
                if(isSubscribe) {
                    User.findOneAndUpdate({id: id},
                        {$set: {isSubscribedGroup: true}}, {new: true}).then((data) => {
                        return res.status(201).json({isSubscribe: true, user: data })
                    });
                } else {
                    return res.status(201).json({isSubscribe: false })
                }
            });
        })
    } catch (e) {
        return res.status(200).json(e.message);
    }
});

module.exports = router;