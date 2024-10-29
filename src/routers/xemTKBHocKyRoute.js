// const express = require('express');
// const router = express.Router();
// const xemTKBHocKyController = require('../controllers/xemTKBHocKyController');

// // Sử dụng router.get để định nghĩa route
// router.post('/', xemTKBHocKyController.crawlData);

// module.exports = router; 



const express = require('express');
const router = express.Router();
const xemTKBHocKyController = require('../controllers/xemTKBHocKyController');

// Route để bắt đầu scraping
router.post('/start', xemTKBHocKyController.crawlData);

// Route để lấy dữ liệu sau khi scraping
router.get('/data', xemTKBHocKyController.getData);

module.exports = router;


