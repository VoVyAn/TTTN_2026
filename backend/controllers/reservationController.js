const Reservation = require('../models/Reservation');
const { sendConfirmationEmail } = require('../config/mailer');
const { isValidObjectId } = require('../utils/helpers');

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const { name, phone, email, guests, date, time, note, table, nationality, creator, status } = req.body;
    
    // Validation
    if (!name) return res.status(400).json({ error: 'Tên khách hàng là bắt buộc' });
    if (!phone) return res.status(400).json({ error: 'Số điện thoại là bắt buộc' });
    if (!/^\d{10,11}$/.test(phone)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ (10-11 số)' });
    }
    if (!guests || guests < 1) {
      return res.status(400).json({ error: 'Số khách phải lớn hơn 0' });
    }
    if (!date) return res.status(400).json({ error: 'Ngày đặt bàn là bắt buộc' });
    if (!time) return res.status(400).json({ error: 'Giờ đặt bàn là bắt buộc' });
    
    // Kiểm tra ngày không quá khứ
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ error: 'Không thể đặt bàn trong quá khứ' });
    }
    
    const reservation = new Reservation({
      customer_name: name,
      phone,
      email: email || '',
      guests: Number(guests),
      date,
      time,
      note: note || '',
      table: table || '',
      nationality: nationality || '',
      creator: creator || '',
      status: status || 'new'
    });
    
    await reservation.save();

    // Gửi email xác nhận đặt bàn chạy không đồng bộ (background)
    if (reservation.email) {
      sendConfirmationEmail(reservation).catch(err => {
        console.error('Lỗi khi gửi email xác nhận đặt bàn:', err);
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Đặt bàn thành công!',
      reservation: {
        id: reservation._id,
        name: reservation.customer_name,
        phone: reservation.phone,
        email: reservation.email,
        guests: reservation.guests,
        date: reservation.date,
        time: reservation.time,
        note: reservation.note
      }
    });

    // Phát sự kiện WebSockets cho Admin biết có đơn mới
    const io = req.app.get('io');
    if (io) {
      io.emit('new_reservation', reservation);
    }
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;
    
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy đơn đặt bàn' });
    
    // Báo cho clients khác biết có sự cập nhật (có thể dùng chung event new_reservation hoặc tạo event mới)
    const io = req.app.get('io');
    if (io) {
      io.emit('new_reservation', updated);
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy đơn đặt bàn' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation
};
