const MenuItem = require('../models/MenuItem');
const MenuCategory = require('../models/MenuCategory');
const Event = require('../models/Event');
const Press = require('../models/Press');
const MenuSet = require('../models/MenuSet');
const MenuPanel = require('../models/MenuPanel');
const { menuSets: seedMenuSets, menuPanels: seedMenuPanels } = require('../data/menuShowcaseSeed');

const seedDatabase = async () => {
  try {
    const menuCount = await MenuItem.countDocuments();
    const hasImageField = await MenuItem.exists({ image: { $ne: '' } });
    if (menuCount === 0 || !hasImageField) {
      await MenuItem.deleteMany({});
      console.log('🌱 Đang tạo dữ liệu mẫu cho Database...');
      
      const menuEN = [
        { name: "Shrimp & Pork Spring Rolls", price: 89000, description: "Shrimp, pork, vermicelli, herbs in rice paper", category: "Appetizers", lang: "EN", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80" },
        { name: "Hanoi Fried Spring Rolls", price: 79000, description: "Crispy fried rolls, served with fresh herbs", category: "Appetizers", lang: "EN", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80" },
        { name: "Banana Blossom Salad", price: 69000, description: "Banana blossom, pig ears, herbs", category: "Appetizers", lang: "EN", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
        { name: "Special Beef Pho", price: 129000, description: "Pho with rare beef, flank, brisket, tendon", category: "Main Courses", lang: "EN", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1ccd20?w=600&q=80" },
        { name: "Hanoi Bun Cha", price: 119000, description: "Vermicelli, grilled pork, spring rolls, herbs", category: "Main Courses", lang: "EN", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80" },
        { name: "Vu Dai Village Braised Fish", price: 199000, description: "Grass carp braised with turmeric and chili", category: "Main Courses", lang: "EN", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80" },
        { name: "Wagyu Beef Steak", price: 450000, description: "Japanese Wagyu Beef, black pepper sauce", category: "Western Cuisine", lang: "EN", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" },
        { name: "Lobster Pasta", price: 350000, description: "Spaghetti with lobster cream sauce", category: "Western Cuisine", lang: "EN", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80" },
        { name: "Sticky Rice Balls in Ginger Syrup", price: 49000, description: "Hot sticky rice balls, ginger", category: "Desserts", lang: "EN", image: "https://images.unsplash.com/photo-1551024506-0bccd281d307?w=600&q=80" },
        { name: "Caramel Flan", price: 39000, description: "Soft and smooth flan", category: "Desserts", lang: "EN", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80" },
        { name: "Lotus Tea", price: 45000, description: "Tay Ho lotus-scented tea", category: "Beverages", lang: "EN", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80" },
        { name: "Cabernet Sauvignon Wine", price: 280000, description: "Chilean red wine", category: "Beverages", lang: "EN", image: "https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=600&q=80" }
      ];

      const menuVN = [
        { name: "Gỏi cuốn tôm thịt", price: 89000, description: "Tôm, thịt, bún, rau sống cuốn bánh tráng", category: "Khai vị", lang: "VN", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80" },
        { name: "Chả giò Hà Nội", price: 79000, description: "Chả giò chiên giòn, ăn kèm rau sống", category: "Khai vị", lang: "VN", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80" },
        { name: "Nộm hoa chuối", price: 69000, description: "Hoa chuối, tai heo, rau thơm", category: "Khai vị", lang: "VN", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
        { name: "Phở bò đặc biệt", price: 129000, description: "Phở tái, nạm, gầu, bắp bò", category: "Món chính", lang: "VN", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1ccd20?w=600&q=80" },
        { name: "Bún chả Hà Nội", price: 119000, description: "Bún, chả nướng, nem, rau sống", category: "Món chính", lang: "VN", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80" },
        { name: "Cá kho làng Vũ Đại", price: 199000, description: "Cá trắm kho nghệ, ớt", category: "Món chính", lang: "VN", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80" },
        { name: "Wagyu Beef Steak", price: 450000, description: "Bò Wagyu Nhật, sốt tiêu đen", category: "Món Âu", lang: "VN", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" },
        { name: "Lobster Pasta", price: 350000, description: "Mì Ý sốt kem tôm hùm", category: "Món Âu", lang: "VN", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80" },
        { name: "Chè trôi nước", price: 49000, description: "Bánh trôi nước nóng, gừng", category: "Tráng miệng", lang: "VN", image: "https://images.unsplash.com/photo-1551024506-0bccd281d307?w=600&q=80" },
        { name: "Bánh flan caramen", price: 39000, description: "Bánh flan mềm mịn", category: "Tráng miệng", lang: "VN", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80" },
        { name: "Trà sen", price: 45000, description: "Trà ướp sen Tây Hồ", category: "Đồ uống", lang: "VN", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80" },
        { name: "Wine Cabernet Sauvignon", price: 280000, description: "Rượu vang đỏ Chile", category: "Đồ uống", lang: "VN", image: "https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=600&q=80" }
      ];

      const eventsData = [
        {
          title: "TALES & TASTES OF VIET NAM",
          date: "Special Event",
          description: "Tales & Tastes of Vietnam with the mission of bringing modern Vietnamese dishes, conveying culture and values that Bờm always appreciates and preserves through fairy tales such as independence, self-reliance and kindness of the Vietnamese nation.\nTaking Vietnamese folk tales as inspiration for dishes, fresh ingredients for each dish are key elements leading guests into the heroic history and culture treasury of Vietnamese people.",
          image: "http://localhost:5000/uploads/tales_vietnam.jpg",
          lang: "EN"
        },
        {
          title: "TALES & TASTES OF VIET NAM",
          date: "Sự kiện đặc biệt",
          description: "Tales & Tastes of Vietnam với sứ mệnh mang đến những món ăn Việt Nam hiện đại, truyền tải văn hóa và những giá trị mà Bờm luôn trân trọng và giữ gìn thông qua những truyện cổ tích như độc lập, tự cường và nhân ái của dân tộc Việt.\nLấy các câu chuyện dân gian Việt Nam làm cảm hứng cho món ăn, các nguyên liệu tươi ngon cho mỗi món là yếu tố quan trọng dẫn dắt khách vào kho tàng lịch sử và văn hoá hào hùng của người Việt.",
          image: "http://localhost:5000/uploads/tales_vietnam.jpg",
          lang: "VN"
        },
        {
          title: "Culture Night: Japan",
          date: "15/09/2023",
          description: "To bring interesting culinary combinations between Vietnam and the world, the meaningful event series Culture Night was launched for the first time on September 15, 2023.\n\nIn this first Culture Night, BỜM brought a special menu that fans of the land of cherry blossoms cannot miss! A harmonious symphony between Vietnamese and Japanese cuisine.\n\nThis collaboration of two head chefs from BỜM, MAGURO STUDIO / SHOKU created a unique playground for chefs to combine their most unique recipes and create an Asian fusion menu.",
          image: "http://localhost:5000/uploads/culture_japan.jpg",
          lang: "EN"
        },
        {
          title: "Culture Night Japan",
          date: "15/09/2023",
          description: "Nhằm mang lại những màn kết hợp ẩm thực thú vị giữa Việt Nam và thế giới, chuỗi sự kiện ý nghĩa Culture Night (Đêm Hội Văn Hoá) được ra mắt lần đầu tiên vào ngày 15/9/2023.\n\nTrong đêm Culture Night đầu tiên này, nhà BỜM đã mang đến thực đơn đặc biệt mà các tín đồ của ẩm thực xứ hoa anh đào không thể bỏ qua! Một bản giao hưởng hòa hòa giữ ẩm thực Việt và Nhật.\n\nSự hợp tác lần này của hai bếp trưởng từ nhà BỜM, MAGURO STUDIO / SHOKU đã tạo nên sân chơi độc nhất để các đầu bếp có thể kết hợp những công thức độc đáo nhất của mình và tạo nên một thực đơn mang đậm chất Asian fusion.",
          image: "http://localhost:5000/uploads/culture_japan.jpg",
          lang: "VN"
        },
        {
          title: "Culture Night: Malaysia",
          date: "Chapter II",
          description: "In Chapter II of the Culture Night event series, diners got to enjoy a unique menu combining the culinary essence of Malaysia and Vietnam. With the participation of the talented team from Wildflowers KL, Malaysia, this cultural night brought fresh and inspiring experiences to local and international guests.",
          image: "http://localhost:5000/uploads/culture_malaysia.jpg",
          lang: "EN"
        },
        {
          title: "Culture Night Malaysia",
          date: "Chương II",
          description: "Vào chương II của chuỗi sự kiện Culture Night (Đêm Hội Văn Hoá), thực khách được thưởng thức thực đơn độc đáo kết hợp tinh hoa ẩm thực Malaysia và Việt Nam. Với sự góp mặt của đội ngũ tài năng từ Wildflowers KL, Malaysia, đêm văn hóa này đã mang đến những trải nghiệm mới mẻ và đầy cảm hứng cho những vị khách trong và ngoài nước.",
          image: "http://localhost:5000/uploads/culture_malaysia.jpg",
          lang: "VN"
        },
        {
          title: "Culture Night: USA",
          date: "Chapter III",
          description: "Continuing the Culture Night event series to honor the diverse beauty of culture around the world, Bờm presented the Culture Night USA event featuring Eddie's.\n\nComing to this event of Bờm & Eddie's, diners experienced a unique harmony from two different culinary worlds of Asia and the West.\n\nThrough this special menu, both restaurants wanted to convey the diversity and flexibility of Vietnamese cuisine when combined with other cuisines of the world. Enjoy traditional Vietnamese dishes with a unique twist to bring the signature flavors of magnificent New York City.",
          image: "http://localhost:5000/uploads/culture_american.jpg",
          lang: "EN"
        },
        {
          title: "Culture Night american",
          date: "Chương III",
          description: "Tiếp nối chuỗi sự kiện Culture Night (Đêm Hội Văn Hoá) nhằm tôn vinh vẻ đẹp đa dạng của văn hoá trên khắp thế giới, Bờm và sự kiện Culture Night USA với sự góp mặt của Eddie’s.\n\nĐến với sự kiện này của Bờm & Eddie’s, thực khách được trải nghiệm sự hòa hợp độc đáo từ hai thế giới ẩm thực Á và Âu khác biệt.\n\nQua thực đơn đặc biệt lần này, hai nhà hàng mong muốn truyền tải sự đa dạng và tính uyển chuyển của ẩm thực Việt khi có thể kết hợp với các nền ẩm thực thế giới. Tận hưởng những món ăn truyền thống Việt với sự phá cách khác biệt để mang hương vị đặc trưng của thành phố New York tráng lệ.",
          image: "http://localhost:5000/uploads/culture_american.jpg",
          lang: "VN"
        }
      ];

      await MenuItem.insertMany([...menuEN, ...menuVN]);
      await Event.insertMany(eventsData);

      const categorySeed = [
        { name: 'Appetizers', lang: 'EN', sortOrder: 1 },
        { name: 'Main Courses', lang: 'EN', sortOrder: 2 },
        { name: 'Western Cuisine', lang: 'EN', sortOrder: 3 },
        { name: 'Desserts', lang: 'EN', sortOrder: 4 },
        { name: 'Beverages', lang: 'EN', sortOrder: 5 },
        { name: 'Khai vị', lang: 'VN', sortOrder: 1 },
        { name: 'Món chính', lang: 'VN', sortOrder: 2 },
        { name: 'Món Âu', lang: 'VN', sortOrder: 3 },
        { name: 'Tráng miệng', lang: 'VN', sortOrder: 4 },
        { name: 'Đồ uống', lang: 'VN', sortOrder: 5 }
      ];
      await MenuCategory.insertMany(categorySeed);

      console.log('✅ Đã tạo dữ liệu mẫu thành công!');
    }

    const pressCount = await Press.countDocuments();
    const hasPressDescription = await Press.exists({ description: { $ne: null } });
    if (pressCount === 0 || !hasPressDescription) {
      await Press.deleteMany({});
      const pressData = [
        { title: "Bờm Kitchen - Hanoi's New Culinary Destination", source: "Tuoi Tre News", description: "Bờm Kitchen & Wine Bar has been a shining beacon on Vietnam's F&B landscape since 2022. Read about our journey and culinary philosophy.", link: "https://example.com/article1", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", lang: "EN" },
        { title: "Top 10 Most Romantic Restaurants in the Capital", source: "Dep Magazine", description: "Discover the most romantic dining experiences in the capital. Bờm Kitchen is proud to be featured as a top romantic spot.", link: "https://example.com/article2", image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400", lang: "EN" },
        { title: "Bờm Kitchen Nominated for Michelin 2024", source: "VnExpress International", description: "A milestone journey as Bờm Kitchen receives its official nomination for the prestigious Michelin Guide 2024.", link: "https://example.com/article3", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400", lang: "EN" },
        { title: "Bờm Kitchen - Điểm đến ẩm thực mới của Hà Nội", source: "Báo Tuổi Trẻ", description: "Bờm Kitchen & Wine Bar đã trở thành một điểm sáng đầy tự hào trên bản đồ ẩm thực Việt Nam kể từ năm 2022. Cùng khám phá hành trình đầy cảm hứng của chúng tôi.", link: "https://example.com/article1", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", lang: "VN" },
        { title: "Top 10 nhà hàng lãng mạn nhất thủ đô", source: "Tạp chí Đẹp", description: "Khám phá những không gian ẩm thực lãng mạn và tinh tế nhất tại thủ đô. Bờm Kitchen vinh dự là một trong mười lựa chọn hàng đầu cho các cặp đôi.", link: "https://example.com/article2", image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400", lang: "VN" },
        { title: "Bờm Kitchen nhận đề cử Michelin 2024", source: "VnExpress", description: "Dấu mốc tự hào khi Bờm Kitchen chính thức được vinh danh và đề cử trong cẩm nang ẩm thực danh giá Michelin Guide 2024.", link: "https://example.com/article3", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400", lang: "VN" }
      ];
      await Press.insertMany(pressData);
      console.log('✅ Đã nạp lại dữ liệu Press mẫu với đầy đủ mô tả!');
    }

    const hasNewTypes = await MenuSet.exists({ menuType: { $in: ['alacarte', 'wine', 'khung'] } });
    if (!hasNewTypes) {
      await MenuSet.deleteMany({});
      await MenuSet.insertMany(seedMenuSets);
      console.log('✅ Đã nạp lại dữ liệu mẫu MenuSet với đầy đủ các loại (Set, Alacarte, Wine, Khung)');
    }

    const panelCount = await MenuPanel.countDocuments();
    if (panelCount === 0) {
      await MenuPanel.insertMany(seedMenuPanels);
      console.log('✅ Đã tạo panel A La Carte mẫu');
    }

    const categoryCount = await MenuCategory.countDocuments();
    if (categoryCount === 0 && menuCount > 0) {
      const items = await MenuItem.find();
      const seen = new Set();
      const categories = [];
      items.forEach((item, index) => {
        const key = `${item.lang}:${item.category}`;
        if (!seen.has(key)) {
          seen.add(key);
          categories.push({ name: item.category, lang: item.lang, sortOrder: index });
        }
      });
      if (categories.length > 0) {
        await MenuCategory.insertMany(categories);
        console.log('✅ Đã đồng bộ danh mục từ thực đơn hiện có');
      }
    }
  } catch (err) {
    console.error('❌ Lỗi tạo dữ liệu mẫu:', err);
  }
};

module.exports = seedDatabase;
