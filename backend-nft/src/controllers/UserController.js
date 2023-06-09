const User = require("../models/UserModel");
const Address = require("../models/address");
const sendMail = require("../utils/sendMail");
const { NFTMarketplace } = require("../etherium/web3");
const redis = require("../config/redis-connect");
const { NFTFactory } = require("../etherium/web3_nft");

exports.createUser = async (req, res) => {
  try {
    const { address } = req.body;
    let user = await User.findOneAndUpdate(
      { addressWallet: address },
      {},
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      user: user,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.changeVerified = async (req, res) => {
  try {
    const { addressWallet, verified, message } = req.body;
    const user = await User.findOne({ addressWallet });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.verified === verified) {
      return res.status(200).json({ success: true });
    }

    const updateObj = { verified };
    const unsetObj = {};
    if (verified === "not_verified") {
      unsetObj.name = "";
      unsetObj.description = "";
      unsetObj.reason = "";
      unsetObj.contact = "";

      unsetObj.country = "";
      unsetObj.image = [];
      unsetObj.updatedAt = "";
    }

    if (Object.keys(unsetObj).length > 0) {
      await sendMail({
        email: user.contact,
        subject: `Kết quả xác thực tài khoản`,
        message,
      });
      await User.updateOne(
        { addressWallet },
        { $set: updateObj, $unset: unsetObj }
      );
    } else {
      await sendMail({
        email: user.contact,
        subject: `Kết quả xác thực tài khoản`,
        message: "Chúc mừng bạn đã xác thực thành công!",
      });

      await User.updateOne({ addressWallet }, { $set: updateObj });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.send(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { _id, name } = req.body;
    const user = await User.findById(_id).lean();

    if (user.verified == "waitting") {
      res.status(200).json({
        success: false,
        message: "Tài khoản đang chờ xét duyệt",
      });
      return;
    }

    if (user.name) {
      const dateDiff = Math.round(
        (Date.now() - user.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (name && (dateDiff <= 0 || dateDiff > 90)) {
        await User.updateOne({ _id }, { ...req.body, updatedAt: Date.now() });
      } else if (name) {
        res.status(200).json({
          success: false,
          message: "Thời hạn đổi tên chưa đủ 3 tháng",
        });
        return;
      }
    } else {
      await User.updateOne({ _id }, { ...req.body, verified: "waitting" });
    }

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { addressWallet } = req.params;
    const user = await User.findOne({ addressWallet }).lean();

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.addressUpdate = async (req, res) => {
  try {
    const data = req.body;
    const add = await Address.updateOne(
      { _id: "646b745a80a41c027c2ba7bd" },
      { ...data }
    );

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getAddress = async (req, res) => {
  try {
    const add = await Address.findById("646b745a80a41c027c2ba7bd");

    res.status(200).json({
      success: true,
      address: add,
    });
  } catch (err) {
    res.send(err);
  }
};
exports.changeListingPrice = async (req, res) => {
  try {
    const { eth } = await req.body;
    if (!eth) {
      return res.status(400).json({ success: false });
    }
    const nftMarketplace = await NFTMarketplace.getInstance();
    await nftMarketplace.changeListingPrice(eth);

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.send(err);
  }
};
exports.infor = async (req, res) => {
  try {
    const nft = await NFTFactory.getInstance();
    const infor = await nft.getBalance();

    results = {
      nft: infor[0],
      auction: infor[1],
    };
    res.status(200).json({
      success: true,
      results,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.test = async (req, res) => {
  try {
    const user = {
      age: "20",
    };
    // await redis.setObject("nft2", user);
    // await redis.updateObject("nft", "age", "12");
    const results = await redis.getObject("nft2");
    // await redis.deleteObject("nft1");
    // console.log(results);

    res.status(200).json({
      success: true,
      message: results ?? "k co",
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};
