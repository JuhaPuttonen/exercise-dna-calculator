// Returns a random DNA base
const returnRandBase = () => {
  const dnaBases = ['A', 'T', 'C', 'G'];
  return dnaBases[Math.floor(Math.random() * 4)];
};

// Returns a random single stand of DNA containing 15 bases
const mockUpStrand = () => {
  const newStrand = [];
  for (let i = 0; i < 15; i++) {
    newStrand.push(returnRandBase());
  }
  return newStrand;
};

const pAequorFactory = (specimenNum, dna) => {
  return {
    specimenNum,
    dna,
    mutate() {
      let index = Math.floor(Math.random() * this.dna.length);
      let oldBase = this.dna[index];
      let newBase = oldBase;

      while (newBase === oldBase) {
        newBase = returnRandBase();
      }
      this.dna[index] = newBase;
    },
    complementStrand() {
      return this.dna.map(base => {
        switch (base) {
          case 'A':
            return 'T';
          case 'T':
            return 'A';
          case 'C':
            return 'G';
          case 'G':
            return 'C';
        }
      });
    },
    compareDNA(pAequor) {
      let common = this.dna.reduce((accumulator, currentValue, index) =>
        (currentValue === pAequor.dna[index]) ? ++accumulator : accumulator, 0);
      let percentage = (common / this.dna.length) * 100;
      console.log(`specimen #${this.specimenNum} and specimen #${pAequor.specimenNum} have ${percentage}% DNA in common`);
      return percentage;
    },
    willLikelySurvive() {
      let cgCount = this.dna.reduce((accumulator, currentBase) =>
        (currentBase === 'C' || currentBase === 'G') ? ++accumulator : accumulator, 0);

      return cgCount / this.dna.length >= 0.6;
    }
  }
};

let survivableInstances = [];

while (survivableInstances.length < 30) {
  let instance = pAequorFactory(survivableInstances.length + 1, mockUpStrand());

  while (!instance.willLikelySurvive()) {
    instance.mutate();
  }
  survivableInstances.push(instance);
}

// Find the two most related instances
let instanceA;
let instanceB;
let relation;

survivableInstances.forEach(item1 => survivableInstances.forEach(item2 => {
  if (item1 === item2) {
    return;
  }
  let currentRelation = item1.compareDNA(item2);
  if (!relation || relation < currentRelation) {
    instanceA = item1;
    instanceB = item2;
    relation = currentRelation;
  }
}));

console.log(`\nThe two most related specimens are #${instanceA.specimenNum} and #${instanceB.specimenNum} with ${relation}% of DNA in common.
The DNA strands and their complementary strands are:
#${instanceA.specimenNum}: ${instanceA.dna} #${instanceB.specimenNum}: ${instanceB.dna}
#${instanceA.specimenNum}: ${instanceA.complementStrand()} #${instanceB.specimenNum}: ${instanceB.complementStrand()}`);
