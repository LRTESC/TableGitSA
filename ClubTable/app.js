const fs = require('fs');

function calculerFacturation(membres) {
  const facturation = {};
  const parents = membres.filter(membre => membre.linkId === null);

  parents.forEach(parent => {
    const enfants = [];

    const calculerEnfants = (membre) => {
      if (enfants.includes(membre.id)) {
        throw new Error('Référence circulaire détectée');
      }

      if (membre.linkId !== null) {
        const enfant = membres.find(m => m.id === membre.linkId);
        if (enfant) {
          enfants.push(enfant.id);
          calculerEnfants(enfant);
        }
      }
    };

    try {
      calculerEnfants(parent);
      facturation[parent.id] = enfants;
    } catch (e) {
      console.error(`Erreur lors du calcul de la facturation pour le parent ${parent.id}: ${e.message}`);
    }
  });

  return facturation;
}

fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const membres = JSON.parse(data);
  const facturation = calculerFacturation(membres);
  console.log(facturation);
});
