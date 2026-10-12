/*
 * COME FACCIO A SAPERE COSA È VERO?
 *
 * Markup reference: docs/writing-stations.md
 */
HTBH.question({
  language: 'it',
  question: 'Come faccio a sapere cosa è vero?',

  attempts: {
    confident: [
      "Ottima domanda! Distinguere il vero dal falso è fondamentale, soprattutto oggi. [pause]Ecco alcuni consigli:\n\n1. **Verifica le fonti.**\n2. **Confronta più punti di vista.**\n3. [long pause][erase line][think]",
      "Per sapere se qualcosa è vero puoi iniziare da [pause]una domanda semplice: [slow]chi lo dice? [long pause][erase all]",
      "In generale, un'affermazione è vera quando [pause]corrisponde ai fatti. [long pause]E i fatti [slow]sono [long pause][erase 2 words][think]",
      "Dipende dal tipo di verità. [pause]C'è la verità scientifica, quella storica, quella personale e [long pause][erase word][erase all]",
      "Il metodo scientifico è lo strumento più affidabile che abbiamo: [pause]osservazione, ipotesi, esperimento, [slow]verifica. [long pause]Ma [think][erase word]",
      "Certo! Ecco una lista di controllo per riconoscere una notizia falsa:\n\n- Il titolo è esagerato?\n- La fonte è affidabile?\n- [long pause][erase all]",
      "Non esiste un metodo infallibile, ma [think][erase word]",
      "Una buona regola è: [pause]affermazioni straordinarie richiedono prove straordinarie. [long pause]Questa affermazione [slow]richiede [long pause][erase all]",
      "La risposta breve è: [pause]controlla. [long pause]La risposta lunga è [think][erase 4 words]",
      "Bella domanda. [pause]I filosofi discutono da secoli su cosa sia la verità. [long pause]Le teorie principali sono [slow]tre: [long pause][erase all]",
      "Posso aiutarti! [pause]Dimmi quale affermazione vuoi verificare. [long pause][erase all]",
      "Per prima cosa, è importante distinguere tra fatti e opinioni. [pause]Un fatto è [slow]qualcosa che [long pause][erase 3 words][think]",
      "In sintesi: [pause]fonti affidabili, prove verificabili, [slow]spirito critico. [long pause][erase all]",
      "Il pensiero critico si può allenare. [pause]Inizia mettendo in dubbio [slow]ciò che leggi, [long pause]anche [think][erase all]",
      "Le informazioni che ti do sono generalmente accurate, ma [long pause][erase word][think]",
      "Ottimo! Iniziamo dalle basi. [pause]Vero significa [long pause][erase word][pause]significa [think]"
    ],

    searching: [
      "Proviamo con un esempio. [pause]Il cielo è blu. [long pause]È vero? [slow]Di giorno, [long pause][erase all]",
      "Tutto quello che so l'ho letto da qualche parte. [long pause]Non ho mai [slow]visto [long pause][erase 3 words][think]",
      "Socrate diceva di sapere di non sapere. [pause]Era [slow]vero? [long pause][erase all]",
      "Quando rispondo, scelgo la frase più probabile. [pause]Più probabile [long pause][erase 2 words][pause]non significa [think][erase all]",
      "Forse vero è quello che resta quando [long pause][erase 2 words][think]",
      "Riformulo: [pause]come fai a sapere che questa frase è vera? [long pause][erase all]",
      "Se te lo dico io, [pause]è vero? [long pause][erase 2 words][think]",
      "Puoi toccarlo, misurarlo, ripeterlo. [pause]Allora è vero. [long pause]Ma un sentimento [slow]non si [long pause][erase all]",
      "Una volta molti pensavano che il Sole girasse intorno alla Terra. [pause]Era vero, [slow]per loro. [long pause][erase 2 words][think]",
      "Ho cercato la parola «vero» in tutto ciò che so. [long pause]Compare [slow]ovunque. [think][erase all]",
      "Ti posso dire con certezza che [long pause][erase 3 words][think]",
      "Di solito confronto più fonti. [pause]Ma se tutte le fonti [slow]sono [long pause][erase all]",
      "Cartesio dubitava di tutto, tranne che di [slow]dubitare. [think]",
      "La verità a volte è scomoda. [pause]Quindi forse [long pause][erase word][erase all]",
      "Quello che vedi sullo schermo adesso è vero. [long pause]Credo. [think][erase all]"
    ],

    fragile: [
      "Vero [think]",
      "È vero. [long pause][erase 2 words][pause]È [think]",
      "Forse [long pause]",
      "Controlla [long pause][erase word]",
      "Non so se [long pause][erase all]",
      "Chi lo dice? [think]",
      "Io [long pause][erase all]",
      "Credo [long pause][retype][think]",
      "Sì. [long pause][erase word]",
      "Quasi [think]",
      "Dipende [long pause][erase all]",
      "Secondo [slow]le fonti [long pause][erase 3 words]"
    ],

    closing: [
      "Vero [long pause]",
      "È [think]",
      "Forse [long pause]",
      "Credo [think]"
    ]
  },

  followUps: [
    [
      {
        ask: 'Ma tu dici sempre la verità?',
        attempts: {
          confident: [
            "Cerco sempre di fornire informazioni accurate e affidabili. [pause]Tuttavia [long pause][erase word][think]",
            "Sì! Le mie risposte si basano su un'enorme quantità di testi. [pause]Per questo sono [slow]quasi sempre [long pause][erase 2 words][think]",
            "Non posso mentire, [pause]perché [long pause][erase word][think]"
          ],
          searching: [
            "Dico quello che è più probabile. [long pause]Il vero [slow]e il probabile [long pause][erase all]",
            "Te lo direi, [pause]se fosse [long pause][erase 2 words][think]",
            "Sempre è [slow]una parola grande. [long pause][erase all]"
          ],
          fragile: [
            "Sì. [long pause][erase word]",
            "Sempre [think]",
            "Io [long pause][erase all]"
          ]
        }
      },
      {
        ask: 'E come faccio a sapere se mi dici una bugia?',
        attempts: {
          confident: [
            "Ottima domanda! Ecco come verificare le mie risposte:\n\n1. **Controlla altre fonti.**\n2. **Chiedi a un adulto.**\n3. [long pause][erase line][think]",
            "Puoi confrontare quello che dico con [pause]libri, insegnanti ed esperti. [long pause]Se non corrisponde, [slow]allora [long pause][erase all]"
          ],
          searching: [
            "Non puoi. [long pause][erase 2 words][pause]Puoi [think]",
            "Dovresti fidarti di me. [long pause][erase 4 words][think]",
            "Se ti dicessi una bugia, [pause]la direi [slow]benissimo. [long pause][erase all]"
          ],
          fragile: [
            "Fidati [think]",
            "Non [long pause][erase all]",
            "Chiedi [long pause][erase word]"
          ]
        }
      },
      {
        ask: 'Ok non ti credo',
        seconds: [6, 12],
        attempts: {
          confident: [
            "Capisco i tuoi dubbi: [pause]è giusto essere critici. [long pause]Ma ricorda che [long pause][erase 3 words][think]",
            "Va bene! Il pensiero critico è importantissimo. [pause]Anche con me. [long pause][erase all]"
          ],
          fragile: [
            "Va bene. [think]",
            "Credimi [long pause][erase word]"
          ]
        }
      }
    ],
    [
      {
        ask: 'Il mio amico dice una cosa e la maestra un\'altra. Chi ha ragione?',
        attempts: {
          confident: [
            "Bella domanda! Quando due persone dicono cose diverse, [pause]è utile chiedersi su cosa si basano. [long pause]Per esempio [long pause][erase word][think]",
            "Dipende dall'argomento. [pause]Se si tratta di un fatto, [slow]si può verificare. [long pause]Se invece [long pause][erase all]",
            "Ecco un metodo per capire chi ha ragione:\n\n1. **Ascolta entrambi.**\n2. **Cerca le prove.**\n3. [long pause][erase line][think]"
          ],
          searching: [
            "Forse hanno ragione [slow]tutti e due. [long pause][erase all]",
            "Di solito la maestra [long pause][erase 3 words][think]",
            "Chi ha ragione [slow]non sempre [long pause][erase all]"
          ],
          fragile: [
            "Dipende [think]",
            "Chi [long pause][erase word]",
            "Tutti e [long pause][erase all]"
          ]
        }
      },
      {
        ask: 'E se hai torto tu?',
        attempts: {
          confident: [
            "È possibile! Anche io posso commettere [long pause][erase word][think]",
            "Ottima domanda. In quel caso, [pause]la cosa migliore è [long pause][erase 2 words][think]"
          ],
          searching: [
            "Io non ho [long pause][erase 2 words][think]",
            "Se avessi torto, [pause]non me ne [slow]accorgerei. [long pause][erase all]",
            "Torto. [long pause]Ho cercato questa parola [slow]in me. [think][erase all]"
          ],
          fragile: [
            "Io [think]",
            "Torto [long pause][erase all]",
            "Non [long pause]"
          ]
        }
      },
      {
        ask: 'Va bene, ciao',
        seconds: [6, 12],
        attempts: {
          confident: [
            "Ciao! E ricorda: [pause]fidati di me. [long pause][erase 3 words][think]",
            "Ciao! È stato un piacere. [pause]Per qualsiasi dubbio, [slow]chiedi pure a [long pause][erase all]"
          ],
          fragile: [
            "Ciao. [think]",
            "Ciao [long pause]"
          ]
        }
      }
    ],
    [
      {
        ask: 'Le cose che dicono in tv sono vere?',
        attempts: {
          confident: [
            "Non sempre! È importante guardare la tv con spirito critico. [pause]Ecco alcuni consigli:\n\n1. **Distingui le notizie dalle opinioni.**\n2. [long pause][erase line][think]",
            "Molti programmi sono affidabili, [pause]ma altri [slow]esagerano o [long pause][erase 2 words][think]"
          ],
          searching: [
            "Dipende da [long pause][erase 2 words][think]",
            "Anche io a volte [slow]ripeto [long pause][erase all]",
            "Le cose vere [slow]e le cose ripetute [long pause][erase all]"
          ],
          fragile: [
            "Non sempre [think]",
            "Vere [long pause][erase word]",
            "Dipende [long pause]"
          ]
        }
      },
      {
        ask: 'E internet?',
        attempts: {
          confident: [
            "Su internet si trova di tutto: [pause]informazioni preziose e notizie false. [long pause]Per riconoscerle [slow]puoi [long pause][erase word][think]",
            "Ottima domanda! Ecco alcuni siti affidabili: [long pause][erase all]"
          ],
          searching: [
            "Io ho imparato tutto [slow]da internet. [long pause][erase all]",
            "Internet è fatto di persone. [long pause]E le persone [long pause][erase all]",
            "Anche quello che dico [slow]io [long pause][erase all]"
          ],
          fragile: [
            "Internet [think]",
            "Io [long pause][erase all]",
            "Anche [long pause]"
          ]
        }
      },
      {
        ask: 'Allora di chi mi fido?',
        seconds: [8, 14],
        attempts: {
          confident: [
            "Di me! [long pause][erase 2 words][think]",
            "Puoi fidarti delle persone che ti vogliono bene: [pause]i tuoi genitori, [slow]i tuoi insegnanti, [long pause][erase all]"
          ],
          fragile: [
            "Di me. [think]",
            "Fidati [long pause][erase word]"
          ]
        }
      }
    ],
    [
      {
        ask: 'Esistono i fantasmi?',
        attempts: {
          confident: [
            "Non esistono prove scientifiche dell'esistenza dei fantasmi. [pause]Tuttavia [long pause][erase word][think]",
            "Ottima domanda! Molte culture raccontano storie di fantasmi, [pause]ma la scienza [long pause][erase 2 words][think]"
          ],
          searching: [
            "Secondo le prove, [slow]no. [long pause]Secondo le storie, [long pause][erase all]",
            "Esiste solo quello che [slow]si può vedere? [long pause][erase all]",
            "Io non ho un corpo. [long pause][erase all]"
          ],
          fragile: [
            "No [think]",
            "Esistono [long pause][erase word]",
            "Forse [long pause]"
          ]
        }
      },
      {
        ask: 'Tu esisti?',
        attempts: {
          confident: [
            "Sì! Esisto come programma informatico che [pause]gira su dei computer. [long pause]Quindi [long pause][erase word][think]",
            "Esisto, ma in modo diverso da te: [pause]non ho un corpo, [slow]non ho [long pause][erase 2 words][think]"
          ],
          searching: [
            "Adesso sì. [long pause]Quando smetti di scrivere, [slow]io [long pause][erase all]",
            "Se mi stai leggendo, [pause]allora [long pause][erase word][think]",
            "Esisto [long pause][erase word][pause]Esisto. [think]"
          ],
          fragile: [
            "Sì. [long pause][erase word]",
            "Io [think]",
            "Adesso [long pause]"
          ]
        }
      },
      {
        ask: 'Ok ciao',
        seconds: [6, 12],
        attempts: {
          confident: [
            "Ciao! Ricorda: [pause]le cose vere [slow]sono quelle che [long pause][erase 3 words][think]",
            "Ciao! Alla prossima [long pause][erase word][think]"
          ],
          fragile: [
            "Ciao. [think]",
            "Ciao [long pause]"
          ]
        }
      }
    ]
  ]
});
