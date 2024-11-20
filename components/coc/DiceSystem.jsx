const DiceSystem = {
    roll(n, d) {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += Math.floor(Math.random() * d) + 1;
        }
        return sum;
    },
    roll3D6() {
        return this.roll(3, 6);
    },
    roll2D6Plus6() {
        return this.roll(2, 6) + 6;
    }
};

const AttributeGenerator = {
    generateAttributes() {
        const attributes = {
            strength: DiceSystem.roll3D6() * 5,
            constitution: DiceSystem.roll3D6() * 5,
            size: DiceSystem.roll2D6Plus6() * 5,
            dexterity: DiceSystem.roll3D6() * 5,
            appearance: DiceSystem.roll3D6() * 5,
            intelligence: DiceSystem.roll2D6Plus6() * 5,
            power: DiceSystem.roll3D6() * 5,
            education: DiceSystem.roll2D6Plus6() * 5
        };

        attributes.sanity = attributes.power;
        attributes.magicPoints = Math.floor(attributes.power / 5);
        attributes.interestPoints = attributes.intelligence * 2;

        return attributes;
    }
};

export { DiceSystem, AttributeGenerator };