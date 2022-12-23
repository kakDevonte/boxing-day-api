const { Router } = require('express');
const Stats = require('../models/Stats');
const User = require("../models/User");

const router = Router();

router.get('/', async (req, res) => {
    try {
        const stats = await Stats.findOne();
        return res.status(201).json(stats);
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.get('/post', async (req, res) => {
    try {
        const stats = await Stats.findOne();
        if(stats) {
            Stats.findOneAndUpdate({ _id: stats._id },
                {$set:{ countPublishedPosts: stats.countPublishedPosts + 1 }}, {new: true}).then((data) => {
                res.status(201).json(true)
            });
        } else {
            const newStat = new Stats({ openApp: 0, completedTest: 0, clickRegisterButton: 0, countPublishedPosts: 1 });
            await newStat.save();
            return res.status(201).json(true);
        }
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.get('/registr', async (req, res) => {
    try {
        const stats = await Stats.findOne();
        if(stats) {
            Stats.findOneAndUpdate({ _id: stats._id },
                {$set:{ clickRegisterButton: stats.clickRegisterButton + 1 }}, {new: true}).then((data) => {
                res.status(201).json(true)
            });
        } else {
            const newStat = new Stats({ openApp: 0, completedTest: 0, clickRegisterButton: 1, countPublishedPosts: 0 });
            await newStat.save();
            return res.status(201).json(true);
        }
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.get('/test', async (req, res) => {
    try {
        const stats = await Stats.findOne();
        if(stats) {
            Stats.findOneAndUpdate({ _id: stats._id },
                {$set:{ completedTest: stats.completedTest + 1 }}, {new: true}).then((data) => {
                res.status(201).json(true)
            });
        } else {
            const newStat = new Stats({ openApp: 0, completedTest: 1, clickRegisterButton: 0, countPublishedPosts: 0 });
            await newStat.save();
            return res.status(201).json(true);
        }
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.get('/open', async (req, res) => {
    try {
        const stats = await Stats.findOne();
        if(stats) {
            Stats.findOneAndUpdate({ _id: stats._id },
                {$set:{ openApp: stats.openApp + 1 }}, {new: true}).then((data) => {
                res.status(201).json(true)
            });
        } else {
            const newStat = new Stats({ openApp: 1, completedTest: 0, clickRegisterButton: 0, countPublishedPosts: 0 });
            await newStat.save();
            return res.status(201).json(true);
        }
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

module.exports = router;