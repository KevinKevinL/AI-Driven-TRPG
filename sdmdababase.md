// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table Characters {
  id INTEGER [pk, increment]
  name TEXT
  profession_id INTEGER [ref: > Professions.id]

  description TEXT
}

Table Attributes {
  character_id INTEGER [ref: > Characters.id]
  strength INTEGER
  constitution INTEGER
  size INTEGER
  dexterity INTEGER
  appearance INTEGER
  intelligence INTEGER
  power INTEGER
  education INTEGER
  luck INTEGER
  credit_rating INTEGER
}

Table DerivedAttributes {

  character_id INTEGER [ref: > Characters.id]
  sanity INTEGER
  magicPoints INTEGER
  interestPoints INTEGER
  hitPoints INTEGER
  moveRate INTEGER
  damageBonus INTEGER
  build INTEGER
  professionalPoints INTEGER
}

Table Skills {
  character_id INTEGER [ref: > Characters.id]
  Fighting      INTEGER
  Firearms      INTEGER
  Dodge         INTEGER
  Mechanics     INTEGER
  Drive      INTEGER
  Stealth        INTEGER
  Investigate     INTEGER
  Sleight_of_Hand   INTEGER
  Electronics     INTEGER
  History          INTEGER
  Science          INTEGER
  Medicine         INTEGER
  Occult        INTEGER
  Library_Use   INTEGER
  Art            INTEGER
  Persuade       INTEGER
  Psychology INTEGER

}

Table Professions {
  id INTEGER [pk, increment]

  title TEXT
  description TEXT

}

Table Backgrounds {
  character_id INTEGER [ref: > Characters.id]
  beliefs TEXT
  important_people TEXT
  reasons TEXT
  places TEXT
  possessions TEXT
  traits TEXT
  keylink TEXT
}
