export const menuSets = {
  EN: [
    {
      id: 'vegetarian',
      title: 'VEGETARIAN SET',
      theme: 'green',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      pricing: ['3-course: 299,000/pax', '4-course: 399,000/pax'],
      courses: [
        {
          label: 'STARTER',
          items: [
            { name: 'Fresh Spring Rolls', desc: 'Rice paper, herbs, peanut sauce' },
            { name: 'Lotus Root Salad', desc: 'Crispy lotus, sesame dressing' }
          ]
        },
        {
          label: 'MAIN',
          items: [
            { name: 'Tofu Clay Pot', desc: 'Mushroom, lemongrass, chili' },
            { name: 'Vegetable Fried Rice', desc: 'Seasonal greens, jasmine rice' }
          ]
        },
        {
          label: 'DESSERT',
          items: [
            { name: 'Coconut Pudding', desc: 'Palm sugar, pandan' },
            { name: 'Seasonal Fruit', desc: 'Chef\'s selection' }
          ]
        }
      ],
      footer: 'Prices are subject to 5% service charge & applicable tax.'
    },
    {
      id: 'love-story',
      title: 'THE LOVE STORY SET',
      theme: 'rose',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      pricing: ['Couple set: 1,199,000/2 pax'],
      courses: [
        {
          label: 'STARTER',
          items: [
            { name: 'Oysters & Caviar', desc: 'Champagne mignonette' },
            { name: 'Heart Beet Salad', desc: 'Goat cheese, honey balsamic' }
          ]
        },
        {
          label: 'MAIN',
          items: [
            { name: 'Wagyu Tenderloin', desc: 'Truffle mash, red wine jus' },
            { name: 'Lobster Thermidor', desc: 'Gratinated, herb butter' }
          ]
        },
        {
          label: 'DESSERT',
          items: [
            { name: 'Chocolate Lava', desc: 'Vanilla bean ice cream' },
            { name: 'Rose Panna Cotta', desc: 'Lychee, edible petals' }
          ]
        }
      ],
      footer: 'Perfect for anniversaries & special evenings.'
    },
    {
      id: 'phu-hao',
      title: 'PHÚ HẢO SET',
      theme: 'cream',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      pricing: ['Heritage set: 899,000/pax'],
      courses: [
        {
          label: 'STARTER',
          items: [
            { name: 'Hanoi Spring Rolls', desc: 'Crispy rolls, fresh herbs' },
            { name: 'Young Papaya Salad', desc: 'Shrimp chips, fish sauce lime' }
          ]
        },
        {
          label: 'MAIN',
          items: [
            { name: 'Braised Fish Village Style', desc: 'Turmeric, chili, rice noodles' },
            { name: 'Five-Spice Duck', desc: 'Caramel glaze, pickles' }
          ]
        },
        {
          label: 'DESSERT',
          items: [
            { name: 'Sticky Rice Balls', desc: 'Ginger syrup, mung bean' },
            { name: 'Jasmine Tea', desc: 'Tay Ho lotus scent' }
          ]
        }
      ],
      footer: 'Inspired by Northern Vietnamese home cooking.'
    },
    {
      id: 'signature',
      title: 'BỜM SIGNATURE SET',
      theme: 'gold',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      pricing: ['Chef\'s tasting: 1,499,000/pax', 'Wine pairing: +590,000/pax'],
      courses: [
        {
          label: 'STARTER',
          items: [
            { name: 'Fusion Tartare', desc: 'Beef, capers, rice cracker' },
            { name: 'Foie Gras Torchon', desc: 'Fig compote, brioche' }
          ]
        },
        {
          label: 'MAIN',
          items: [
            { name: 'Dry-Aged Ribeye', desc: 'Black pepper sauce, charred leek' },
            { name: 'Seafood Risotto', desc: 'Prawn, scallop, saffron' }
          ]
        },
        {
          label: 'DESSERT',
          items: [
            { name: 'Michelin Flan', desc: 'Caramel, coffee tuile' },
            { name: 'Petit Fours', desc: 'Chef\'s daily selection' }
          ]
        }
      ],
      footer: 'Michelin-recommended experience. Reserve 24h in advance.'
    }
  ],
  VN: [
    {
      id: 'vegetarian',
      title: 'SET CHAY',
      theme: 'green',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      pricing: ['3 món: 299.000/khách', '4 món: 399.000/khách'],
      courses: [
        {
          label: 'KHAI VỊ',
          items: [
            { name: 'Gỏi cuốn tươi', desc: 'Bánh tráng, rau thơm, tương đậu' },
            { name: 'Gỏi ngó sen', desc: 'Ngó sen giòn, mè rang' }
          ]
        },
        {
          label: 'MÓN CHÍNH',
          items: [
            { name: 'Đậu hũ kho tộ', desc: 'Nấm, sả, ớt' },
            { name: 'Cơm chiên rau củ', desc: 'Rau theo mùa, gạo thơm' }
          ]
        },
        {
          label: 'TRÁNG MIỆNG',
          items: [
            { name: 'Bánh flan dừa', desc: 'Đường thốt nốt, lá dứa' },
            { name: 'Trái cây theo mùa', desc: 'Bếp trưởng chọn lọc' }
          ]
        }
      ],
      footer: 'Giá đã bao gồm 5% phí phục vụ & thuế theo quy định.'
    },
    {
      id: 'love-story',
      title: 'SET LOVE STORY',
      theme: 'rose',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      pricing: ['Set đôi: 1.199.000/2 khách'],
      courses: [
        {
          label: 'KHAI VỊ',
          items: [
            { name: 'Hàu & trứng cá', desc: 'Sốt champagne' },
            { name: 'Salad củ dền', desc: 'Phô mai dê, mật ong' }
          ]
        },
        {
          label: 'MÓN CHÍNH',
          items: [
            { name: 'Thăn bò Wagyu', desc: 'Khoai nghiền truffle, sốt vang đỏ' },
            { name: 'Tôm hùm Thermidor', desc: 'Gratin, bơ thảo mộc' }
          ]
        },
        {
          label: 'TRÁNG MIỆNG',
          items: [
            { name: 'Bánh sô-cô-la tan chảy', desc: 'Kem vani' },
            { name: 'Panna cotta hoa hồng', desc: 'Vải, cánh hoa ăn được' }
          ]
        }
      ],
      footer: 'Dành cho kỷ niệm & buổi tối đặc biệt.'
    },
    {
      id: 'phu-hao',
      title: 'SET PHÚ HẢO',
      theme: 'cream',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      pricing: ['Set truyền thống: 899.000/khách'],
      courses: [
        {
          label: 'KHAI VỊ',
          items: [
            { name: 'Chả giò Hà Nội', desc: 'Giòn rụm, rau sống' },
            { name: 'Gỏi đu đủ', desc: 'Tôm khô, mắm me' }
          ]
        },
        {
          label: 'MÓN CHÍNH',
          items: [
            { name: 'Cá kho làng Vũ Đại', desc: 'Nghệ, ớt, bún' },
            { name: 'Vịt quay ngũ vị', desc: 'Caramel, dưa chua' }
          ]
        },
        {
          label: 'TRÁNG MIỆNG',
          items: [
            { name: 'Chè trôi nước', desc: 'Gừng, đậu xanh' },
            { name: 'Trà sen', desc: 'Ướp hương Tây Hồ' }
          ]
        }
      ],
      footer: 'Cảm hứng từ ẩm thực Bắc Bộ truyền thống.'
    },
    {
      id: 'signature',
      title: 'SET ĐẶC SẮC BỜM',
      theme: 'gold',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      pricing: ['Thực đơn degustation: 1.499.000/khách', 'Ghép rượu: +590.000/khách'],
      courses: [
        {
          label: 'KHAI VỊ',
          items: [
            { name: 'Tartare fusion', desc: 'Bò, caper, bánh gạo giòn' },
            { name: 'Gan vịt áp chảo', desc: 'Mứt sung, brioche' }
          ]
        },
        {
          label: 'MÓN CHÍNH',
          items: [
            { name: 'Ribeye ủ khô', desc: 'Sốt tiêu đen, tỏi tây nướng' },
            { name: 'Risotto hải sản', desc: 'Tôm, điệp, nghệ tây' }
          ]
        },
        {
          label: 'TRÁNG MIỆNG',
          items: [
            { name: 'Flan Michelin', desc: 'Caramel, bánh quy cà phê' },
            { name: 'Petit fours', desc: 'Lựa chọn trong ngày' }
          ]
        }
      ],
      footer: 'Trải nghiệm Michelin. Đặt trước 24 giờ.'
    }
  ]
};

export const alaCartePanels = {
  EN: [
    {
      id: 'dessert',
      title: 'DESSERT',
      subtitle: 'Sweet endings',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd281d307?w=900&q=80',
      theme: 'navy'
    },
    {
      id: 'interior',
      title: 'THE SPACE',
      subtitle: 'Kitchen & dining room',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80',
      theme: 'photo'
    },
    {
      id: 'wine',
      title: 'WINE & BAR',
      subtitle: 'Curated cellar',
      image: 'https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=900&q=80',
      theme: 'wine'
    },
    {
      id: 'info',
      title: 'BỜM KITCHEN & WINE BAR',
      subtitle: '24 Nguyen Thi Nghia, District 1, HCMC',
      image: '/logo.png',
      theme: 'info',
      isInfo: true
    }
  ],
  VN: [
    {
      id: 'dessert',
      title: 'TRÁNG MIỆNG',
      subtitle: 'Kết thúc ngọt ngào',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd281d307?w=900&q=80',
      theme: 'navy'
    },
    {
      id: 'interior',
      title: 'KHÔNG GIAN',
      subtitle: 'Bếp & phòng ăn',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80',
      theme: 'photo'
    },
    {
      id: 'wine',
      title: 'RƯỢU & BAR',
      subtitle: 'Hầm rượu tuyển chọn',
      image: 'https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=900&q=80',
      theme: 'wine'
    },
    {
      id: 'info',
      title: 'BỜM KITCHEN & WINE BAR',
      subtitle: '24 Nguyễn Thị Nghĩa, Quận 1, TP.HCM',
      image: '/logo.png',
      theme: 'info',
      isInfo: true
    }
  ]
};
