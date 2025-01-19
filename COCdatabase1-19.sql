/*
 Navicat Premium Data Transfer

 Source Server         : myDatabase
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40-0ubuntu0.22.04.1)
 Source Host           : localhost:3307
 Source Schema         : characters

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40-0ubuntu0.22.04.1)
 File Encoding         : 65001

 Date: 19/01/2025 14:18:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Attributes
-- ----------------------------
DROP TABLE IF EXISTS `Attributes`;
CREATE TABLE `Attributes`  (
  `character_id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `strength` int NULL DEFAULT NULL,
  `constitution` int NULL DEFAULT NULL,
  `size` int NULL DEFAULT NULL,
  `dexterity` int NULL DEFAULT NULL,
  `appearance` int NULL DEFAULT NULL,
  `intelligence` int NULL DEFAULT NULL,
  `power` int NULL DEFAULT NULL,
  `education` int NULL DEFAULT NULL,
  `luck` int NULL DEFAULT NULL,
  `credit_rating` int NULL DEFAULT NULL,
  UNIQUE INDEX `unique_character`(`character_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Attributes
-- ----------------------------
INSERT INTO `Attributes` VALUES ('ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7', 40, 50, 45, 70, 60, 80, 50, 85, 50, 70);
INSERT INTO `Attributes` VALUES ('99', 40, 70, 70, 70, 50, 75, 40, 55, 55, NULL);
INSERT INTO `Attributes` VALUES ('563', 65, 65, 55, 25, 55, 70, 40, 65, 70, NULL);
INSERT INTO `Attributes` VALUES ('2ce488b418224f9354ce70d4d77c9a8360fa142018ab9a8c68d82ba7dc999b7e', 70, 50, 50, 35, 75, 50, 75, 52, 80, 35);
INSERT INTO `Attributes` VALUES ('250de97665cf801aabcc2f17fd497004c6066d1ddbf451c65af4e507d0584cff', 30, 55, 55, 60, 30, 90, 45, 85, 60, 50);

-- ----------------------------
-- Table structure for Backgrounds
-- ----------------------------
DROP TABLE IF EXISTS `Backgrounds`;
CREATE TABLE `Backgrounds`  (
  `character_id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `beliefs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `beliefs_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `important_people` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `important_people_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `reasons` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `reasons_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `places` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `places_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `possessions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `possessions_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `traits` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `traits_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `keylink` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `keylink_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  UNIQUE INDEX `unique_character`(`character_id` ASC) USING BTREE,
  CONSTRAINT `Backgrounds_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Backgrounds
-- ----------------------------
INSERT INTO `Backgrounds` VALUES ('ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7', '科学万能！（例如，进化论，低温学，太空探索）', '科学揭示世界的真相', '祖辈（例如，祖母，祖父）', '她爷爷韦伯医生', '你崇拜他们（例如，他们的名声，他们的魅力，他们的职业）', NULL, '你的故乡（例如，乡村，小镇，大城市）', '老家博尔顿承载的童年时光', '重要之人赠予的物品（例如，戒指，日志，地图）', '一串带着银质挂坠的古老项链（她爷爷的礼物）', '忠心耿耿（例如，负担朋友的责任，从未违背誓言，为信念而死）', '忠诚', 'possessions', '她敬爱的爷爷送给她的礼物');
INSERT INTO `Backgrounds` VALUES ('2ce488b418224f9354ce70d4d77c9a8360fa142018ab9a8c68d82ba7dc999b7e', '科学万能！（例如，进化论，低温学，太空探索）', '可知论', '游戏中的另一位NPC（请咨询守秘人获取详细信息）', '韦伯医生', '他们教会了你一些东西（例如，一个技能，如何去爱，如何成为一个男子汉/女人）', '调查员之路的引路人', '你最爱的学府（例如，中学，大学）', '我在阿卡姆大学的图书馆读到很多神秘学的知识', '重要之人赠予的物品（例如，戒指，日志，地图）', '韦伯医生给我的一枚硬币', '雄心勃勃（例如，梦想远大，目标是成为老板，渴求一切）', '希望能揭开神秘学的面纱，用科学解释神秘', 'reasons', '调查员之路的引路人');

-- ----------------------------
-- Table structure for CharacterEquipment
-- ----------------------------
DROP TABLE IF EXISTS `CharacterEquipment`;
CREATE TABLE `CharacterEquipment`  (
  `character_id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `equipment_id` int NULL DEFAULT NULL,
  `on_bag` tinyint(1) NULL DEFAULT NULL,
  `quantity` int NULL DEFAULT 1,
  INDEX `character_id`(`character_id` ASC) USING BTREE,
  INDEX `equipment_id`(`equipment_id` ASC) USING BTREE,
  CONSTRAINT `CharacterEquipment_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `CharacterEquipment_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `Equipment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'This table represents the relationship between characters and their equipment. Characters can have multiple pieces of the same equipment.' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of CharacterEquipment
-- ----------------------------
INSERT INTO `CharacterEquipment` VALUES ('ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7', NULL, NULL, 1);

-- ----------------------------
-- Table structure for Characters
-- ----------------------------
DROP TABLE IF EXISTS `Characters`;
CREATE TABLE `Characters`  (
  `id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `gender` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `residence` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `birthplace` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `profession_id` int NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `if_npc` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `profession_id`(`profession_id` ASC) USING BTREE,
  CONSTRAINT `Characters_ibfk_1` FOREIGN KEY (`profession_id`) REFERENCES `Professions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Characters
-- ----------------------------
INSERT INTO `Characters` VALUES ('0000000000000000000000000000000000000000000000000000000000000000', '新调查员', NULL, NULL, NULL, 14, NULL, NULL);
INSERT INTO `Characters` VALUES ('250de97665cf801aabcc2f17fd497004c6066d1ddbf451c65af4e507d0584cff', 'NewMan', NULL, NULL, NULL, 9, NULL, NULL);
INSERT INTO `Characters` VALUES ('2ce488b418224f9354ce70d4d77c9a8360fa142018ab9a8c68d82ba7dc999b7e', '安达', '男', '阿卡姆', '阿卡姆', 7, '安达，一个土生土长的阿卡姆人，怀揣着对科学的执念和对未知的渴求，在这座城镇的阴霾与秘密中成长。阿卡姆大学的图书馆是他灵魂的庇护所，书架间堆积着的卷册不仅是知识的殿堂，更是一扇扇窗，透视着他内心深处的那股幻想与对现实的追求。躲在昏黄灯光下，手指轻抚过泛黄的页角，他曾在此遇见那些形而上学的思想，迷失在无尽的神秘与知识的海洋中。\n\n安达的信仰是一种近乎固执的可知论，笃信科学的万能，认为一切都可以被数据、实验和法则解释。进化论、低温学、太空探索，这些理论是他思考的基石，让他对宇宙与生命的本质展开了无休止的探索。恰如他在韦伯医生的指导下，逐渐走向调查员的道路，安达的内心充满了对未知的敬畏与好奇，更包裹着一种想要用科学揭示一切的强烈渴望。\n\n在这条探索的旅途中，安达始终铭记着那些重要的人。他的导师韦伯医生不仅教会了他科学的方法论，更在他心中播下了探究世界真正面貌的种子。医生送给他的那枚硬币，成为了安达人生中的重要符号，象征着指南与启蒙，提醒着他更高的目标和更广阔的理想。在这个充满混沌与狂热的世界中，他不断努力，试图将神秘学与科学相结合，力求以理性之光破解隐藏在黑暗中的秘密。\n\n安达的性格如同他所追求的知识般雄心勃勃，怀揣着远大的梦想，企图揭开神秘的面纱。在一旁徘徊的阴影中，他似乎意识到，每一个秘密都意味着一种变革，而他自己正是这场变革的探路者。然而，伴随这份雄心，安达的内心深处也潜藏着一丝不安，对科学能否解释一切的怀疑，和对未知是否真有界限的惶恐。在这片发生着诡异变化的阿卡姆土地上，他将如何面对即将揭开的秘密，成为了他心中始终悬而未决的一道难题。', 0);
INSERT INTO `Characters` VALUES ('563e5fab55f5d99ecdc5545690f272e73b58bb65def61f1d5c6a4c79ea492e69', 'NewMan', NULL, NULL, NULL, 5, NULL, NULL);
INSERT INTO `Characters` VALUES ('99bf5416372392e4164b33195e2f2fd2a2eb7962c6800c673cd9fd8d7fe13976', 'NewMan', NULL, NULL, NULL, 3, NULL, NULL);
INSERT INTO `Characters` VALUES ('ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7', '艾米莉亚·韦伯', NULL, NULL, NULL, NULL, '艾米利亚是个20出头，看起来又瘦又憔悴但是却不失魅力的女人，她有着深黑的头发和醒目的接近无色的浅灰色迷人大眼睛。她穿过丛林之后她头发凌乱、浑身淤痕并且严重的着了凉，身上的衣物也被挂得破破烂烂，整个人处于惊吓过度状态。她不会故意撒谎或者掩饰什么，除非被认为是“疯了”。她不太愿意谈起她的童年创伤：她15岁时由于双亲去世，曾经在波士顿的社会少女疗养院中接受过一段时间的严重情绪失控以及黑夜恐惧症治疗。她和她祖父在一起生活了7个多月，祖父对艾米利亚非常的好。\r\n\r\n{{只有在细心的护理和温暖的环境下她的情况才能得到好转。}}\r\n\r\n惊吓过度状态：\r\n\r\n由于最近收到的惊吓，她将处于一种茫然、紧张并且呆滞的状态中，只有被准确的提问时她才会做出回应（成功的魅力或者说服将会有一定的帮助）。\r\n\r\n好转状态：\r\n\r\n当她恢复过来的时候，在谈话的过程中她将显示出受过良好的国际性教育的特质，以及一口中产阶级特质的浓厚博尔顿口音。\r\n\r\n{{她对医生的秘密一无所知，只觉得那是个“令人毛骨悚然的骨灰盒”。如果被问及，她会回忆起在博尔顿老家的童年时光，尽管那之后是噩梦一般的经历。这是对她爷爷无比重要的一种传家宝，而且幼小的她曾经被告知过千万别去碰这个匣子，她很听话的照办了。}}', 1);
INSERT INTO `Characters` VALUES ('b388656b342f4254a34535090f24eb7e4772035bd75f6e0945fb9abee609ccd6', 'NewMan', NULL, NULL, NULL, 2, NULL, NULL);
INSERT INTO `Characters` VALUES ('ee491f447b5f83b327c89339d8b7ee3da529704d2ee674c828dd348b19b08c94', 'NewMan', NULL, NULL, NULL, 6, NULL, NULL);

-- ----------------------------
-- Table structure for DerivedAttributes
-- ----------------------------
DROP TABLE IF EXISTS `DerivedAttributes`;
CREATE TABLE `DerivedAttributes`  (
  `character_id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sanity` int NULL DEFAULT NULL,
  `magicPoints` int NULL DEFAULT NULL,
  `interestPoints` int NULL DEFAULT NULL,
  `hitPoints` int NULL DEFAULT NULL,
  `moveRate` int NULL DEFAULT NULL,
  `damageBonus` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `build` int NULL DEFAULT NULL,
  `professionalPoints` int NULL DEFAULT NULL,
  UNIQUE INDEX `unique_character`(`character_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of DerivedAttributes
-- ----------------------------
INSERT INTO `DerivedAttributes` VALUES ('ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7', 50, 0, 0, 9, 8, '0', 0, 0);

-- ----------------------------
-- Table structure for Equipment
-- ----------------------------
DROP TABLE IF EXISTS `Equipment`;
CREATE TABLE `Equipment`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `skill` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `price` int NULL DEFAULT NULL,
  `damage` int NULL DEFAULT NULL,
  `ammo_capacity` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'This table stores information about equipment, including name, skill, price, damage, and ammo capacity.' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Equipment
-- ----------------------------

-- ----------------------------
-- Table structure for Events
-- ----------------------------
DROP TABLE IF EXISTS `Events`;
CREATE TABLE `Events`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `rate` int NULL DEFAULT NULL,
  `character_ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `map_ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `if_unique` tinyint(1) NULL DEFAULT NULL,
  `afterevents` int NULL DEFAULT NULL,
  `beforeevents` int NULL DEFAULT NULL,
  `result` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `if_happened` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `afterevents`(`afterevents` ASC) USING BTREE,
  INDEX `beforeevents`(`beforeevents` ASC) USING BTREE,
  CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`afterevents`) REFERENCES `Events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Events_ibfk_2` FOREIGN KEY (`beforeevents`) REFERENCES `Events` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Events
-- ----------------------------
INSERT INTO `Events` VALUES (1, '调查员注意到了艾米莉亚脖子上戴着一个样式古老的金币式挂坠，艾米莉亚似乎对这个挂坠视若珍宝。', 50, 'ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7', '1', 1, 2, NULL, '{\r\n    \"testRequired\": 25,\r\n    \"talkRequired\": 0,\r\n    \"talkToWhom\": ,\r\n    \"fightRequired\": 0,\r\n    \"successEffect\": \"调查员发现这些符号是阿克洛语字符。Aklo语不是一种日常语言，很可能是一种祭司阶级在祭典上专用的皇家语言。\",\r\n    \"failEffect\": \"看着这些符号，调查员感到一阵头晕，仿佛有一种无形的力量在干扰他的思维。\",\r\n    \"additionalEffect\": \"\"\r\n    \"successModify\":23,\r\n    \"successModifyNum\":1,\r\n    \"failModify\":23,\r\n    \"failModifyNum\":-1,\r\n}', 0);
INSERT INTO `Events` VALUES (2, 'sdfaw ', 50, 'ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c4', '1', 1, NULL, NULL, 'saef ', 0);

-- ----------------------------
-- Table structure for Maps
-- ----------------------------
DROP TABLE IF EXISTS `Maps`;
CREATE TABLE `Maps`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_entry_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `map_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `items` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `accessible_locations` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `event_ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `character_ids` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Maps
-- ----------------------------
INSERT INTO `Maps` VALUES (1, '尽管调查员向北努力的逃离这场暴雨的侵袭，风暴最终还是追上了调查员，并且在风暴中漆黑而不断被闪电撕裂的夜幕降临了。大雨磅礴的路面上调查员只能如同爬行般的缓速挪动，这样穿过黑暗的前灯才能保证调查员没有迷路。唯一可以肯定的就是，目前正在身后向调查员逼近的恶劣气候，只将会比调查员在经历的更加糟糕。本应善乏可陈的旅程也因此而变得危险而前途叵测。\r\n       有东西毫无预示的挡在了调查员的面前，这是一个如同凭空冒出来般的苍白身影。为避免撞上去而紧急的刹车和扭转车头的时间，调查员刚好看清了这个身影是一个惊恐的女人——她大大的睁着眼睛并发出凄厉的惨叫声：“啊— —！” {进行[驾驶]检定，如果驾驶检定成功：调查员完美避开了艾米莉亚，但是车子撞到路边的大树上。如果驾驶检定失败：调查员勉强避开了艾米莉亚，艾米利亚受到擦伤。}{注意：艾米利亚·韦伯不可以在目前死亡。}\r\n\r\n        碰撞事故后，调查员的车子会彻底熄火，无论怎样都无法发动。附近的路牌显示直走一英里有个带咖啡馆的加油站，也许可以去避难。{引导调查员前往加油站}', '在风暴肆虐的黑夜中，调查员回到了园林大道入口处——阿卡姆郊外一条孤寂的名为园林大道的道路上。强烈的风暴让任何人无法离开此地，甚至直到黎明到来。调查员逐步被卷进一系列无论对精神还是肉体都是严峻考验的噩梦般的超自然事件中。虽然调查员可以选择查明发生这一切的原因和理由，但他的终极目标是活过这一夜。\r\n\r\n        园林大道入口处附近的森林曾经都是一片苹果园，但是目前已经被荒废，而且很大程度上充斥满了榉木和常春藤这样的外来物种。张牙舞爪的树林在这样风雨交加的夜色中，如同一场阴暗的噩梦般可怕。刺骨的寒风在耳边呼啸，这样恶劣的天气下呆在户外绝不是个好主意。', NULL, '2,3', '1,2', 'ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7');

-- ----------------------------
-- Table structure for Professions
-- ----------------------------
DROP TABLE IF EXISTS `Professions`;
CREATE TABLE `Professions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Professions
-- ----------------------------
INSERT INTO `Professions` VALUES (1, '古董收藏家', '我是一位专注于历史文物研究的专家。凭借深厚的历史知识和艺术鉴赏能力,我能准确评估和分析各类古董文物的价值与历史意义。');
INSERT INTO `Professions` VALUES (2, '艺术家', '我是一位追求艺术完美的创作者。我灵巧的双手能将灵感转化为触动人心的艺术品,同时也善于通过作品与人交流。');
INSERT INTO `Professions` VALUES (3, '神父', '我是一位虔诚的信仰传播者。通过对神秘学的研究、出色的交际能力和对人性的深刻理解,我引导着信徒寻找精神慰藉。');
INSERT INTO `Professions` VALUES (4, '罪犯', '我是游走在法律边缘的暗影人物。精通巧手技巧和各类武器,在危险时刻总能依靠灵活的身手脱身。');
INSERT INTO `Professions` VALUES (5, '医生', '我是一位专业的医学工作者。依靠扎实的医学知识、灵巧的手术技能和科学的思维方式,我致力于治愈病患、拯救生命。');
INSERT INTO `Professions` VALUES (6, '工程师', '我是一位精通技术的问题解决者。凭借对机械、科学和电子领域的深入理解,我能设计、建造和修复各种复杂系统。');
INSERT INTO `Professions` VALUES (7, '艺人', '我是一位舞台上的表演大师。通过对人性的洞察和精湛的艺术表现力,我能在各种场合赢得观众的喝彩。');
INSERT INTO `Professions` VALUES (8, '农场主', '我是一位经验丰富的农场经营者。精通农机驾驶和维护,善于观察天气变化,也懂得与人打交道。必要时,我也能用枪保护自己的财产。');
INSERT INTO `Professions` VALUES (9, '黑客', '我是一位数字世界的探索者。通过精湛的电子技术和敏锐的观察力,我能深入任何数字系统的核心。');
INSERT INTO `Professions` VALUES (10, '记者', '我是一位追寻真相的新闻工作者。凭借出色的交际能力、对人性的洞察和细致的调查技巧,我致力于还原每一个事件的真相。');
INSERT INTO `Professions` VALUES (11, '律师', '我是一位精通法律的辩护者。通过丰富的法律知识、出色的交际能力和对人性的理解,我为当事人争取最大的法律权益。');
INSERT INTO `Professions` VALUES (12, '图书馆管理员', '我是一位知识的守护者和引路人。精通图书分类和检索,对科学和神秘学都有深入研究,能帮助人们找到他们需要的任何信息。');
INSERT INTO `Professions` VALUES (13, '军官', '我是一位经验丰富的军事指挥官。精通枪械使用,善于领导和激励部下,能准确把握战场局势和人员心理。');
INSERT INTO `Professions` VALUES (14, '邪教徒', '我是一位狂热的信仰追随者。深谙神秘学知识,善于洞察和影响他人心理,在危险时刻总能化险为夷。');
INSERT INTO `Professions` VALUES (15, '警探', '我是一位专业的刑事侦查员。凭借敏锐的洞察力、对犯罪心理的理解和丰富的办案经验,我能破解各种复杂案件。');
INSERT INTO `Professions` VALUES (16, '警察', '我是一位尽职的治安维护者。精通驾驶和各类武器使用,在紧急情况下能迅速反应并处理各种突发事件。');
INSERT INTO `Professions` VALUES (17, '私家侦探', '我是一位独立的真相探寻者。通过细致的观察、隐秘的跟踪和巧妙的交谈,我能发现并揭示各种隐藏的秘密。');
INSERT INTO `Professions` VALUES (18, '教授', '我是一位博学多才的学者。精通文献检索,深谙教育心理学,在我的专业领域具有独到的见解和研究成果。');
INSERT INTO `Professions` VALUES (19, '士兵', '我是一位训练有素的战士。精通各种战斗技能,面对危险时能迅速反应并作出正确判断。');
INSERT INTO `Professions` VALUES (20, '部落成员', '我是一位与自然紧密相连的部落成员。精通古老的神秘仪式,具备敏锐的观察力和出色的生存技能。');

-- ----------------------------
-- Table structure for Skills
-- ----------------------------
DROP TABLE IF EXISTS `Skills`;
CREATE TABLE `Skills`  (
  `character_id` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `Fighting` int NULL DEFAULT NULL,
  `Firearms` int NULL DEFAULT NULL,
  `Dodge` int NULL DEFAULT NULL,
  `Mechanics` int NULL DEFAULT NULL,
  `Drive` int NULL DEFAULT NULL,
  `Stealth` int NULL DEFAULT NULL,
  `Investigate` int NULL DEFAULT NULL,
  `Sleight_of_Hand` int NULL DEFAULT NULL,
  `Electronics` int NULL DEFAULT NULL,
  `History` int NULL DEFAULT NULL,
  `Science` int NULL DEFAULT NULL,
  `Medicine` int NULL DEFAULT NULL,
  `Occult` int NULL DEFAULT NULL,
  `Library_Use` int NULL DEFAULT NULL,
  `Art` int NULL DEFAULT NULL,
  `Persuade` int NULL DEFAULT NULL,
  `Psychology` int NULL DEFAULT NULL,
  UNIQUE INDEX `unique_character`(`character_id` ASC) USING BTREE,
  CONSTRAINT `Skills_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Skills
-- ----------------------------
INSERT INTO `Skills` VALUES ('ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7', 25, 20, 35, 10, 20, 40, 35, 10, 10, 40, 25, 50, 5, 20, 5, 45, 20);
INSERT INTO `Skills` VALUES ('2ce488b418224f9354ce70d4d77c9a8360fa142018ab9a8c68d82ba7dc999b7e', 35, 20, 20, 10, 20, 20, 25, 10, 10, 10, 15, 5, 90, 0, 50, 90, 90);
INSERT INTO `Skills` VALUES ('250de97665cf801aabcc2f17fd497004c6066d1ddbf451c65af4e507d0584cff', 25, 90, 20, 10, 90, 20, 30, 50, 15, 10, 10, 5, 5, 0, 5, 15, 10);

SET FOREIGN_KEY_CHECKS = 1;
