create database characters;
use characters;

CREATE TABLE `Characters` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` TEXT,
  `profession_id` INTEGER,
  `description` TEXT
);

CREATE TABLE `Attributes` (
  `character_id` INTEGER,
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
  `character_id` INTEGER,
  `sanity` INTEGER,
  `magicPoints` INTEGER,
  `interestPoints` INTEGER,
  `hitPoints` INTEGER,
  `moveRate` INTEGER,
  `damageBonus` INTEGER,
  `build` INTEGER,
  `professionalPoints` INTEGER
);

CREATE TABLE `Skills` (
  `character_id` INTEGER,
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
  `character_id` INTEGER,
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
  `character_id` INTEGER,
  `equipment_id` INTEGER,
  `on_bag` bool,
  `quantity` INTEGER DEFAULT 1
);

ALTER TABLE `Equipment` COMMENT = 'This table stores information about equipment, including name, skill, price, damage, and ammo capacity.';

ALTER TABLE `CharacterEquipment` COMMENT = 'This table represents the relationship between characters and their equipment. Characters can have multiple pieces of the same equipment.';

ALTER TABLE `Characters` ADD FOREIGN KEY (`profession_id`) REFERENCES `Professions` (`id`);

ALTER TABLE `Attributes` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `DerivedAttributes` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `Skills` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `Backgrounds` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `CharacterEquipment` ADD FOREIGN KEY (`character_id`) REFERENCES `Characters` (`id`);

ALTER TABLE `CharacterEquipment` ADD FOREIGN KEY (`equipment_id`) REFERENCES `Equipment` (`id`);
