import React, { createContext, useState, useContext } from 'react';

export const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const savedLang = localStorage.getItem('language');
      return (savedLang === 'EN' || savedLang === 'VN') ? savedLang : 'EN';
    } catch (e) {
      return 'EN';
    }
  });

  const changeLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('language', newLang);
    } catch (e) {
      console.warn('localStorage is not available');
    }
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const translations = {
  VN: {
    // Home
    homeSubtitle: 'Bờm Kitchen & Wine Bar mang đến không gian linh hoạt cho mọi dịp, với Bờm Dining là trung tâm—nơi thực đơn tasting Việt đương đại tinh tế biến mỗi buổi gặp gỡ thành một trải nghiệm đáng nhớ.',
    homeContact: 'Liên hệ',

    // Navbar
    navAbout: 'Về Chúng Tôi',
    navMenu: 'Thực Đơn',
    navEvents: 'Sự Kiện',
    navPress: 'Báo Chí',
    navReservations: 'Đặt Bàn',
    
    // AboutUs
    heroTitle: 'Bờm Kitchen Wine & Bar',
    heroSubtitle: 'Michelin Recommended 2024',
    aboutTitle: 'Về Chúng Tôi',
    aboutDesc1: 'Thuộc hệ thống các nhà hàng của Bờm Hospitality, Bờm Kitchen & Wine Bar lấy cảm hứng từ nhân vật nổi tiếng trong truyện dân gian và muốn truyền tải thông điệp về sự kết nối giữa con người và văn hóa trong bối cảnh ẩm thực hiện đại. Bờm không chỉ là một nhà hàng, mà còn là người kết nối giúp các nền văn hoá xích lại gần nhau hơn thông qua ngôn ngữ của ẩm thực. Tự hào là một trong những người tiên phong về ẩm thực Việt fusion, chúng tôi mang đến nhiều trải nghiệm ẩm thực đầy màu sắc cho người Việt cũng như bạn bè quốc tế. Hãy cùng Bờm khám phá sự hòa quyện của các hương vị trên khắp thế giới và hòa mình vào một hành trình ẩm thực giao lưu kỳ vĩ!',
    hoursTitle: 'Giờ mở cửa',
    hours: 'Thứ Hai – Chủ Nhật\n10:30 - 23:00',
    addressTitle: 'Địa chỉ',

    // Footer
    footerMichelin: 'Được Michelin khuyến nghị 2023, 2024, 2025, 2026',    
    footerQuickLinks: 'Liên kết nhanh',
    footerContact: 'Liên hệ',
    footerAddress: '24 Nguyễn Thị Nghĩa, Phường Bến Thành, TP. Hồ Chí Minh',
    footerHotline: 'Hotline: (+84) 82 399 9980',
    footerEmail: 'Email: booking@bomhospitality.vn',
    footerFollowUs: 'Theo dõi chúng tôi',
    footerCopyright: '© 2024 Bờm Hospitality. Bảo lưu mọi quyền.',
    
    // Events
    eventsTitle: 'Sự Kiện',
    
    // Menu
    menuTitle: 'Thực Đơn',
    setMenuTitle: 'SET MENU',
    alaCarteTitle: 'A LA CARTE MENU',
    wineDrinkTitle: 'WINE',
    khungTitle: 'DRINK MENU',
    tabSetMenu: 'Set Menu',
    tabAlacarte: 'Alacarte menu',
    tabWineDrink: 'Wine',
    tabKhung: 'Drink Menu',
    menuDetailTitle: 'Chi Tiết Thực Đơn',
    menuLoading: 'Đang tải...',
    tapToEnlarge: 'Nhấn để phóng to',
    menuShowcaseEmpty: 'Chưa có SET MENU. Thêm tại trang quản trị.',
    
    // Press
    pressTitle: 'Báo Chí Nói Về Chúng Tôi',
    pressReadMore: 'Đọc thêm →',
    
    // ReservationForm
    resTitle: 'Đặt bàn ngay',
    resSubtitle: 'Vui lòng điền đầy đủ thông tin bên dưới',
    resName: 'Tên khách hàng *',
    resNamePlaceholder: 'Nhập họ và tên',
    resPhone: 'Số điện thoại *',
    resPhonePlaceholder: 'Nhập số điện thoại (10-11 số)',
    resGuests: 'Số lượng khách *',
    resDate: 'Ngày đặt bàn *',
    resTime: 'Giờ đặt bàn *',
    resNote: 'Ghi chú (không bắt buộc)',
    resNotePlaceholder: 'Yêu cầu đặc biệt (ăn chay, bánh sinh nhật, ...)',
    resSubmit: 'Đặt bàn ngay',
    resProcessing: 'Đang xử lý...',
    resSuccess: 'Đặt bàn thành công!',
    resSuccessDesc: 'Cảm ơn bạn đã đặt bàn tại nhà hàng',
    resSummaryTitle: 'Thông tin đặt bàn',
    resSummaryName: 'Tên khách hàng:',
    resSummaryPhone: 'Số điện thoại:',
    resSummaryGuests: 'Số lượng khách:',
    resSummaryDate: 'Ngày đặt:',
    resSummaryTime: 'Giờ đặt:',
    resSummaryNote: 'Ghi chú:',
    resSummaryCode: 'Mã đặt bàn:',
    resNewBooking: 'Đặt bàn mới',
    resStep1Title: 'Vui lòng điền thông tin đặt bàn',
    resStep2Title: 'Thông tin liên hệ',
    resStore: 'Cửa hàng',
    resNext: 'Tiếp theo',
    resBack: 'Quay lại',
    resEmail: 'Email',

    // Validation
    errName: 'Vui lòng nhập tên',
    errPhone: 'Vui lòng nhập số điện thoại',
    errPhoneInvalid: 'Số điện thoại không hợp lệ (10-11 số)',
    errGuests: 'Số khách phải lớn hơn 0',
    errDatePast: 'Không thể đặt bàn trong quá khứ',
    errDateEmpty: 'Vui lòng chọn ngày',
    errTimeEmpty: 'Vui lòng chọn giờ',
    errTimeInvalid: 'Giờ không hợp lệ',
    errSubmit: 'Có lỗi xảy ra, vui lòng thử lại'
  },
  EN: {
    // Home
    homeSubtitle: 'Bờm Kitchen & Wine Bar offers versatile spaces for every occasion, with Bờm Dining at its heart—where refined contemporary Vietnamese tasting menus turn every gathering into a memorable experience.',
    homeContact: 'Contact us',

    // Navbar
    navAbout: 'About Us',
    navMenu: 'Menu',
    navEvents: 'Events',
    navPress: 'Press',
    navReservations: 'Reservations',
    
    // AboutUs
    heroTitle: 'Bờm Kitchen Wine & Bar',
    heroSubtitle: 'Michelin Recommended 2023, 2024, 2025, 2026',
    aboutTitle: 'About Us',
    aboutDesc1: 'As part of the Bờm Hospitality restaurant group, Bờm Kitchen & Wine Bar draws inspiration from the iconic character in Vietnamese folklore, delivering a message of connection between people and culture through the lens of modern cuisine. Bờm is more than just a restaurant - it is a bridge that brings cultures closer together through the universal language of food. Pioneering Vietnamese fusion cuisine, we take pride in offering vibrant culinary experiences to both locals and international guests. Join Bờm on a journey to explore the harmonious blend of global flavors and immerse yourself in a magnificent culinary adventure!',
    hoursTitle: 'Opening Hours',
    hours: 'Monday - Sunday\n10:30 AM - 11:00 PM',
    addressTitle: 'Address',

    // Footer
    footerQuickLinks: 'Quick Links',
    footerContact: 'Contact',
    footerAddress: '24 Nguyen Thi Nghia, Ben Thanh Ward, Ho Chi Minh City',
    footerHotline: 'Hotline: (+84) 82 399 9980',
    footerEmail: 'Email: booking@bomhospitality.vn',
    footerFollowUs: 'Follow Us',
    footerCopyright: '© 2024 Bờm Hospitality. All rights reserved.',
    
    // Events
    eventsTitle: 'Events',
    
    // Menu
    menuTitle: 'Menu',
    setMenuTitle: 'SET MENU',
    alaCarteTitle: 'A LA CARTE MENU',
    wineDrinkTitle: 'WINE',
    khungTitle: 'DRINK MENU',
    tabSetMenu: 'Set Menu',
    tabAlacarte: 'Alacarte menu',
    tabWineDrink: 'Wine',
    tabKhung: 'Drink Menu',
    menuDetailTitle: 'Menu Details',
    menuLoading: 'Loading...',
    tapToEnlarge: 'Tap to enlarge',
    menuShowcaseEmpty: 'No set menus yet. Add them in the admin panel.',
    
    // Press
    pressTitle: 'Press About Us',
    pressReadMore: 'Read more →',
    
    // ReservationForm
    resTitle: 'Book a Table',
    resSubtitle: 'Please fill in the information below',
    resName: 'Full Name *',
    resNamePlaceholder: 'Enter your full name',
    resPhone: 'Phone Number *',
    resPhonePlaceholder: 'Enter phone number (10-11 digits)',
    resGuests: 'Number of Guests *',
    resDate: 'Date *',
    resTime: 'Time *',
    resNote: 'Note (optional)',
    resNotePlaceholder: 'Special requests (vegetarian, birthday cake, ...)',
    resSubmit: 'Book Now',
    resProcessing: 'Processing...',
    resSuccess: 'Booking Successful!',
    resSuccessDesc: 'Thank you for booking a table with us',
    resSummaryTitle: 'Booking Summary',
    resSummaryName: 'Name:',
    resSummaryPhone: 'Phone:',
    resSummaryGuests: 'Guests:',
    resSummaryDate: 'Date:',
    resSummaryTime: 'Time:',
    resSummaryNote: 'Note:',
    resSummaryCode: 'Booking Code:',
    resNewBooking: 'New Booking',
    resStep1Title: 'Please enter your booking details',
    resStep2Title: 'Contact Information',
    resStore: 'Restaurant',
    resNext: 'Next',
    resBack: 'Back',
    resEmail: 'Email',

    // Validation
    errName: 'Please enter your name',
    errPhone: 'Please enter your phone number',
    errPhoneInvalid: 'Invalid phone number (10-11 digits)',
    errGuests: 'Number of guests must be > 0',
    errDatePast: 'Cannot book a date in the past',
    errDateEmpty: 'Please select a date',
    errTimeEmpty: 'Please select a time',
    errTimeInvalid: 'Invalid time',
    errSubmit: 'An error occurred, please try again'
  }
};


