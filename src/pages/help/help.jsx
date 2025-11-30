import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
  Button,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MicIcon from "@mui/icons-material/Mic";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EmailIcon from "@mui/icons-material/Email";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ChatIcon from '@mui/icons-material/Chat'; 

export default function Help() {
  return (
    <Box className="help-container" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: "0 auto" }}>

      <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 3, background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)', color: 'white' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <PsychologyAltIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="700">
              TRUNG TÂM HỖ TRỢ NGƯỜI DÙNG DYD
            </Typography>
            <Typography variant="subtitle1">
              Khám phá hướng dẫn chi tiết và giải đáp thắc mắc để quản lý cuộc họp hiệu quả nhất.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom fontWeight="600" sx={{ mt: 4, mb: 2 }}>
        📖 Hướng Dẫn Sử Dụng
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold' }}>
          <AccountCircleIcon sx={{ mr: 1, color: 'primary.main' }} /> 1. Đăng nhập và Thiết lập Hồ sơ Giọng nói
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            • Nhấn nút <b>“Đăng nhập với Google”</b>. Hệ thống sẽ tự động tạo tài khoản cho bạn.<br />
            • Truy cập "Trang Cài đặt" cá nhân. Tại đây, bạn nên "Tải lên/Ghi âm mẫu giọng nói cá nhân" (dưới 10 giây). Việc này giúp hệ thống nhận diện chính xác giọng nói của bạn trong các cuộc họp nhóm.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold' }}>
          <PeopleAltIcon sx={{ mr: 1, color: 'primary.main' }} /> 2. Quản lý Nhóm và Thành viên
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            • Tại Trang Chủ, chọn <b>“Tạo nhóm”</b>.<br />
            • Để mời thành viên: Truy cập tab "Thành viên" trong Chi tiết nhóm, nhập "Email" và "Tên gợi nhớ" (bí danh trong nhóm) của người muốn mời.<br />
            • "Quyền Chủ nhóm:" Chỉ Chủ nhóm mới có quyền xóa thành viên hoặc cập nhật tên gợi nhớ của thành viên khác.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold' }}>
          <MicIcon sx={{ mr: 1, color: 'primary.main' }} /> 3. Ghi âm và Nhận diện Người nói
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            • Trong trang Chi tiết cuộc họp, chọn tab <b>Ghi âm</b>:
            <ul>
              <li>Nhấn “Bắt đầu Ghi âm” hoặc “Tải file” âm thanh có sẵn.</li>
              <li>Sau khi gửi xử lý và thực hiện tạo biên bản, hệ thống sẽ chuyển đổi thành văn bản (transcript) và sử dụng mẫu giọng nói của nhóm để gán nhãn Tên gợi nhớ chính xác cho từng đoạn hội thoại.</li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold' }}>
          <AutoStoriesIcon sx={{ mr: 1, color: 'primary.main' }} /> 4. Tạo Biên bản Tự động và Chỉnh sửa
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            • Chuyển sang tab "Xử lý Biên bản", sử dụng hộp thoại "Tạo Biên bản AI".<br />
            • Nhập lệnh tóm tắt (Prompt) (ví dụ: "Tóm tắt các quyết định và hành động chính") để AI tự động tạo bản nháp biên bản.<br />
            • Bạn có thể chỉnh sửa thủ công nội dung, hoặc "Tải lên Biên bản Mẫu (.docx)" chuẩn của tổ chức để bắt đầu.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold' }}>
          <EventNoteIcon sx={{ mr: 1, color: 'primary.main' }} /> 5. Gửi Ký Điện tử và Theo dõi Trạng thái
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            • Sau khi hoàn thiện, kích hoạt "Hộp thoại Gửi Ký", nhập email của người cần ký.<br />
            • Hệ thống sẽ gửi tài liệu qua dịch vụ "DocuSign".<br />
            • Bạn có thể theo dõi "Trạng thái ký" (Đã gửi, Đã xem, Đã hoàn thành) trực tiếp trên trang chi tiết cuộc họp.<br />
            • Khi hoàn tất, phiên bản "PDF đã ký" chính thức sẽ được lưu trữ tự động.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold' }}>
          <ChatIcon sx={{ mr: 1, color: 'primary.main' }} /> 6. Tra cứu Thông tin Nhanh bằng Chatbot AI
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            • "Trong Trang Chi tiết Nhóm:" Sử dụng Chatbot để hỏi về trạng thái nhóm (ví dụ: "Cuộc họp tiếp theo khi nào?").<br />
            • "Trong Trang Chi tiết Cuộc họp:" Sử dụng Chatbot để hỏi chi tiết về nội dung cuộc họp (ví dụ: "Quyết định quan trọng nhất là gì?", "Nhiệm vụ của người A?").
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" component="h2" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
        <QuestionAnswerIcon sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" /> Câu Hỏi Thường Gặp (FAQ)
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Làm thế nào để hệ thống nhận diện giọng nói của tôi chính xác?
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Bạn cần "tải lên/ghi âm mẫu giọng nói cá nhân" trong "Trang Cài đặt" trước khi tham gia cuộc họp. Hệ thống sẽ sử dụng mẫu này và tổng hợp với giọng của các thành viên khác để gán nhãn Tên gợi nhớ cho các đoạn hội thoại một cách chính xác nhất.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Tại sao biên bản AI tạo ra không chính xác 100%?
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Biên bản AI được tổng hợp dựa trên nội dung transcript thô, tuy nhiên AI có thể bỏ sót các ngữ cảnh hoặc ý định tinh tế. Chúng tôi khuyến nghị bạn luôn "chỉnh sửa thủ công" lại biên bản để đảm bảo tính chính xác tuyệt đối trước khi gửi ký.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Tôi có thể tải lên biên bản mẫu tùy chỉnh không?
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Có. Bạn có thể sử dụng chức năng "Thêm/Cập nhật biên bản Mẫu" trong tab Xử lý Biên bản để tải lên file mẫu (.docx) đã được chuẩn hóa theo quy định của tổ chức bạn.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <Box component={Paper} elevation={2} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              <ContactSupportIcon sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" /> Cần Hỗ trợ Kỹ thuật?
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Nếu bạn gặp vấn đề kỹ thuật hoặc có thắc mắc chuyên sâu, vui lòng liên hệ với đội ngũ của chúng tôi.
            </Typography>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              href="https://mail.google.com/mail/?view=cm&fs=1&to=n21dcpt102@student.ptithcm.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ bgcolor: '#2a5298' }}
              fullWidth
            >
              Liên hệ qua Email
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 4 }}>
        DYD - Tối ưu hóa hiệu suất làm việc nhóm.
      </Typography>
    </Box>
  );
}