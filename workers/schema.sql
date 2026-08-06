-- 踏云行 CMS D1 数据库 schema + 种子数据

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS partners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'company',
  status TEXT DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  publish_time TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  brand_name TEXT,
  industry TEXT,
  industry_label TEXT,
  cover TEXT,
  image TEXT,
  summary TEXT,
  challenge TEXT,
  solution TEXT,
  result TEXT,
  testimonial TEXT,
  data_highlights TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS solutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  title TEXT NOT NULL,
  pain TEXT,
  strategy TEXT,
  actions TEXT,
  results TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now','localtime')),
  updated_at TEXT DEFAULT (datetime('now','localtime'))
);

-- 种子数据

-- 管理员 admin / admin123 (bcrypt hash)
INSERT INTO admins (username, password_hash, display_name) VALUES ('admin', '$2b$10$cigNh04Nmx12hlv2.DBJ5e37YIwVUlqx9nDPWJ9zEeGXL2POd9nci', '管理员');

-- 数据亮点
INSERT INTO stats (value, label, sort_order) VALUES ('6年+', '餐饮运营经验', 1);
INSERT INTO stats (value, label, sort_order) VALUES ('3000+', '本地生活达人', 2);
INSERT INTO stats (value, label, sort_order) VALUES ('24+', '合作品牌', 3);
INSERT INTO stats (value, label, sort_order) VALUES ('10+', '覆盖城市', 4);

-- 合作品牌
INSERT INTO partners (name, sort_order, is_visible) VALUES ('霸王茶姬', 1, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('茶百道', 2, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('茉莉奶白', 3, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('爷爷不泡茶', 4, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('柠季', 5, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('书亦烧仙草', 6, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('Tims', 7, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('Bonjour', 8, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('吾饮良品', 9, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('另茶', 10, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('东方墨兰', 11, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('一只酸奶牛', 12, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('仟吉', 13, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('老乡鸡', 14, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('周黑鸭', 15, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('乡村基', 16, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('霸碗盖码饭', 17, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('大米先生', 18, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('蓉李记', 19, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('冒大仙', 20, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('小六汤包', 21, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('享哆味', 22, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('派乐汉堡', 23, 1);
INSERT INTO partners (name, sort_order, is_visible) VALUES ('何师烧烤', 24, 1);

-- 文章
INSERT INTO articles (title, summary, content, category, status, publish_time) VALUES
('踏云行成为淘宝闪购数字化CRM生态服务商', '2024年下半年，踏云行正式成为淘宝闪购的数字化CRM生态服务商，主要负责淘宝闪购西南KA区域和TKA品牌部。', '<p>2024年下半年，踏云行（杭州）品牌营销策划有限公司正式成为淘宝闪购的数字化CRM生态服务商。</p><p>作为生态服务商，踏云行将主要负责淘宝闪购西南KA区域和TKA品牌部，依托直连平台的沟通渠道，为品牌提供数字化CRM系统搭建、会员运营、精准营销等全链路服务。</p><p>此次合作标志着踏云行在餐饮数字化运营领域的专业能力获得平台级认可。</p>', 'company', 'published', '2024-09-01');

INSERT INTO articles (title, summary, content, category, status, publish_time) VALUES
('踏云行数字化团队：兼具系统思维与实战经验的操盘天团', '踏云行数字化团队兼具系统思维与实战经验，高度专注餐饮高频复购赛道，懂系统更懂品类与消费者。', '<p>踏云行数字化团队是一支兼具"系统思维"与"实战经验"的操盘团队。</p><p>团队高度专注于餐饮等高频复购赛道，不仅懂数字化系统，更懂品类逻辑与背后的消费者行为，能够为品牌提供从战略到落地的全流程运营支持。</p>', 'company', 'published', '2024-06-18');

INSERT INTO articles (title, summary, content, category, status, publish_time) VALUES
('深耕餐饮6年+，踏云行全国本地生活达人突破3000+', '凭借6年+餐饮运营经验，踏云行已在全国积累本地生活达人3000+，覆盖杭州、上海、成都等10+核心城市。', '<p>作为一家专业深耕餐饮的品牌策划运营公司，踏云行拥有6年+运营经验。</p><p>目前，踏云行在全国拥有本地生活达人3000+，可覆盖杭州、上海、南京、苏州、西安、成都、重庆、广州、长沙、武汉等10+核心城市，为品牌全域引流与内容种草提供坚实的资源支撑。</p>', 'insight', 'published', '2024-03-10');

-- 案例
INSERT INTO cases (title, brand_name, industry, industry_label, cover, image, summary, challenge, solution, result, testimonial, data_highlights, sort_order, status) VALUES
('何师烧烤——闪购流量高效承接与全链路会员增长', '何师烧烤', 'local', '正餐/烧烤', 'linear-gradient(135deg,#f97316 0%,#c2440c 100%)', '/assets/case-heshi.png', '针对淘宝闪购流量持续走高但品牌自主拉新及活跃率低的问题，通过"找对人、给供给、选渠道"策略，实现会员净G与拉新的大幅增长。', '淘宝闪购流量持续走高，但品牌自主拉新及活跃率低，每月有push需求，缺乏爆火私域菜品。大量公域流量涌入却承接不力，转化低、入会少。', '找对人、给供给、选渠道：锁定R人群（高潜拉新）与UST人群（沉默会员），公域超抢手套餐联合私域特价菜承接流量，周五高峰时段push专属券精准触达。', '整体会员净G增长39.17%（5月45.54W→9月63.38W），拉新人数提升54.7%（3413人→5282人），会员下单人数提升70.0%（4660人→7922人）。', '踏云行帮我们真正把闪购的公域流量接住了，会员净G和拉新的增长都远超预期。', '[{"label":"会员净G增长","value":"+39.17%"},{"label":"拉新人数提升","value":"+54.7%"},{"label":"会员下单提升","value":"+70.0%"}]', 1, 'published');

INSERT INTO cases (title, brand_name, industry, industry_label, cover, image, summary, challenge, solution, result, testimonial, data_highlights, sort_order, status) VALUES
('某茶饮品牌——立秋日峰值运营，数字化助力销售峰值', '茶饮品牌', 'tea', '茶饮', 'linear-gradient(135deg,#338eff 0%,#1457e1 100%)', '/assets/case-liquan.png', '以"立秋第一杯奶茶"为契机，通过数字化工具识别高潜客群、优化公私域投放策略，助力品牌立秋日订单量创历史新高。', '立秋日是奶茶全年最关键的销售日之一，品牌需要在大促窗口既拉新客、又激活在册未购老客，对数字化触达与转化能力要求极高。', '私域投放锁定门店福利群高复购人群，外域触达按14/30天会员与非会员分层差异化投放；30天会员ROI高达25，配合预售与多阶段供给设计制造消费峰值。', '立秋日订单量创历史新高，同比+15%；数字化触达用户贡献+8%；U-S/T转化率分别提升+21%和+30%；私域销售超40万元，新增会员5000+。', '数字化让节点营销从"碰运气"变成了"可设计"，立秋日的峰值就是最好证明。', '[{"label":"立秋日订单同比","value":"+15%"},{"label":"私域销售峰值","value":"40万+"},{"label":"新增会员","value":"5000+"}]', 2, 'published');

INSERT INTO cases (title, brand_name, industry, industry_label, cover, image, summary, challenge, solution, result, testimonial, data_highlights, sort_order, status) VALUES
('某茶饮品牌——公私域联动，提升高客单用户占比', '茶饮品牌', 'tea', '茶饮', 'linear-gradient(135deg,#10b981 0%,#059669 100%)', '', '通过公私域融合、落地高价值会员分层运营，有效提升品牌高客单用户占比与ARPU，显著领先品类平均水平。', '品牌希望提升高客单用户占比，但缺乏精细化的会员分层运营手段，高价值用户的供给与触达都不够精准。', '公私域融合落地高价值会员分层运营：会员权益（会员特价菜等）匹配高客单货品双杯套餐，高等级会员周期性领券，借助88VIP扩充高客单用户。', '高客单用户占比达52.8%，显著领先品类的37.8%；ARPU增幅达15.6%，远超品类的5.0%。', '分层运营让我们的高价值用户被真正看见和经营，客单结构明显改善。', '[{"label":"高客单用户占比","value":"52.8%"},{"label":"品类平均","value":"37.8%"},{"label":"ARPU增幅","value":"+15.6%"}]', 3, 'published');

-- 解决方案
INSERT INTO solutions (category, category_label, title, pain, strategy, actions, results, sort_order, is_visible) VALUES
('dessert', '甜品饮品', '甜品饮品数字化增长方案', '甜品饮品赛道竞争白热化，获客成本攀升、会员留存难、产品同质化严重，品牌陷入价格战泥潭。', '以会员资产为核心，通过TRUST用户分层运营 + 爆品策略 + 高频营销节奏，构建差异化增长飞轮。', '["搭建会员体系，开卡礼拉新转化","基于用户分层的精准发券触达","立秋日等节点峰值运营","公私域联动提升高客单占比"]', '[{"label":"立秋日订单同比","value":"+15%"},{"label":"高客单用户占比","value":"52.8%"},{"label":"私域销售峰值","value":"40万+"}]', 1, 1);

INSERT INTO solutions (category, category_label, title, pain, strategy, actions, results, sort_order, is_visible) VALUES
('formal', '正餐', '正餐品牌会员经营方案', '正餐消费频次低、决策重，顾客到店即走、难以触达，品牌与顾客之间缺乏持续连接。', '以"会员 + 内容"双轮驱动，通过到店扫码入会、储值锁客、节点唤醒，把一次性顾客变成终身顾客。', '["全渠道引流沉淀会员资产","沉睡会员精准唤醒召回","招牌菜内容种草拉动到店","周五高峰时段精准发券"]', '[{"label":"会员净G增长","value":"+39.17%"},{"label":"会员下单提升","value":"+70.0%"},{"label":"拉新人数提升","value":"+54.7%"}]', 2, 1);

INSERT INTO solutions (category, category_label, title, pain, strategy, actions, results, sort_order, is_visible) VALUES
('snack', '小吃夜宵', '小吃夜宵流量转化方案', '小吃夜宵品类客单低、利润薄，依赖平台流量，缺乏自有用户池，经营波动大。', '以"提效率、建私域"为核心，通过套餐优化提升客单，通过会员体系沉淀自有流量，降低平台依赖。', '["闪购流量高效承接与转化","公域超抢手+私域特价菜组合","R人群与UST人群差异化触达","会员储值与权益锁客"]', '[{"label":"会员净G增长","value":"+39.17%"},{"label":"拉新人数提升","value":"+54.7%"},{"label":"会员下单提升","value":"+70.0%"}]', 3, 1);

INSERT INTO solutions (category, category_label, title, pain, strategy, actions, results, sort_order, is_visible) VALUES
('global', '全球美食', '全球美食品牌本地化方案', '国际餐饮品牌进入中国市场，面临本地化运营、会员体系搭建、多渠道整合等挑战。', '结合品牌全球标准与中国本地消费习惯，搭建数字化运营体系，实现品牌本土化落地。', '["本地化会员体系搭建","多渠道整合营销","数据驱动的精准运营","品牌本土化内容策略"]', '[{"label":"会员转化率","value":"+45%"},{"label":"复购率提升","value":"+32%"},{"label":"客单价增长","value":"+18%"}]', 4, 1);

INSERT INTO solutions (category, category_label, title, pain, strategy, actions, results, sort_order, is_visible) VALUES
('fastfood', '中式快餐', '中式快餐效率提升方案', '快餐品牌门店多、客单低、利润薄，依赖平台流量，缺乏自有用户池，经营波动大。', '以"提效率、建私域"为核心，通过套餐优化提升客单，通过会员体系沉淀自有流量，降低平台依赖。', '["闪购流量高效承接与转化","公域超抢手+私域特价菜组合","R人群与UST人群差异化触达","会员储值与权益锁客"]', '[{"label":"会员净G增长","value":"+39.17%"},{"label":"拉新人数提升","value":"+54.7%"},{"label":"会员下单提升","value":"+70.0%"}]', 5, 1);
