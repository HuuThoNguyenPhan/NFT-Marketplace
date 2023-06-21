const ContentReport = require("../models/ContentReport.js");
const Like = require("../models/Like.js");
const Product = require("../models/ProductModel.js");
const Report = require("../models/Report.js");
const Topic = require("../models/Topic.js");
const {
  setObject,
  getAllNftHashes,
  getAllNftMarketHashes,
  getAllMyNFTHashes,
  getAllMyItemListedHashes,
} = require("../config/redis-connect.js");
const { NFTMarketplace } = require("../etherium/web3.js");
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
    ids.forEach(async (id) => {
      if (ids.length == 1) {
        await Product.findByIdAndUpdate(id, {
          breed: time,
          limit: limit,
          only: true,
        });
      } else {
        await Product.findByIdAndUpdate(id, {
          breed: time,
          limit: limit,
          only: false,
        });
      }
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
    const { addressWallet, option, genealogy } = req.body;
    const report = await Report.findOne({ addressWallet, genealogy });
    console.log(report);
    if (!report) {
      await Report.create({ addressWallet, genealogy, option });
      return res.json({ success: true, message: "Gửi tố cáo thành công" });
    }
    return res.json({ success: false, message: "Bạn đã gửi tố cáo!" });
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

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.status(200).json({ success: true, topics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductsOnRedis = async (req, res) => {
  try {
    const nfts = await NFTMarketplace.getInstance();
    await nfts.fetchNFTs();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.changeOnly = async (req, res) => {
  try {
    const pro1 = await Product.find();
    const pro2 = await Product.find();
    for (let i = 0; i < pro1.length; i++) {
      for (let j = 0; j < pro2.length; j++) {
        if (pro1[i].breed == pro2[j].breed) {
          pro1[i].only = true;
          pro2[j].only = true;
        }
      }
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllproductFromRedis = async (req, res) => {
  try {
    let products = await getAllNftMarketHashes();
    products.sort((a, b) => a.tokenId - b.tokenId);
    res.status(200).json({ products: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllMyNFTs = async (req, res) => {
  try {
    let products = await getAllMyNFTHashes(req.params.addressWallet);
    products.sort((a, b) => a.tokenId - b.tokenId);
    res.status(200).json({ products: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllMyListed = async (req, res) => {
  try {
    let products = await getAllMyItemListedHashes(req.params.addressWallet);
    products.sort((a, b) => a.tokenId - b.tokenId);
    res.status(200).json({ products: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
