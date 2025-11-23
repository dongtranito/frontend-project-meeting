import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Help() {
  return (
    <Box className="help-container" sx={{ p: 3, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📘 Hướng dẫn sử dụng DYD
      </Typography>
      <Typography variant="body1" gutterBottom>
        Chào mừng bạn đến với DYD! Dưới đây là hướng dẫn chi tiết giúp bạn dễ dàng sử dụng các chức năng chính của hệ thống.
      </Typography>

      {/* 1. Đăng nhập */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>⚙️ Đăng nhập hệ thống</AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            • Nhấn nút <b>“Đăng nhập với Google”</b> tại trang chủ.<br />
            • Sau khi đăng nhập thành công, bạn sẽ được chuyển đến trang quản lý nhóm và cuộc họp.<br />
            • Nếu chưa có tài khoản, hệ thống sẽ tự động tạo cho bạn.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 2. Tạo & quản lý nhóm */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>👥 Quản lý nhóm</AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            • Chọn <b>“Tạo nhóm”</b> để bắt đầu nhóm làm việc.<br />
            • Mời thành viên qua email bằng cách nhập địa chỉ Gmail và nhấn “Gửi lời mời”.<br />
            • Bạn có thể đổi tên nhóm hoặc rời nhóm trong phần cài đặt nhóm.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 3. Quản lý cuộc họp */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>📅 Tạo và xem chi tiết cuộc họp</AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            • Trong nhóm, bạn chọn <b>“Tạo cuộc họp”</b> rồi đặt tên, thời gian và mô tả nếu cần.<br />
            • Nhấp vào tên cuộc họp để xem chi tiết, ghi âm cuộc họp, hoặc tạo biên bản tự động từ AI.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 4. Ghi âm cuộc họp */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>🎙️ Ghi âm & upload file âm thanh</AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            • Nhấn <b>“Ghi âm”</b> để bắt đầu thu âm bằng micro của thiết bị.<br />
            • Nhấn <b>“Dừng ghi”</b> để lưu lại đoạn âm thanh.<br />
            • Hoặc chọn <b>“Tải file”</b> để upload tệp âm thanh có sẵn từ máy.<br />
            • Sau khi thu âm hoặc chọn file, hãy nhấn <b>“Gửi lên server”</b> để lưu trữ.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 5. Tạo transcript & biên bản */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>📝 Tạo transcript & biên bản tự động</AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            • Sau khi upload thành công file âm thanh, nhấn <b>“Hiển thị transcript”</b> để hệ thống hiển thị transcript.<br />
            • Kết quả transcript và biên bản AI sẽ hiển thị trong phần chi tiết cuộc họp.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 6. Lỗi thường gặp */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>❓ Lỗi thường gặp & cách khắc phục</AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            • <b>Không ghi âm được?</b> → Kiểm tra micro & cấp quyền cho trình duyệt.<br />
            • <b>Không upload được file?</b> → Đảm bảo file đúng định dạng (.mp3) và kích thước hợp lệ.<br />
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        📩 Cần thêm trợ giúp? Liên hệ: <b>support@dyd.com</b>
      </Typography>
    </Box>
  );
}
