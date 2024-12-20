CREATE TABLE Characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 人物角色的唯一ID
  name TEXT NOT NULL,                      -- 人物角色的姓名
  profession_id INTEGER,                   -- 人物角色的职业ID，关联到 Professions 表
  credit_rating TEXT,                      -- 人物角色的信用评级（例如，30-70）
  description TEXT,                        -- 人物角色的描述
  FOREIGN KEY(profession_id) REFERENCES Professions(id)  -- 外键，关联到 Professions 表的职业
);
-- 该表存储了每个人物角色的基本信息，如姓名、职业、信用评级以及角色描述。

CREATE TABLE Attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 属性记录的唯一ID
  character_id INTEGER,                    -- 人物角色的ID，关联到 Characters 表
  strength INTEGER,                        -- 力量属性
  constitution INTEGER,                    -- 体质属性
  size INTEGER,                            -- 体型属性
  dexterity INTEGER,                       -- 敏捷属性
  appearance INTEGER,                      -- 外貌属性
  intelligence INTEGER,                    -- 智力属性
  power INTEGER,                           -- 精力属性
  education INTEGER,                       -- 教育属性
  luck INTEGER,                            -- 幸运属性
  FOREIGN KEY(character_id) REFERENCES Characters(id)  -- 外键，关联到 Characters 表的角色ID
);
-- 该表存储人物角色的基础属性数据，如力量、体质、敏捷等。

CREATE TABLE DerivedAttributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 衍生属性记录的唯一ID
  character_id INTEGER,                    -- 人物角色的ID，关联到 Characters 表
  sanity INTEGER,                          -- 理智值
  magicPoints INTEGER,                     -- 魔法点数
  interestPoints INTEGER,                  -- 兴趣点数
  hitPoints INTEGER,                       -- 生命值
  moveRate INTEGER,                        -- 移动速度
  damageBonus INTEGER,                     -- 攻击加成
  build INTEGER,                           -- 身体构造
  professionalPoints INTEGER,              -- 职业点数
  FOREIGN KEY(character_id) REFERENCES Characters(id)  -- 外键，关联到 Characters 表的角色ID
);
-- 该表存储人物角色的衍生属性数据，如理智值、生命值、职业点数等。

CREATE TABLE Skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 技能记录的唯一ID
  character_id INTEGER,                    -- 人物角色的ID，关联到 Characters 表
  skill_name TEXT,                         -- 技能名称
  skill_level INTEGER,                     -- 技能等级
  FOREIGN KEY(character_id) REFERENCES Characters(id)  -- 外键，关联到 Characters 表的角色ID
);
-- 该表存储人物角色的技能信息，包括技能名称和技能等级。

CREATE TABLE Professions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 职业记录的唯一ID
  title TEXT,                              -- 职业名称（例如，Antiquarian）
  description TEXT,                        -- 职业描述
  skill_points TEXT,                       -- 职业的技能点数（例如，EDU × 4）
  credit_rating TEXT                       -- 职业的信用评级（例如，30-70）
);
-- 该表存储可供人物角色选择的职业信息，包括职业名称、描述、技能点数以及信用评级。

CREATE TABLE Backgrounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 背景记录的唯一ID
  character_id INTEGER,                    -- 人物角色的ID，关联到 Characters 表
  beliefs TEXT,                            -- 人物的信仰
  important_people TEXT,                   -- 人物的关键人物
  reasons TEXT,                            -- 人物的动机或原因
  places TEXT,                             -- 人物的所在地点
  possessions TEXT,                        -- 人物拥有的物品
  traits TEXT,                             -- 人物的个性特征
  FOREIGN KEY(character_id) REFERENCES Characters(id)  -- 外键，关联到 Characters 表的角色ID
);
-- 该表存储人物角色的背景信息，如信仰、重要人物、动机、地点、物品以及个性特征。
