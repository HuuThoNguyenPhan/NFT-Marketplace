const ContentReport = require("../models/ContentReport.js");
const Like = require("../models/Like.js");
const Product = require("../models/ProductModel.js");
const Report = require("../models/Report.js");

exports.createProduct = async (req, res) => {
  try {
    const data = req.body.Metadata;
    const product = await Product.create(data);

    res.status(201).json({
      success: true,
      metaData: product,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.changeBreed = async (req, res) => {
  try {
    const { time, ids, limit } = req.body;

    console.log(ids, time);
    ids.forEach(async (id) => {
      await Product.findByIdAndUpdate(id, { breed: time, limit: limit });
    });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.sendReport = async (req, res) => {
  try {
    const { idUser, option, genealogy } = req.body;
    const report = await Report.findOne({ idUser, genealogy });
    console.log(report);
    if (!report) {
      await Report.create({ idUser, genealogy, option });
      res.status(200).json({
        success: true,
      });
    } else {
      res.status(200).json({
        success: false,
      });
    }
  } catch (err) {
    res.send(err);
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      reports,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.changeReport = async (req, res) => {
  try {
    const { description, option } = req.body;
    const contentReport = await ContentReport.findOneAndUpdate(
      { option },
      { description, option },
      { upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({
      success: true,
      contentReport,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getAllContentReport = async (req, res) => {
  try {
    const content = await ContentReport.find();
    res.status(200).json({
      success: true,
      content,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.like = async (req, res) => {
  try {
    const { idUser, genealogy } = req.body;
    const like = await Like.findOne({ user: idUser, genealogy });
    if (!like) {
      await Like.create({ user: idUser, genealogy });
      res.status(200).json({
        success: true,
        like: true,
      });
    } else {
      await Like.findOneAndDelete({ user: idUser, genealogy });
      res.status(200).json({
        success: true,
        like: false,
      });
    }
  } catch (err) {
    res.send(err);
  }
};

exports.countLike = async (req, res) => {
  try {
    const { g } = req.params;
    const count = await Like.countDocuments({ genealogy: g }).lean();
    res.status(200).json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkLike = async (req, res) => {
  try {
    const { idUser, genealogy } = req.body;

    if (!idUser || !genealogy) {
      throw new Error("Missing required parameters");
    }

    const like = await Like.exists({ user: idUser, genealogy });

    res.status(200).json({ success: true, like: like });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserLike = async (req, res) => {
  try {
    const { genealogy } = req.params;
    const like = await Like.find({ genealogy }).populate({
      path: "user",
      select: "addressWallet image",
    });
    res.status(200).json({ success: true, like });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
