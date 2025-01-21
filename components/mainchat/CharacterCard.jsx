import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DatabaseManager from '@components/coc/DatabaseManager';

export default function CharacterCard({ title }) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const character_id = 'ad29155d19c9d6a8a744fc1d794aa8c042b75dc4830a85d6ab87656d6f8d81c7';
  const dbManager = DatabaseManager();

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        const data = await dbManager.loadCharacterAttributes(character_id);
        setCharacterData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, []);

  if (loading) {
    return <p className="text-emerald-900">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!characterData) {
    return <p className="text-emerald-900">Character data not found</p>;
  }

  const { attributes, derivedAttributes, skills, characterInfo } = characterData;

  return (
    <div className="pl-20 pt-8">
      <div>

        <div className="flex gap-8 mb-2">
          <div className="relative w-32 h-40 overflow-hidden">
            <Image 
              src="/images/Amilia.png"
              alt="Character Portrait"
              fill
              className="object-cover"
              sizes="128px"
              priority
            />
          </div>

          <div className="flex flex-col justify-center gap-3 text-emerald-900">
            <p>Name: {characterInfo?.name || 'Unknown'}</p>
            <p>Gender: {characterInfo?.gender || 'Unknown'}</p>
            <p>Residence: {characterInfo?.residence || 'Unknown'}</p>
            <p>Birthplace: {characterInfo?.birthplace || 'Unknown'}</p>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-base font-semibold text-emerald-900 mb-2">Base Attributes</h3>
          <div className="grid grid-cols-3 gap-3 text-emerald-900">
            <p>Strength: {attributes?.strength || 0}</p>
            <p>Constitution: {attributes?.constitution || 0}</p>
            <p>Size: {attributes?.size || 0}</p>
            <p>Dexterity: {attributes?.dexterity || 0}</p>
            <p>Appearance: {attributes?.appearance || 0}</p>
            <p>Intelligence: {attributes?.intelligence || 0}</p>
            <p>Power: {attributes?.power || 0}</p>
            <p>Education: {attributes?.education || 0}</p>
            <p>Luck: {attributes?.luck || 0}</p>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-base font-semibold text-emerald-900 mb-2">Derived Attributes</h3>
          <div className="grid grid-cols-3 gap-3 text-emerald-900">
            <p>Hit Points: {derivedAttributes?.hitPoints || 0}</p>
            <p>Magic Points: {derivedAttributes?.magicPoints || 0}</p>
            <p>Sanity: {derivedAttributes?.sanity || 0}</p>
            <p>Move Rate: {derivedAttributes?.moveRate || 0}</p>
            <p>Damage Bonus: {derivedAttributes?.damageBonus || 0}</p>
            <p>Build: {derivedAttributes?.build || 0}</p>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-base font-semibold text-emerald-900 mb-2">Skills</h3>
          <div className="grid grid-cols-3 gap-3 text-emerald-900">
            <p>Fighting: {skills?.Fighting || 0}</p>
            <p>Firearms: {skills?.Firearms || 0}</p>
            <p>Dodge: {skills?.Dodge || 0}</p>
            <p>Mechanics: {skills?.Mechanics || 0}</p>
            <p>Drive: {skills?.Drive || 0}</p>
            <p>Stealth: {skills?.Stealth || 0}</p>
            <p>Investigate: {skills?.Investigate || 0}</p>
            <p>Hand Sleight: {skills?.Sleight_of_Hand || 0}</p>
            <p>Electronics: {skills?.Electronics || 0}</p>
            <p>History: {skills?.History || 0}</p>
            <p>Science: {skills?.Science || 0}</p>
            <p>Medicine: {skills?.Medicine || 0}</p>
            <p>Occult: {skills?.Occult || 0}</p>
            <p>Library Use: {skills?.Library_Use || 0}</p>
            <p>Art: {skills?.Art || 0}</p>
            <p>Persuade: {skills?.Persuade || 0}</p>
            <p>Psychology: {skills?.Psychology || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}