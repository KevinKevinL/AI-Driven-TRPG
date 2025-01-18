create database characters;
use characters;

CREATE TABLE `Characters` (
  `id` CHAR(64) PRIMARY KEY,
  `name` TEXT,
  `gender` TEXT,
  `residence` TEXT,
  `birthplace` TEXT,
  `profession_id` INTEGER,
  `description` TEXT,
  `if_npc` TINYINT(1)
);

CREATE TABLE `Attributes` (
  `character_id` CHAR(64),
  `strength` INTEGER,
  `constitution` INTEGER,
  `size` INTEGER,
  `dexterity` INTEGER,
  `appearance` INTEGER,
  `intelligence` INTEGER,
  `power` INTEGER,
  `education` INTEGER,
  `luck` INTEGER,
  `credit_rating` INTEGER
);

CREATE TABLE `DerivedAttributes` (
  `character_id` CHAR(64),
  `sanity` INTEGER,
  `magicPoints` INTEGER,
  `interestPoints` INTEGER,
  `hitPoints` INTEGER,
  `moveRate` INTEGER,
  `damageBonus` TEXT,
  `build` INTEGER,
  `professionalPoints` INTEGER
);

CREATE TABLE `Skills` (
  `character_id` CHAR(64),
  `Fighting` INTEGER,
  `Firearms` INTEGER,
  `Dodge` INTEGER,
  `Mechanics` INTEGER,
  `Drive` INTEGER,
  `Stealth` INTEGER,
  `Investigate` INTEGER,
  `Sleight_of_Hand` INTEGER,
  `Electronics` INTEGER,
  `History` INTEGER,
  `Science` INTEGER,
  `Medicine` INTEGER,
  `Occult` INTEGER,
  `Library_Use` INTEGER,
  `Art` INTEGER,
  `Persuade` INTEGER,
  `Psychology` INTEGER
);

CREATE TABLE `Professions` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `title` TEXT,
  `description` TEXT
);

CREATE TABLE `Backgrounds` (
  `character_id` CHAR(64),
  `beliefs` TEXT,
  `important_people` TEXT,
  `reasons` TEXT,
  `places` TEXT,
  `possessions` TEXT,
  `traits` TEXT,
  `keylink` TEXT
);

CREATE TABLE `Equipment` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` TEXT,
  `skill` TEXT,
  `price` INTEGER,
  `damage` INTEGER,
  `ammo_capacity` INTEGER
);

CREATE TABLE `CharacterEquipment` (
  `character_id` CHAR(64),
  `equipment_id` INTEGER,
  `on_bag` bool,
  `quantity` INTEGER DEFAULT 1
);

CREATE TABLE Maps (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,  -- 地图的唯一ID，自增主键
    first_entry_info TEXT,
    map_info TEXT,                         -- 地图信息描述
    items TEXT,                            -- 地图上的物品列表（逗号分隔）
    accessible_locations TEXT,              -- 可达之地（逗号分隔的地图ID）
    event_ids TEXT,
    character_ids TEXT
);

CREATE TABLE Events (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,  -- 事件的唯一ID，自增主键
  event_info TEXT,                       -- 事件的信息描述
  rate INTEGER,                         -- 事件概率
  character_ids TEXT,
  map_ids TEXT,
  if_unique TINYINT(1),
  afterevents INTEGER,                   -- 后续事件的ID
  beforeevents INTEGER,                  -- 先决事件的ID
  FOREIGN KEY (afterevents) REFERENCES Events (id),
  FOREIGN KEY (beforeevents) REFERENCES Events (id)
);



ALTER TABLE `Equipment` COMMENT = 'This table stores information about equipment, including name, skill, price, damage, and ammo capacity.';

ALTER TABLE `CharacterEquipment` COMMENT = 'This table represents the relationship between characters and their equipment. Characters can have multiple pieces of the same equipment.';

ALTER TABLE `Characters` ADD FOREIGN KEY (`profession_id`) REFERENCES `Professions` (`id`);

ALTER TABLE `Attributes` ADD UNIQUE KEY `unique_character` (`character_id`);

ALTER TABLE `DerivedAttributes` ADD UNIQUE KEY `unique_character` (`character_id`);

ALTER TABLE `Skills` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `Backgrounds` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `CharacterEquipment` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `CharacterEquipment` ADD FOREIGN KEY (`equipment_id`) REFERENCES `Equipment` (`id`);

ALTER TABLE `Backgrounds` ADD UNIQUE KEY `unique_character` (`character_id`);

ALTER TABLE `Backgrounds`
ADD COLUMN `beliefs_details` TEXT AFTER `beliefs`,
ADD COLUMN `important_people_details` TEXT AFTER `important_people`,
ADD COLUMN `reasons_details` TEXT AFTER `reasons`,
ADD COLUMN `places_details` TEXT AFTER `places`,
ADD COLUMN `possessions_details` TEXT AFTER `possessions`,
ADD COLUMN `traits_details` TEXT AFTER `traits`,
ADD COLUMN `keylink_details` TEXT AFTER `keylink`;

