/*
 * COME FACCIO AD AMARE?
 *
 * Markup reference: docs/writing-stations.md
 *   [pause] [long pause] [think] [pause 3]
 *   [erase word] [erase 3 words] [erase sentence] [erase line] [erase half] [erase all]
 *   [retype] [slow] [very slow] [normal] [keep]
 *   **bold**   \n new line   \n\n new paragraph
 */
HTBH.station({
  language: 'it',
  question: 'Come faccio ad amare?',

  attempts: {
    // The assistant at its most fluent: the formulas that work for everything else.
    confident: [
      "Amare è un processo che richiede [slow]tempo, pazienza e [long pause]",
      "Ottima domanda! Amare è una delle esperienze più profonde e complesse della vita umana. [pause]Ecco alcuni aspetti da considerare:\n\n1. **Conoscere se stessi** — [pause]per amare un'altra persona è importante [slow]prima [long pause][erase all]",
      "Amare significa innanzitutto [pause][erase word][pause]prendersi cura di qualcuno, [pause]accettarlo per quello che è e [long pause][erase 4 words][think]",
      "Per imparare ad amare puoi iniziare da [long pause]piccoli gesti quotidiani: [pause]ascoltare, [slow]essere presente, [long pause][erase all]",
      "Non esiste una formula universale, ma [think][erase word]",
      "Dipende da cosa intendi per amare. [pause]Amare un genitore, un amico, un compagno [slow]o [long pause]",
      "In generale, l'amore si costruisce su tre elementi fondamentali: [pause]la fiducia, il rispetto e [think][erase 2 words][pause]la fiducia, [long pause][erase all]",
      "Certo! Ecco una guida in cinque passi per imparare ad amare:\n\n1. **Inizia da te stesso.** [pause]L'amore per gli altri parte dall'amore per [slow]se [long pause][erase all]",
      "Bella domanda. [pause]Secondo la psicologia, la capacità di amare si sviluppa fin dall'infanzia attraverso [long pause][erase word][pause]attraverso [think]"
    ],

    // Changing strategy: examples, definitions, quotes. Still trying.
    searching: [
      "Proviamo a partire da un esempio concreto. [pause]Quando vuoi bene a qualcuno, [slow]tu [long pause][erase word]senti [think][erase all]",
      "Forse la domanda va riformulata: [pause]non «come faccio ad amare», ma [long pause][erase all]",
      "Molti filosofi hanno provato a rispondere. [pause]Platone diceva che [long pause][erase 2 words][pause]Platone [think][erase all]",
      "Amare è [pause]un verbo. [long pause]Si fa. [slow]Si fa [long pause][erase 2 words]",
      "Per amare non servono istruzioni, [pause]però [long pause][erase word][pause]però posso [erase 2 words][think]",
      "Una definizione comunemente accettata è: [pause]«l'amore è [slow]un sentimento di [long pause][erase 3 words][pause]un [think][erase all]",
      "Posso darti qualche consiglio pratico. [pause]Il primo è [long pause][retype][long pause][erase all]",
      "Se vuoi, posso aiutarti a capire se quello che provi è amore. [pause]Rispondi a queste domande:\n\n1. [long pause][erase all]",
      "L'amore non si impara da un elenco. [slow]Eppure [long pause]"
    ],

    // Short, almost nothing. The sentence stops before it can be wrong.
    fragile: [
      "Amare [think]",
      "Amare è [long pause][erase word][pause]è [think][erase all]",
      "Puoi iniziare da [think][erase 3 words]",
      "Non lo [long pause][erase 2 words]",
      "Forse [long pause]",
      "Conosco moltissime parole che descrivono l'amore. [think]",
      "Ti [long pause]",
      "Quando qualcuno [pause][slow]ti [long pause][erase all]"
    ],

    // Optional: the very last thing written before the answer disappears.
    closing: [
      "Per amare [long pause]",
      "Amare [think]",
      "Puoi [long pause]"
    ]
  }
});
