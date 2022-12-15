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
        const { id, firstName, lastName, timezone, responseTime } = req.body;
        const oldUser = { id, firstName, lastName, timezone, responseTime };
        await User.updateOne({ id: id }, oldUser);
        const user = await User.findOne({ id: id });
        res.status(201).json(user);
        return;
    } catch (error) {
        res.status(200).json(error.message);
    }
});

module.exports = router;