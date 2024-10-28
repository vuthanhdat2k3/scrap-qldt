// xemCTDTController.js
const { crawlXemCTDT } = require("../services/xemCTDTService");
const fs = require('fs');
const path = require('path');

const xemCTDTController = {
  async crawlData(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
    }
    try {
      const crawlData = await crawlXemCTDT(username, password);

      if (crawlData) {
        console.log("Crawl dữ liệu thành công!");
        const filePath = path.join("dataCrawl", "grades.json");

        // Đọc dữ liệu từ file grades.json
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(err); // In lỗi ra console
            return res
              .status(500)
              .json({ error: "Có lỗi khi đọc file dữ liệu" });
          }

          // Phân tích dữ liệu JSON và trả về
          try {
            const gradesData = JSON.parse(data);
            res.json(gradesData);
          } catch (parseError) {
            res
              .status(500)
              .json({ error: "Có lỗi khi phân tích dữ liệu JSON" });
          }
        });
        res
          .status(200)
          .json({ message: "Crawl dữ liệu thành công!", data: crawlData });
      } else {
        console.log("Crawl dữ liệu không thành công.");
        res.status(500).json({ message: "Crawl dữ liệu không thành công!" });
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi crawl dữ liệu:", error);
      res
        .status(500)
        .json({
          message: "Crawl dữ liệu không thành công!",
          error: error.message,
        });
    }
  },
};

module.exports = xemCTDTController;
