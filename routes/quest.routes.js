const { Router } = require("express");
const Quest = require("../models/Quest");
const User = require("../models/User");

const router = Router();

router.get("/time", async (req, res) => {
  try {
    const date = new Date();
    res.status(201).json(date);
    return;
  } catch (e) {
    res.status(200).json(e.message);
  }
});

//quest?liveDate=2022-11-01T04:40:43.621Z&number=2
router.get("/", async (req, res) => {
  try {
    const params = req.query;
    const quest = await Quest.findOne({
      liveNumber: params.liveNumber,
      number: params.number,
      timezone: params.timezone,
    });
    res.status(201).json(quest);
    return;
  } catch (e) {
    res.status(200).json(e.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id });
    const quests = await Quest.find();
    let result;

    if(user.listQuestionsAnswered.length === quests.length) {
      return res.status(201).json(null);
    }

    while(1) {
      const item = quests[Math.floor(Math.random()*quests.length)];
      if(!user.listQuestionsAnswered.includes(item.number)) {
        result = item;
        break;
      }
    }
    return res.status(201).json(result);
  } catch (e) {
    return res.status(200).json(e.message);
  }
});

router.post('/create', async (req, res) => {
  try {
    const { number, text, correct, btn1, btn2, btn3, btn4, description, titleLose, titleWin } = req.body;

    const quest = new Quest(
        { number, text, correct, btn1, btn2, btn3, btn4, description, titleLose, titleWin });
    await quest.save();

    return res.status(201).json(true);
  } catch (e) {
    return res.status(200).json(e.message);
  }
});

module.exports = router;
