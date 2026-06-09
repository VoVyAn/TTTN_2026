const nodemailer = require('nodemailer');

const createTransporter = async () => {
  // If SMTP configurations are present in .env, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // If Gmail configurations are present in .env, use them
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Fallback: create a test SMTP service on Ethereal.email
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Đã tạo tài khoản test email Ethereal thành công!');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (error) {
    console.error(' Không thể tạo tài khoản test email Ethereal:', error);
    return null;
  }
};

const sendConfirmationEmail = async (reservation) => {
  if (!reservation.email) return;

  try {
    const transporter = await createTransporter();
    if (!transporter) {
      console.log(' Transporter không khả dụng, không gửi email.');
      return;
    }

    const formattedDate = new Date(reservation.date).toLocaleDateString('vi-VN');
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"BỜM - Kitchen & Wine Bar" <booking@bomhospitality.vn>',
      to: reservation.email,
      subject: 'Xác Nhận Đặt Bàn Thành Công - BỜM Kitchen & Wine Bar',
      html: `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f7f5f2; padding: 2rem; color: #352e27;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #e5e0d9; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
              <h1 style="color: #2b2724; font-size: 24px; margin: 0; font-family: 'Playfair Display', serif; letter-spacing: 1px;">BỜM KITCHEN & WINE BAR</h1>
              <p style="color: #6e655c; margin: 5px 0 0 0;">Cảm ơn bạn đã lựa chọn nhà hàng chúng tôi</p>
            </div>
            
            <h2 style="color: #27ae60; text-align: center; margin-bottom: 1.5rem;">ĐẶT BÀN THÀNH CÔNG!</h2>
            
            <p>Xin chào <strong>${reservation.customer_name}</strong>,</p>
            <p>Yêu cầu đặt bàn của bạn tại BỜM Kitchen & Wine Bar đã được ghi nhận. Dưới đây là thông tin chi tiết:</p>
            
            <div style="background: #f7f5f2; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Mã đặt bàn:</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #352e27;">#${String(reservation._id).slice(-6).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Khách hàng:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.customer_name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Số điện thoại:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Email:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Số lượng khách:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.guests} người</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Ngày đặt bàn:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Giờ đặt bàn:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.time}</td>
                </tr>
                ${reservation.note ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c; vertical-align: top;">Ghi chú:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.note}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="border-top: 1px solid #e5e0d9; padding-top: 1.5rem; margin-top: 1.5rem; font-size: 14px; color: #6e655c; text-align: center;">
              <p style="margin: 0 0 5px 0;"><strong>Địa chỉ:</strong> 24 Nguyễn Thị Nghĩa, Phường Bến Thành, TP. Hồ Chí Minh</p>
              <p style="margin: 0 0 5px 0;"><strong>Hotline:</strong> (+84) 82 399 9980</p>
              <p style="margin: 0;">Rất hân hạnh được phục vụ quý khách!</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email đã được gửi thành công. Message ID:', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('🔗 Link xem trước email (Ethereal):', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Lỗi khi gửi email xác nhận đặt bàn:', error);
  }
};

module.exports = { sendConfirmationEmail };
