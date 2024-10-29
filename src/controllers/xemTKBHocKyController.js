// const {crawlTKBHocKy} = require('../services/xemTKBHocKyService'); 

// const xemTKBHocKyController = {
//   async crawlData(req, res) {
//     const { username, password } = req.body; // Nhận username và password từ body request

//     if (!username || !password) {
//       return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
//     }
//     try {
//       const crawlData = await crawlTKBHocKy(username, password);
//       if (crawlData) {
//         console.log("Crawl dữ liệu thành công!");
//         res.status(200).json({ message: "Crawl dữ liệu thành công!", data: crawlData });
//       } else {
//         console.log("Crawl dữ liệu không thành công.");
//         res.status(500).json({ message: "Crawl dữ liệu không thành công!" });
//       }
//     } catch (error) {
//       console.error("Có lỗi xảy ra khi crawl dữ liệu:", error);
//       res.status(500).json({ message: "Crawl dữ liệu không thành công!", error: error.message });
//     }
//   }
// };

// module.exports = xemTKBHocKyController;



const scrapeQueue = require('./scrapeWorker'); // Import worker
const redis = require('ioredis');

const xemTKBHocKyController = {
  async crawlData(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
    }
    
    // Đẩy job vào queue
    await scrapeQueue.add({ username, password });
    res.status(202).json({ message: "Đang crawl dữ liệu. Vui lòng kiểm tra lại sau một lúc." });
  },

  async getData(req, res) {
    const { username } = req.body;
    const client = new redis();
    const data = await client.get(`tkb:${username}`);

    if (data) {
      res.status(200).json({ message: "Dữ liệu thời khóa biểu đã sẵn sàng!", data: JSON.parse(data) });
    } else {
      res.status(404).json({ message: "Dữ liệu chưa sẵn sàng. Vui lòng thử lại sau." });
    }
  }
};

module.exports = xemTKBHocKyController;
