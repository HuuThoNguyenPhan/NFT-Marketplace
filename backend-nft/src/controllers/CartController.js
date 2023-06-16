const User = require("../models/UserModel");
exports.createCart = async (req, res) => {
  try {
    const user = await User.findOne({ addressWallet: req.body.addressWallet });
    const item = req.body.cart;
    const itemExists = user.cart.some((e) => e.tokenId == item.tokenId);
    console.log(itemExists);
    if (!itemExists) {
      user.cart.push(item);
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.send(err);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { addressWallet, tokenId } = req.body;
    const user = await User.findOne({ addressWallet });
    const itemExists = user.cart.some((e) => e.tokenId === tokenId);
    if (itemExists) {
      user.cart = user.cart.filter((e) => e.tokenId !== tokenId);
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllCart = async (req, res) => {
  try {
    const user = await User.findOne({ addressWallet: req.body.addressWallet });
    user.cart = [];
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};