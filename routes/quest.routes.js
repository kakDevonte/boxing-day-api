const { Router } = require("express");
const Quest = require("../models/Quest");
const axios = require("axios");
const FormData = require("form-data");
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

    // for(let i = 0; i < quests.length; i++) {
    //   if(quests[i].number !== user.listQuestionsAnswered[i]){
    //     result = quests[i]
    //     break;
    //   }
    // }

    return res.status(201).json(result);
  } catch (e) {
    return res.status(200).json(e.message);
  }
});

router.post("/is-win", async (req, res) => {
  try {
    const { liveNumber, number, id, timezone } = req.body;
    const quest = await Quest.findOne({
      liveNumber: liveNumber,
      number: number,
      timezone: timezone,
    });

    const user = quest.winners.find((user) => user.id === id);

    if (user) {
      res.status(201).json("win");
      return;
    } else {
      const user = quest.answers.find((user) => user.id === id);
      if (user) {
        if (user.correct && user.isLate) {
          res.status(201).json("so-close");
          return;
        } else {
          res.status(201).json("lose");
          return;
        }
      }
    }
  } catch (e) {
    res.status(200).json("lose");
  }
});

module.exports = router;
