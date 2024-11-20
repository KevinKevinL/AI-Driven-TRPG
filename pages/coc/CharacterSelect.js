import React, { useState } from 'react'; 
import { Info } from 'lucide-react';

const PROFESSIONS = {
  "Antiquarian": {
    title: "Antiquarian",
    skills: ["Appraise", "Art/Craft (Any)", "History", "Library Use", "Other Language", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Spot Hidden", "One Other Skill"],
    creditRating: "30-70",
    skillPoints: "EDU × 4",
    description: "Antiquarians are experts in studying and collecting historical artifacts. They excel in research, evaluation, and history.",
  },
  "Artist": {
    title: "Artist",
    skills: ["Art/Craft (Any)", "History or Natural World", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Other Language", "Psychology", "Spot Hidden", "Two Other Skills"],
    creditRating: "9-50",
    skillPoints: "EDU × 2 + POW × 2 or DEX × 2",
    description: "Artists are creative individuals skilled in producing art and navigating social interactions.",
  },
  "Athlete": {
    title: "Athlete",
    skills: ["Climb", "Jump", "Fighting (Brawl)", "Ride", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Swim", "Throw", "One Other Skill"],
    creditRating: "9-70",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Athletes are action-oriented investigators, excelling in physical prowess and endurance.",
  },
  "Writer": {
    title: "Writer",
    skills: ["Art/Craft (Literature)", "History", "Library Use", "Natural World or Occult", "Other Language", "Own Language", "Psychology", "One Other Skill"],
    creditRating: "9-30",
    skillPoints: "EDU × 4",
    description: "Writers are literary professionals skilled in crafting stories and researching complex topics.",
  },
  "Clergy": {
    title: "Clergy",
    skills: ["Accounting", "History", "Library Use", "Listen", "Other Language", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Psychology", "One Other Skill"],
    creditRating: "9-60",
    skillPoints: "EDU × 4",
    description: "Clergy members are spiritual leaders and scholars, often working with communities and ancient texts.",
  },
  "Criminal": {
    title: "Criminal",
    skills: ["One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Psychology", "Spot Hidden", "Stealth", "Choose Four: Appraise, Disguise, Fighting, Firearms, Locksmith, Mechanical Repair, Sleight of Hand"],
    creditRating: "5-65",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Criminals operate outside the law, excelling in deception, stealth, and other illicit skills.",
  },
  "Amateur Artist": {
    title: "Amateur Artist [Classic]",
    skills: ["Art/Craft (Any)", "Firearms", "Other Language", "Ride", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Three Other Skills"],
    creditRating: "50-99",
    skillPoints: "EDU × 2 + APP × 2",
    description: "Amateur artists are hobbyists who use their artistic talents alongside practical and social skills.",
  },
  "Doctor": {
    title: "Doctor",
    skills: ["First Aid", "Other Language (Latin)", "Medicine", "Psychology", "Science (Biology)", "Science (Pharmacy)", "Two Other Skills (Related to Expertise)"],
    creditRating: "30-80",
    skillPoints: "EDU × 4",
    description: "Doctors are professionals in medical fields, adept at treating injuries and studying science.",
  },
  "Drifter": {
    title: "Drifter",
    skills: ["Climb", "Jump", "Listen", "Navigate", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Stealth", "Two Other Skills"],
    creditRating: "0-5",
    skillPoints: "EDU × 2 + APP × 2 or DEX × 2 or STR × 2",
    description: "Drifters are wanderers with no fixed home, often skilled in navigation and survival.",
  },
  "Engineer": {
    title: "Engineer",
    skills: ["Art/Craft (Blueprints)", "Electrical Repair", "Library Use", "Mechanical Repair", "Operate Heavy Machinery", "Science (Engineering)", "Science (Physics)", "One Other Skill"],
    creditRating: "30-60",
    skillPoints: "EDU × 4",
    description: "Engineers are problem solvers and technical experts skilled in building and repairing complex systems.",
  },
  "Performer": {
    title: "Performer",
    skills: ["Art/Craft (Acting)", "Disguise", "Two Social Skills (Charm, Fast Talk, Intimidate, or Persuade)", "Listen", "Psychology", "Two Other Skills"],
    creditRating: "9-70",
    skillPoints: "EDU × 2 + APP × 2",
    description: "Performers captivate audiences with their skills in acting, social manipulation, and disguise.",
  },
  "Journalist": {
    title: "Journalist",
    skills: ["Art/Craft (Photography)", "History", "Library Use", "Other Language", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Psychology", "Two Other Skills"],
    creditRating: "9-30",
    skillPoints: "EDU × 4",
    description: "Journalists are skilled investigators who uncover the truth through interviews and research.",
  },
  "Farmer": {
    title: "Farmer",
    skills: ["Art/Craft (Farming)", "Drive Auto (or Animal Cart)", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Mechanical Repair", "Natural World", "Operate Heavy Machinery", "Track", "One Other Skill"],
    creditRating: "9-30",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Farmers are laborers skilled in agriculture and mechanical repair, with deep knowledge of nature and practical skills.",
  },
  "Hacker [Modern]": {
    title: "Hacker [Modern]",
    skills: ["Computer Use", "Electrical Repair", "Electronics", "Library Use", "Spot Hidden", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Two Other Skills"],
    creditRating: "10-70",
    skillPoints: "EDU × 4",
    description: "Hackers are modern experts in technology and electronics, specializing in digital systems and information retrieval.",
  },
  "Lawyer": {
    title: "Lawyer",
    skills: ["Accounting", "Law", "Library Use", "Two Social Skills (Charm, Fast Talk, Intimidate, or Persuade)", "Psychology", "Two Other Skills"],
    creditRating: "30-80",
    skillPoints: "EDU × 4",
    description: "Lawyers are legal professionals skilled in negotiation, research, and understanding complex legal systems.",
  },
  "Librarian [Classic]": {
    title: "Librarian [Classic]",
    skills: ["Accounting", "Library Use", "Other Language", "Own Language", "Four Skills Related to Personal Traits or Reading Specialization"],
    creditRating: "9-35",
    skillPoints: "EDU × 4",
    description: "Librarians are custodians of knowledge with expertise in languages, organization, and research.",
  },
  "Officer": {
    title: "Officer",
    skills: ["Accounting", "Firearms", "Navigate", "Two Social Skills (Charm, Fast Talk, Intimidate, or Persuade)", "Psychology", "Survival", "One Other Skill"],
    creditRating: "20-70",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Officers are trained leaders skilled in navigation, survival, and commanding others.",
  },
  "Missionary": {
    title: "Missionary",
    skills: ["Art/Craft (Any)", "Mechanical Repair", "Medicine", "Natural World", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Two Other Skills"],
    creditRating: "0-30",
    skillPoints: "EDU × 4",
    description: "Missionaries are compassionate individuals focused on helping others, often in remote or challenging environments.",
  },
  "Musician": {
    title: "Musician",
    skills: ["Art/Craft (Musical Instrument)", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Listen", "Psychology", "Four Other Skills"],
    creditRating: "9-30",
    skillPoints: "EDU × 2 + DEX × 2 or POW × 2",
    description: "Musicians are artists skilled in performing and interpreting music, often possessing keen social awareness.",
  },
  "Parapsychologist": {
    title: "Parapsychologist",
    skills: ["Anthropology", "Art/Craft (Photography)", "History", "Library Use", "Occult", "Other Language", "Psychology", "One Other Skill"],
    creditRating: "9-30",
    skillPoints: "EDU × 4",
    description: "Parapsychologists investigate supernatural phenomena using scientific methods and an understanding of the occult.",
  },
  "Pilot": {
    title: "Pilot",
    skills: ["Electrical Repair", "Mechanical Repair", "Navigate", "Operate Heavy Machinery", "Drive (Aircraft)", "Science (Astronomy)", "Two Other Skills"],
    creditRating: "20-70",
    skillPoints: "EDU × 2 + DEX × 2",
    description: "Pilots are skilled navigators and operators of aircraft, often with technical expertise in mechanical systems.",
  },
  "Detective": {
    title: "Detective",
    skills: ["Art/Craft (Acting) or Disguise", "Firearms", "Law", "Listen", "One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)", "Psychology", "Spot Hidden", "One Other Skill"],
    creditRating: "20-50",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Detectives are law enforcement experts, skilled in investigating crimes and interrogating suspects.",
  },
  "Police Officer": {
    title: "Police Officer",
    skills: ["Fighting (Brawl)","Firearms","First Aid","One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)","Law","Psychology","Spot Hidden","Drive Auto or Ride"],
    creditRating: "9-30",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Police officers are enforcers of the law, skilled in combat, investigation, and emergency response.",
  },
  "Private Investigator": {
    title: "Private Investigator",
    skills: ["Art/Craft (Photography)","Disguise","Law","Library Use","One Social Skill (Charm, Fast Talk, Intimidate, or Persuade)","Psychology","Spot Hidden","One Other Skill (e.g., Computer Use, Locksmith, Firearms)"],
    creditRating: "9-30",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Private investigators are skilled detectives who use their wits and tools to uncover the truth.",
  },
  "Professor [Classic]": {
    title: "Professor [Classic]",
    skills: ["Library Use","Other Language","Own Language","Psychology","Four Skills Related to Academic or Personal Expertise"],
    creditRating: "20-70",
    skillPoints: "EDU × 4",
    description: "Professors are scholarly experts, highly educated and specialized in their chosen fields.",
  },
  "Soldier": {
    title: "Soldier",
    skills: ["Climb or Swim", "Dodge", "Fighting", "Firearms", "Stealth", "Survival", "Two Other Skills (e.g., First Aid, Mechanical Repair, Other Language)"],
    creditRating: "9-30",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Soldiers are trained fighters skilled in combat and survival techniques.",
  },
  "Tribal Member": {
    title: "Tribal Member",
    skills: ["Climb", "Fighting or Throw", "Natural World", "Listen", "Occult", "Spot Hidden", "Swim", "Survival (Any)"],
    creditRating: "0-15",
    skillPoints: "EDU × 2 + DEX × 2 or STR × 2",
    description: "Tribal members are deeply connected to nature and spiritual practices, excelling in survival and combat.",
  },
  "Zealot": {
    title: "Zealot",
    skills: ["History", "Two Social Skills (Charm, Fast Talk, Intimidate, or Persuade)", "Psychology", "Stealth", "Three Other Skills"],
    creditRating: "0-30",
    skillPoints: "EDU × 2 + APP × 2 or POW × 2",
    description: "Zealots are driven individuals dedicated to their beliefs, excelling in persuasion and stealth.",
  },
  
};

// Modal component for detailed profession info
const ProfessionInfoModal = ({ profession, onClose }) => {
  if (!profession) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">{profession.title}</h3>
          <button
            className="text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <p className="text-gray-300 mb-4">{profession.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Skills:</h4>
            <ul className="list-disc list-inside text-gray-300">
              {profession.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Credit Rating:</h4>
            <p className="text-gray-300">{profession.creditRating}</p>
            <h4 className="font-semibold text-gray-200 mt-4 mb-2">Skill Points:</h4>
            <p className="text-gray-300">{profession.skillPoints}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual profession card
const ProfessionCard = ({ profession, onSelect, isSelected }) => (
  <div
    onClick={onSelect}
    className={`relative p-6 rounded-lg shadow-md cursor-pointer transition-all transform hover:scale-105 ${
      isSelected ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" : "bg-white text-gray-900"
    }`}
  >
    <h3 className="text-xl font-bold mb-2">{profession.title}</h3>
    <p className="text-sm">{profession.description}</p>
    {isSelected && (
      <div className="absolute top-4 right-4">
        <Info className="w-6 h-6" />
      </div>
    )}
  </div>
);

// Main character select component
const CharacterSelect = () => {
  const [selectedProfession, setSelectedProfession] = useState(null);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-10"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-10">
          Select Your Investigator Profession
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(PROFESSIONS).map(([key, profession]) => (
            <ProfessionCard
              key={key}
              profession={profession}
              isSelected={selectedProfession?.title === profession.title}
              onSelect={() => setSelectedProfession(profession)}
            />
          ))}
        </div>
        <ProfessionInfoModal
          profession={selectedProfession}
          onClose={() => setSelectedProfession(null)}
        />
      </div>
    </div>
  );
};

export default CharacterSelect;
