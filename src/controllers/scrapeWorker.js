const Queue = require('bull');
const { crawlTKBHocKy } = require('./services/xemTKBHocKyService');
const redis = require('ioredis');
require('dotenv').config();

// Khởi tạo Redis và Queue
const scrapeQueue = new Queue('scrapeQueue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  }
});

// Xử lý job trong Queue
scrapeQueue.process(async (job, done) => {
  const { username, password } = job.data;
  try {
    const data = await crawlTKBHocKy(username, password);
    // Lưu dữ liệu vào Redis
    const client = new redis();
    await client.set(`tkb:${username}`, JSON.stringify(data), 'EX', 3600); // Lưu trong 1 giờ
    done();
  } catch (error) {
    console.error("Scraping job failed:", error);
    done(new Error("Scraping failed"));
  }
});

module.exports = scrapeQueue;
