const { selectAndClickUl } = require('./selectFeature'); // Import hàm chọn thẻ ul
const fs = require('fs');

const crawlMTQuyet = async (page) => {
  // Chọn và click thẻ ul (truyền chỉ số từ dưới lên, ví dụ: 4)
  const ulIndexFromBottom = 9; // Thẻ <ul> thứ 4 từ dưới lên
  await selectAndClickUl(page, ulIndexFromBottom);

  await page.waitForSelector("a#WEB_XEMMONTIENQUYET", { visible: true });
  await new Promise((resolve) => setTimeout(resolve, 2000)); // đợi 2 giây cho thằng phía trên xuất hiện
  await page.click("a#WEB_XEMMONTIENQUYET");

  let hasNextPage = true;
  const allTableData = [];

  // Hàm để crawl dữ liệu từ bảng
  async function crawlTableData() {
    await page.waitForSelector("#excel-table tbody tr", { visible: true });
    const tableData = await page.evaluate(() => {
      // puppeteer sử dụng js để giao tiếp với page
      const rows = document.querySelectorAll("#excel-table tbody tr"); // Chọn tất cả các hàng trong bảng
      const data = [];

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td"); // lấy danh sách các cột
        if (cells.length > 0) {
          const rowData = {
            stt: cells[0]?.innerText?.trim(), // gán thông tin trong cột vào key : value
            maMonDangKy: cells[1]?.innerText?.trim(),
            tenMonDangKy: cells[2]?.innerText?.trim(),
            maMonYeuCau: cells[3]?.innerText?.trim(),
            tenMonYeuCau: cells[4]?.innerText?.trim(),
            heDaoTao: cells[5]?.innerText?.trim(),
            nganh: cells[6]?.innerText?.trim(),
            khoi: cells[7]?.innerText?.trim(),
          };
          data.push(rowData); // thêm thông tin của một hàng vào data
        }
      });
      return data;
    });
    return tableData; // trả về thông tin của tất cả các hàng
  }

  // Hàm kiểm tra và chuyển sang trang tiếp theo
  async function goToNextPage() {
    // Kiểm tra nếu nút "Trang tiếp theo" có tồn tại
    const isNextButtonDisabled = await page.evaluate(() => {
      // puppeteer dùng js để thao tác với page
      const nextButton = document.querySelector(".pagination-next"); // lấy button để kiểm tra class
      if (nextButton) {
        return nextButton.classList.contains("disabled"); // Trả về true nếu có class "disabled"
      }
      return true; // Nếu không tìm thấy nút, coi như đã tới trang cuối
    });

    if (!isNextButtonDisabled) {
      // Nếu nút "Trang tiếp theo" không bị vô hiệu hóa, nhấn vào để chuyển trang
      await page.click(".pagination-next a");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Chờ load trang mới
      return true; // Tiếp tục crawl trang tiếp theo
    } else {
      return false; // Không còn trang tiếp theo
    }
  }

  // Lặp qua tất cả các trang và crawl dữ liệu
  while (hasNextPage) {
    // Crawl dữ liệu từ bảng trên trang hiện tại
    const tableData = await crawlTableData();
    allTableData.push(...tableData); // thêm dữ liệu từng trang

    // Chuyển sang trang tiếp theo nếu có
    hasNextPage = await goToNextPage();
  }

  // Ghi dữ liệu thành tệp JSON
  fs.writeFileSync('dataCrawl/MonTienQuyet.json', JSON.stringify(allTableData, null, 2), 'utf-8');
  console.log('Dữ liệu thời khóa biểu đã được lưu vào timetableData.json');

};

module.exports = {crawlMTQuyet};