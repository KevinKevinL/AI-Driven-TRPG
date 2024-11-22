export const DiceSystem = {
    roll: (n, d) => {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += Math.floor(Math.random() * d) + 1;
        }
        return sum;
    },
    roll3D6: function() {
        return this.roll(3, 6);
    },
    roll2D6Plus6: function() {
        return this.roll(2, 6) + 6;
    },
    rollD10: function() {
        return this.roll(1, 10);
    },
    rollD100: function() {
        return this.roll(1, 100);
    }
};

export const applyAgeModifiers = (attributes, age) => {
    let modified = { ...attributes };
    let eduChecks = 0;

    if (age >= 15 && age <= 19) {
        modified.strength -= 5;
        modified.size -= 5;
        modified.education -= 5;
        const luck1 = DiceSystem.roll3D6() * 5;
        const luck2 = DiceSystem.roll3D6() * 5;
        modified.luck = Math.max(luck1, luck2);
    } else if (age >= 20 && age <= 39) {
        eduChecks = 1;
    } else if (age >= 40 && age <= 49) {
        eduChecks = 2;
        modified.strength -= 2;
        modified.constitution -= 2;
        modified.dexterity -= 1;
        modified.appearance -= 5;
        modified.moveRate -= 1;
    } else if (age >= 50 && age <= 59) {
        eduChecks = 3;
        modified.strength -= 3;
        modified.constitution -= 3;
        modified.dexterity -= 4;
        modified.appearance -= 10;
        modified.moveRate -= 2;
    } else if (age >= 60 && age <= 69) {
        eduChecks = 4;
        modified.strength -= 7;
        modified.constitution -= 7;
        modified.dexterity -= 6;
        modified.appearance -= 15;
        modified.moveRate -= 3;
    } else if (age >= 70 && age <= 79) {
        eduChecks = 4;
        modified.strength -= 13;
        modified.constitution -= 13;
        modified.dexterity -= 14;
        modified.appearance -= 20;
        modified.moveRate -= 4;
    } else if (age >= 80 && age <= 89) {
        eduChecks = 4;
        modified.strength -= 26;
        modified.constitution -= 26;
        modified.dexterity -= 28;
        modified.appearance -= 25;
        modified.moveRate -= 5;
    }

    for (let i = 0; i < eduChecks; i++) {
        if (DiceSystem.rollD100() > modified.education) {
            modified.education += DiceSystem.rollD10();
        }
    }

    Object.keys(modified).forEach(key => {
        if (typeof modified[key] === 'number') {
            modified[key] = Math.max(0, modified[key]);
        }
    });

    return modified;
};

export const calculateDamageBonusAndBuild = (strength, size) => {
    const total = strength + size;
    
    if (total >= 2 && total <= 64) return { damageBonus: "-2", build: -2 };
    if (total >= 65 && total <= 84) return { damageBonus: "-1", build: -1 };
    if (total >= 85 && total <= 124) return { damageBonus: "0", build: 0 };
    if (total >= 125 && total <= 164) return { damageBonus: "+1D4", build: 1 };
    if (total >= 165 && total <= 204) return { damageBonus: "+1D6", build: 2 };
    if (total >= 205 && total <= 284) return { damageBonus: "+2D6", build: 3 };
    if (total >= 285 && total <= 364) return { damageBonus: "+3D6", build: 4 };
    if (total >= 365 && total <= 444) return { damageBonus: "+4D6", build: 5 };
    if (total >= 445 && total <= 524) return { damageBonus: "+5D6", build: 6 };
    
    if (total > 524) {
        const extraD6 = Math.floor((total - 524) / 80) + 5;
        return { 
            damageBonus: `+${extraD6}D6`, 
            build: 6 + Math.floor((total - 524) / 80) 
        };
    }
    
    return { damageBonus: "0", build: 0 };
};

export const calculateMoveRate = (strength, dexterity, size, age) => {
    let baseMove;
    if (strength < size && dexterity < size) baseMove = 7;
    else if (strength >= size || dexterity >= size) baseMove = 8;
    else if (strength > size && dexterity > size) baseMove = 9;
    else baseMove = 8;

    return baseMove;
};

export const generateAttributes = (age = 25) => {
    let attributes = {
        strength: DiceSystem.roll3D6() * 5,
        constitution: DiceSystem.roll3D6() * 5,
        size: DiceSystem.roll2D6Plus6() * 5,
        dexterity: DiceSystem.roll3D6() * 5,
        appearance: DiceSystem.roll3D6() * 5,
        intelligence: DiceSystem.roll2D6Plus6() * 5,
        power: DiceSystem.roll3D6() * 5,
        education: DiceSystem.roll2D6Plus6() * 5,
        luck: DiceSystem.roll3D6() * 5
    };

    attributes = applyAgeModifiers(attributes, age);

    const { damageBonus, build } = calculateDamageBonusAndBuild(attributes.strength, attributes.size);
    const moveRate = calculateMoveRate(attributes.strength, attributes.dexterity, attributes.size, age);
    const hitPoints = Math.floor((attributes.constitution + attributes.size) / 10);

    return {
        ...attributes,
        age,
        sanity: attributes.power,
        magicPoints: Math.floor(attributes.power / 5),
        interestPoints: attributes.intelligence * 2,
        hitPoints,
        moveRate,
        damageBonus,
        build
    };
};