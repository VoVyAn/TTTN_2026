const menuSetsEN = [
  // Set Menu (set)
  {
    title: 'VEGETARIAN SET', theme: 'green',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    pricing: ['3-course: 299,000/pax', '4-course: 399,000/pax'],
    courses: [
      { label: 'STARTER', items: [{ name: 'Fresh Spring Rolls', desc: 'Rice paper, herbs, peanut sauce' }, { name: 'Lotus Root Salad', desc: 'Crispy lotus, sesame dressing' }] },
      { label: 'MAIN', items: [{ name: 'Tofu Clay Pot', desc: 'Mushroom, lemongrass, chili' }, { name: 'Vegetable Fried Rice', desc: 'Seasonal greens, jasmine rice' }] },
      { label: 'DESSERT', items: [{ name: 'Coconut Pudding', desc: 'Palm sugar, pandan' }, { name: 'Seasonal Fruit', desc: "Chef's selection" }] }
    ],
    footer: 'Prices are subject to 5% service charge & applicable tax.', lang: 'EN', sortOrder: 1, menuType: 'set'
  },
  {
    title: 'THE LOVE STORY SET', theme: 'rose',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    pricing: ['Couple set: 1,199,000/2 pax'],
    courses: [
      { label: 'STARTER', items: [{ name: 'Oysters & Caviar', desc: 'Champagne mignonette' }, { name: 'Heart Beet Salad', desc: 'Goat cheese, honey balsamic' }] },
      { label: 'MAIN', items: [{ name: 'Wagyu Tenderloin', desc: 'Truffle mash, red wine jus' }, { name: 'Lobster Thermidor', desc: 'Gratinated, herb butter' }] },
      { label: 'DESSERT', items: [{ name: 'Chocolate Lava', desc: 'Vanilla bean ice cream' }, { name: 'Rose Panna Cotta', desc: 'Lychee, edible petals' }] }
    ],
    footer: 'Perfect for anniversaries & special evenings.', lang: 'EN', sortOrder: 2, menuType: 'set'
  },
  {
    title: 'PHÚ HẢO SET', theme: 'cream',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    pricing: ['Heritage set: 899,000/pax'],
    courses: [
      { label: 'STARTER', items: [{ name: 'Hanoi Spring Rolls', desc: 'Crispy rolls, fresh herbs' }, { name: 'Young Papaya Salad', desc: 'Shrimp chips, fish sauce lime' }] },
      { label: 'MAIN', items: [{ name: 'Braised Fish Village Style', desc: 'Turmeric, chili, rice noodles' }, { name: 'Five-Spice Duck', desc: 'Caramel glaze, pickles' }] },
      { label: 'DESSERT', items: [{ name: 'Sticky Rice Balls', desc: 'Ginger syrup, mung bean' }, { name: 'Jasmine Tea', desc: 'Tay Ho lotus scent' }] }
    ],
    footer: 'Inspired by Northern Vietnamese home cooking.', lang: 'EN', sortOrder: 3, menuType: 'set'
  },
  {
    title: 'BỜM SIGNATURE SET', theme: 'gold',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    pricing: ["Chef's tasting: 1,499,000/pax", 'Wine pairing: +590,000/pax'],
    courses: [
      { label: 'STARTER', items: [{ name: 'Fusion Tartare', desc: 'Beef, capers, rice cracker' }, { name: 'Foie Gras Torchon', desc: 'Fig compote, brioche' }] },
      { label: 'MAIN', items: [{ name: 'Dry-Aged Ribeye', desc: 'Black pepper sauce, charred leek' }, { name: 'Seafood Risotto', desc: 'Prawn, scallop, saffron' }] },
      { label: 'DESSERT', items: [{ name: 'Michelin Flan', desc: 'Caramel, coffee tuile' }, { name: 'Petit Fours', desc: "Chef's daily selection" }] }
    ],
    footer: 'Michelin-recommended experience. Reserve 24h in advance.', lang: 'EN', sortOrder: 4, menuType: 'set'
  },
  
  // Alacarte Menu (alacarte)
  {
    title: "CHEF'S SIGNATURE STEAK", theme: 'gold',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    pricing: ['450,000/pax'],
    courses: [
      { label: 'SPECIALTY', items: [{ name: 'Wagyu Ribeye Steak', desc: 'Japanese Wagyu, black pepper sauce, truffle fries' }] }
    ],
    footer: 'Recommended medium-rare.', lang: 'EN', sortOrder: 11, menuType: 'alacarte'
  },
  {
    title: 'LOBSTER LINGUINE', theme: 'cream',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
    pricing: ['350,000/pax'],
    courses: [
      { label: 'SPECIALTY', items: [{ name: 'Boston Lobster Pasta', desc: 'Fresh lobster, creamy saffron sauce, cherry tomatoes' }] }
    ],
    footer: "Chef's favorite fusion recipe.", lang: 'EN', sortOrder: 12, menuType: 'alacarte'
  },

  // Wine & Drink Menu (wine)
  {
    title: 'BỜM SIGNATURE COCKTAILS', theme: 'rose',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    pricing: ['From 180,000/cocktail'],
    courses: [
      {
        label: 'COCKTAIL HINTS',
        items: [
          { name: 'Phở Cocktail', desc: 'Gin, triple sec, star anise, cinnamon syrup' },
          { name: 'Lotus Martini', desc: 'Vodka, lotus seed paste, dry vermouth' }
        ]
      }
    ],
    footer: 'Curated mixology inspired by Vietnamese flavors.', lang: 'EN', sortOrder: 21, menuType: 'wine'
  },
  {
    title: 'PREMIUM WINE CELLAR', theme: 'gold',
    image: 'https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=800&q=80',
    pricing: ['By bottle or glass'],
    courses: [
      { label: 'RED WINE', items: [{ name: 'Cabernet Sauvignon Chile', desc: 'Rich berries, vanilla undertones' }] },
      { label: 'WHITE WINE', items: [{ name: 'Chardonnay France', desc: 'Crisp apple, citrus aromas' }] }
    ],
    footer: 'Ask our sommelier for pairing advice.', lang: 'EN', sortOrder: 22, menuType: 'wine'
  },

  // Khung / Frame (khung)
  {
    title: 'WELCOME TO BỜM KITCHEN', theme: 'green',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    pricing: ['Open Daily'],
    courses: [
      { label: 'SERVICE HOURS', items: [{ name: 'Lunch & Dinner', desc: '10:30 AM - 11:00 PM' }] }
    ],
    footer: '24 Nguyen Thi Nghia, District 1, HCMC', lang: 'EN', sortOrder: 31, menuType: 'khung'
  },
  {
    title: 'THE ELEGANT SPACE', theme: 'cream',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    pricing: ['Capacity: 80 guests'],
    courses: [
      {
        label: 'FACILITIES',
        items: [
          { name: 'Private Dining Rooms', desc: 'For business or family gatherings' },
          { name: 'Wine Bar Counter', desc: 'Premium mixology counter' }
        ]
      }
    ],
    footer: 'Reservation recommended 24 hours in advance.', lang: 'EN', sortOrder: 32, menuType: 'khung'
  }
];

const menuSetsVN = [
  // Set Menu (set)
  {
    title: 'SET CHAY', theme: 'green',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    pricing: ['3 món: 299.000/khách', '4 món: 399.000/khách'],
    courses: [
      { label: 'KHAI VỊ', items: [{ name: 'Gỏi cuốn tươi', desc: 'Bánh tráng, rau thơm, tương đậu' }, { name: 'Gỏi ngó sen', desc: 'Ngó sen giòn, mè rang' }] },
      { label: 'MÓN CHÍNH', items: [{ name: 'Đậu hũ kho tộ', desc: 'Nấm, sả, ớt' }, { name: 'Cơm chiên rau củ', desc: 'Rau theo mùa, gạo thơm' }] },
      { label: 'TRÁNG MIỆNG', items: [{ name: 'Bánh flan dừa', desc: 'Đường thốt nốt, lá dứa' }, { name: 'Trái cây theo mùa', desc: 'Bếp trưởng chọn lọc' }] }
    ],
    footer: 'Giá đã bao gồm 5% phí phục vụ & thuế theo quy định.', lang: 'VN', sortOrder: 1, menuType: 'set'
  },
  {
    title: 'SET LOVE STORY', theme: 'rose',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    pricing: ['Set đôi: 1.199.000/2 khách'],
    courses: [
      { label: 'KHAI VỊ', items: [{ name: 'Hàu & trứng cá', desc: 'Sốt champagne' }, { name: 'Salad củ dền', desc: 'Phô mai dê, mật ong' }] },
      { label: 'MÓN CHÍNH', items: [{ name: 'Thăn bò Wagyu', desc: 'Khoai nghiền truffle, sốt vang đỏ' }, { name: 'Tôm hùm Thermidor', desc: 'Gratin, bơ thảo mộc' }] },
      { label: 'TRÁNG MIỆNG', items: [{ name: 'Bánh sô-cô-la tan chảy', desc: 'Kem vani' }, { name: 'Panna cotta hoa hồng', desc: 'Vải, cánh hoa ăn được' }] }
    ],
    footer: 'Dành cho kỷ niệm & buổi tối đặc biệt.', lang: 'VN', sortOrder: 2, menuType: 'set'
  },
  {
    title: 'SET PHÚ HẢO', theme: 'cream',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    pricing: ['Set truyền thống: 899.000/khách'],
    courses: [
      { label: 'KHAI VỊ', items: [{ name: 'Chả giò Hà Nội', desc: 'Giòn rụm, rau sống' }, { name: 'Gỏi đu đủ', desc: 'Tôm khô, mắm me' }] },
      { label: 'MÓN CHÍNH', items: [{ name: 'Cá kho làng Vũ Đại', desc: 'Nghệ, ớt, bún' }, { name: 'Vịt quay ngũ vị', desc: 'Caramel, dưa chua' }] },
      { label: 'TRÁNG MIỆNG', items: [{ name: 'Chè trôi nước', desc: 'Gừng, đậu xanh' }, { name: 'Trà sen', desc: 'Ướp hương Tây Hồ' }] }
    ],
    footer: 'Cảm hứng từ ẩm thực Bắc Bộ truyền thống.', lang: 'VN', sortOrder: 3, menuType: 'set'
  },
  {
    title: 'SET ĐẶC SẮC BỜM', theme: 'gold',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    pricing: ['Thực đơn degustation: 1.499.000/khách', 'Ghép rượu: +590.000/khách'],
    courses: [
      { label: 'KHAI VỊ', items: [{ name: 'Tartare fusion', desc: 'Bò, caper, bánh gạo giòn' }, { name: 'Gan vịt áp chảo', desc: 'Mứt sung, brioche' }] },
      { label: 'MÓN CHÍNH', items: [{ name: 'Ribeye ủ khô', desc: 'Sốt tiêu đen, tỏi tây nướng' }, { name: 'Risotto hải sản', desc: 'Tôm, điệp, nghệ tây' }] },
      { label: 'TRÁNG MIỆNG', items: [{ name: 'Flan Michelin', desc: 'Caramel, bánh quy cà phê' }, { name: 'Petit fours', desc: 'Lựa chọn trong ngày' }] }
    ],
    footer: 'Trải nghiệm Michelin. Đặt trước 24 giờ.', lang: 'VN', sortOrder: 4, menuType: 'set'
  },

  // Alacarte Menu (alacarte)
  {
    title: 'BÒ WAGYU THƯỢNG HẠNG', theme: 'gold',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    pricing: ['450.000đ/phần'],
    courses: [
      { label: 'ĐẶC SẮC BẾP TRƯỞNG', items: [{ name: 'Bò Ribeye Wagyu', desc: 'Bò Wagyu Nhật Bản, sốt tiêu đen, khoai tây chiên truffle' }] }
    ],
    footer: 'Được khuyên dùng chín vừa (medium-rare).', lang: 'VN', sortOrder: 11, menuType: 'alacarte'
  },
  {
    title: 'MÌ Ý TÔM HÙM BOSTON', theme: 'cream',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
    pricing: ['350.000đ/phần'],
    courses: [
      { label: 'ĐẶC SẮC BẾP TRƯỞNG', items: [{ name: 'Mì Ý Sốt Kem Tôm Hùm', desc: 'Tôm hùm Boston tươi, sốt kem nghệ tây, cà chua bi' }] }
    ],
    footer: 'Công thức fusion đặc sắc từ Bếp trưởng.', lang: 'VN', sortOrder: 12, menuType: 'alacarte'
  },

  // Wine & Drink Menu (wine)
  {
    title: 'COCKTAIL ĐẶC SẮC BỜM', theme: 'rose',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    pricing: ['Từ 180.000đ/ly'],
    courses: [
      {
        label: 'GỢI Ý COCKTAIL',
        items: [
          { name: 'Phở Cocktail', desc: 'Gin, triple sec, hồi, quế, xi-rô sả' },
          { name: 'Lotus Martini', desc: 'Vodka, mứt hạt sen, vermouth khô' }
        ]
      }
    ],
    footer: 'Nghệ thuật pha chế lấy cảm hứng từ hương vị Việt.', lang: 'VN', sortOrder: 21, menuType: 'wine'
  },
  {
    title: 'HẦM RƯỢU CAO CẤP', theme: 'gold',
    image: 'https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=800&q=80',
    pricing: ['Phục vụ theo chai hoặc ly'],
    courses: [
      { label: 'RƯỢU VANG ĐỎ', items: [{ name: 'Cabernet Sauvignon Chile', desc: 'Quả mọng chín, hậu vị vani thơm' }] },
      { label: 'RƯỢU VANG TRẮNG', items: [{ name: 'Chardonnay Pháp', desc: 'Táo xanh giòn, hương cam chanh thanh mát' }] }
    ],
    footer: 'Hãy hỏi sommelier của chúng tôi để được tư vấn kết hợp.', lang: 'VN', sortOrder: 22, menuType: 'wine'
  },

  // Khung / Frame (khung)
  {
    title: 'CHÀO MỪNG TỚI BỜM KITCHEN', theme: 'green',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    pricing: ['Mở cửa mỗi ngày'],
    courses: [
      { label: 'GIỜ PHỤC VỤ', items: [{ name: 'Trưa & Tối', desc: '10:30 - 23:00' }] }
    ],
    footer: '24 Nguyễn Thị Nghĩa, Quận 1, TP.HCM', lang: 'VN', sortOrder: 31, menuType: 'khung'
  },
  {
    title: 'KHÔNG GIAN SANG TRỌNG', theme: 'cream',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    pricing: ['Sức chứa: 80 khách'],
    courses: [
      {
        label: 'TIỆN ÍCH',
        items: [
          { name: 'Phòng VIP riêng tư', desc: 'Dành cho hội họp hoặc tiếp khách gia đình' },
          { name: 'Quầy Bar Hiện Đại', desc: 'Quầy pha chế rượu vang và cocktail' }
        ]
      }
    ],
    footer: 'Khuyến khích đặt bàn trước 24 giờ.', lang: 'VN', sortOrder: 32, menuType: 'khung'
  }
];

const menuPanelsEN = [
  { title: 'DESSERT', subtitle: 'Sweet endings', image: 'https://images.unsplash.com/photo-1551024506-0bccd281d307?w=900&q=80', theme: 'navy', isInfo: false, scrollTarget: 'dessert', lang: 'EN', sortOrder: 1 },
  { title: 'THE SPACE', subtitle: 'Kitchen & dining room', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80', theme: 'photo', isInfo: false, scrollTarget: '', lang: 'EN', sortOrder: 2 },
  { title: 'WINE & BAR', subtitle: 'Curated cellar', image: 'https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=900&q=80', theme: 'wine', isInfo: false, scrollTarget: 'wine', lang: 'EN', sortOrder: 3 },
  { title: 'BỜM KITCHEN & WINE BAR', subtitle: '24 Nguyen Thi Nghia, District 1, HCMC', image: '/logo.png', theme: 'info', isInfo: true, scrollTarget: '', lang: 'EN', sortOrder: 4 }
];

const menuPanelsVN = [
  { title: 'TRÁNG MIỆNG', subtitle: 'Kết thúc ngọt ngào', image: 'https://images.unsplash.com/photo-1551024506-0bccd281d307?w=900&q=80', theme: 'navy', isInfo: false, scrollTarget: 'dessert', lang: 'VN', sortOrder: 1 },
  { title: 'KHÔNG GIAN', subtitle: 'Bếp & phòng ăn', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80', theme: 'photo', isInfo: false, scrollTarget: '', lang: 'VN', sortOrder: 2 },
  { title: 'RƯỢU & BAR', subtitle: 'Hầm rượu tuyển chọn', image: 'https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=900&q=80', theme: 'wine', isInfo: false, scrollTarget: 'wine', lang: 'VN', sortOrder: 3 },
  { title: 'BỜM KITCHEN & WINE BAR', subtitle: '24 Nguyễn Thị Nghĩa, Quận 1, TP.HCM', image: '/logo.png', theme: 'info', isInfo: true, scrollTarget: '', lang: 'VN', sortOrder: 4 }
];

module.exports = {
  menuSets: [...menuSetsEN, ...menuSetsVN],
  menuPanels: [...menuPanelsEN, ...menuPanelsVN]
};
