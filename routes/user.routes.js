const { Router } = require('express');
const User = require('../models/User');

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

router.post('/leaders', async (req, res) => {
    try {
        const users = await User.find();
        const sortedUsers = [...users].sort(function(a, b) {
            return b.points - a.points;
        });

        const result = sortedUsers.slice(0, 10)
        res.status(201).json(result);
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
        const user = new User({ id, firstName, lastName, tryCounter: 0, listQuestionsAnswered: [], points: 0, personalNumber, isAuth: true });
        await user.save();
        return res.status(201).json(user);
    } catch (e) {
        return res.status(200).json(e.message);
    }
});

router.get('/addTry/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ id: id });
        user.tryCounter += 1;
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
        const { id, number, answer } = req.body;
        const user = await User.findOne({ id: id });
        user.tryCounter += 1;
        user.listQuestionsAnswered.push(number);
        if(answer) {
            user.points += 1;
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

module.exports = router;