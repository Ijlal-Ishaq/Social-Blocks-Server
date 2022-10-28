const Types = require('../models/type');

const setType = async (req, res) => {
  const newType = new Types({
    postId: req.body.postId,
    type: req.body.type,
  });
  await newType.save();
  res.json(newType);
};

const getType = async (req, res) => {
  let type = await Types.findOne({
    postId: req.body.postId,
  });

  type ? res.json(type) : res.send(null);
};

module.exports = {
  setType,
  getType,
};
