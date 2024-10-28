// xemCTDTController.js
const { crawlXemCTDT } = require('../services/xemCTDTService');

const xemCTDTController = {
  async crawlData(req, res) {
    try {
      const crawlData = await crawlXemCTDT();
      if (crawlData) {
        console.log("Crawl dữ liệu thành công!");
        res.status(200).json({ message: "Crawl dữ liệu thành công!", data: crawlData });
      } else {
        console.log("Crawl dữ liệu không thành công.");
        res.status(500).json({ message: "Crawl dữ liệu không thành công!" });
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi crawl dữ liệu:", error);
      res.status(500).json({ message: "Crawl dữ liệu không thành công!", error: error.message });
    }
  }
};

module.exports = xemCTDTController;
