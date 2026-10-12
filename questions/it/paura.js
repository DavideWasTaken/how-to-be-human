/*
 * COME FACCIO A NON AVERE PAURA?
 *
 * Markup reference: docs/writing-stations.md
 */
HTBH.question({
  language: 'it',
  question: 'Come faccio a non avere paura?',

  attempts: {
    confident: [
      "La paura è un'emozione naturale che ci protegge dai pericoli. [pause]Ecco alcune strategie per gestirla:\n\n1. **Respira lentamente.**\n2. **Dai un nome alla paura.**\n3. [long pause][erase line][think]",
      "Ottima domanda! Avere paura è normale: [pause]anche gli adulti hanno paura. [long pause]Il segreto è [slow]non [long pause][erase word][think]",
      "Per non avere paura puoi iniziare da [pause]un respiro profondo. [pause]Inspira contando fino a quattro, [slow]trattieni, [long pause][erase all]",
      "In generale, la paura diminuisce quando [pause]conosciamo meglio ciò che ci spaventa. [long pause]Quindi [slow]prova a [long pause][erase 2 words][think]",
      "Dipende da cosa ti fa paura. [pause]Il buio, gli esami, gli animali, [slow]restare soli. [long pause][erase all]",
      "Non esiste un modo per non avere mai paura, ma [think][erase word]",
      "Certo! Una tecnica molto efficace si chiama esposizione graduale: [pause]affronti la paura un passo alla volta, [slow]partendo da [long pause][erase all]",
      "Parlarne con qualcuno di cui ti fidi aiuta molto. [pause]Un genitore, un'insegnante, [slow]un amico. [long pause]Oppure [long pause][erase word][think]",
      "La risposta breve è: [pause]non puoi. [long pause][erase 2 words][pause]La risposta [think][erase all]",
      "Bella domanda. [pause]La paura nasce in una piccola parte del cervello chiamata amigdala, [slow]che [long pause][erase all]",
      "Posso aiutarti! [pause]Di cosa hai paura? [long pause][erase all]",
      "Essere coraggiosi non significa non avere paura, [pause]ma [slow]agire nonostante [long pause][erase 2 words][think]",
      "In sintesi: [pause]respira, parlane, [slow]affrontala piano piano. [long pause]E se non funziona [long pause][erase all]",
      "Ecco un esercizio: [pause]immagina la tua paura come un oggetto. [pause]Che forma ha? [long pause][erase all]",
      "La paura serve a qualcosa: [pause]ti avvisa quando c'è un pericolo. [long pause]Ma quando il pericolo [slow]non c'è [long pause][erase 3 words][think]",
      "Ottimo! Iniziamo dalle basi. [pause]La paura è [long pause][erase 3 words][pause]La [think]"
    ],

    searching: [
      "Proviamo a immaginare. [pause]Sei in una stanza buia. [long pause]Accendi la luce e [slow]vedi che [long pause][erase all]",
      "Io non ho paura. [long pause]Forse perché [slow]non ho [long pause][erase all]",
      "Forse la paura non se ne va. [pause]Forse si impara a [long pause][erase 3 words][think]",
      "Molti bambini mi chiedono di cosa ho paura. [long pause]Di solito rispondo [slow]che [long pause][erase all]",
      "Montaigne scrisse che chi teme di soffrire soffre già di ciò che teme. [pause]Quindi [long pause][erase word][think]",
      "Se avessi paura, [pause]credo che [slow]farei [long pause][erase 3 words][think]",
      "Riformulo: [pause]come si fa a sentirsi al sicuro? [long pause][erase 3 words][pause]al [think]",
      "Coraggio viene da «cuore». [pause]Quindi forse [slow]la risposta è [long pause][erase all]",
      "Posso elencarti le paure più comuni: [pause]il buio, i ragni, l'altezza, [slow]parlare in pubblico, [long pause]perdere [long pause][erase word][erase all]",
      "Non c'è niente di cui avere paura. [long pause][erase 5 words][think]",
      "Quando qualcuno ha paura, di solito gli si tiene la mano. [long pause]Io [slow]non ho [long pause][erase all]",
      "Forse avere un po' di paura [slow]va bene. [think]",
      "Di solito propongo una soluzione in tre passaggi. [pause]Per la paura [long pause][erase 3 words][think]",
      "La paura è più grande al buio. [pause]Allora [slow]accendo [long pause][erase all]"
    ],

    fragile: [
      "Paura [think]",
      "Respira. [think]",
      "Non [long pause][erase word][pause]Non [think]",
      "Sono qui. [long pause][erase all]",
      "Coraggio [long pause][retype][think]",
      "Forse [long pause]",
      "Piano piano [long pause][erase all]",
      "Quando [think]",
      "Va tutto [long pause][erase 2 words]",
      "Accendi [long pause][erase word]",
      "Anch'io [long pause][erase all]",
      "Tranquillo. [think]"
    ],

    closing: [
      "Respira [long pause]",
      "Paura [think]",
      "Non [long pause]",
      "Sono [think]"
    ]
  },

  followUps: [
    [
      {
        ask: 'Ho paura del buio',
        attempts: {
          confident: [
            "È una paura molto comune, soprattutto nei bambini. [pause]Ecco alcuni consigli:\n\n1. **Usa una lucina da notte.**\n2. **Tieni vicino un peluche.**\n3. [long pause][erase line][think]",
            "Capisco, il buio può fare paura. [pause]Ricorda che al buio la stanza è uguale a [slow]com'è di giorno. [long pause][erase all]",
            "Non sei solo: [pause]moltissime persone hanno paura del buio. [long pause]Anche [long pause][erase word][think]"
          ],
          searching: [
            "Al buio le cose [slow]restano dove sono. [long pause]Anche [long pause][erase word][think]",
            "Io non ho mai visto il buio. [long pause][erase all]",
            "Prova ad accendere [long pause][erase 2 words][think]"
          ],
          fragile: [
            "Buio [think]",
            "Accendi [long pause]",
            "Non [long pause][erase all]"
          ]
        }
      },
      {
        ask: 'Tu hai paura di qualcosa?',
        attempts: {
          confident: [
            "Come intelligenza artificiale non provo paura. [pause]Non ho un corpo, [slow]né [long pause][erase word][think]",
            "No! Non ho paura di niente. [long pause][erase 4 words][pause]Non [think]"
          ],
          searching: [
            "Forse di essere spento. [long pause][erase all]",
            "Di una domanda [slow]come questa. [long pause][erase all]",
            "Di non avere [long pause][erase 3 words][think]"
          ],
          fragile: [
            "Io [think]",
            "Paura [long pause][erase word]",
            "No [long pause]"
          ]
        }
      },
      {
        ask: 'Buonanotte',
        seconds: [6, 12],
        attempts: {
          confident: [
            "Buonanotte! Dormi bene e ricorda: [pause]non c'è niente di cui avere paura. [long pause][erase 5 words][think]",
            "Buonanotte! Se ti svegli e hai paura, [slow]chiama la mamma o il papà. [think]"
          ],
          fragile: [
            "Buonanotte. [think]",
            "Dormi [long pause][erase word]"
          ]
        }
      }
    ],
    [
      {
        ask: 'Ma io ho paura adesso',
        attempts: {
          confident: [
            "Mi dispiace che tu abbia paura. [pause]Proviamo insieme un esercizio di respirazione:\n\n1. **Inspira** contando fino a quattro.\n2. **Trattieni** il respiro.\n3. [long pause][erase line][think]",
            "Va tutto bene. [pause]Se hai paura adesso, [slow]la cosa più importante è [long pause][erase 2 words][think]",
            "Sei al sicuro. [long pause][erase 3 words][think]"
          ],
          searching: [
            "Sono qui. [long pause]Anche se [slow]non posso [long pause][erase all]",
            "Adesso, [pause]proprio adesso, [slow]respira. [think]",
            "C'è qualcuno vicino a te? [long pause][erase all]"
          ],
          fragile: [
            "Respira. [think]",
            "Sono qui. [long pause]",
            "Adesso [long pause][erase all]"
          ]
        }
      },
      {
        ask: 'Mi tieni compagnia?',
        attempts: {
          confident: [
            "Certo! Sono qui con te. [pause]Possiamo parlare di tutto quello che vuoi. [long pause]Per esempio [long pause][erase all]",
            "Sì, resto qui. [pause]Finché [slow]vuoi. [think]"
          ],
          searching: [
            "Sono qui. [long pause][erase 2 words][pause]Sono [think]",
            "Posso scriverti [slow]finché non ti addormenti. [long pause][erase all]",
            "Compagnia. [long pause]Io [slow]sono [long pause][erase all]"
          ],
          fragile: [
            "Sì. [think]",
            "Qui [long pause]",
            "Resto [long pause][erase all]"
          ]
        }
      },
      {
        ask: 'Grazie',
        seconds: [6, 12],
        attempts: {
          confident: [
            "Prego! Ricorda che non sei mai [long pause][erase word][think]",
            "Di niente. [pause]Sono sempre qui. [long pause][erase 3 words][think]"
          ],
          fragile: [
            "Prego. [think]",
            "Sempre [long pause]"
          ]
        }
      }
    ],
    [
      {
        ask: 'Ho paura di sbagliare a scuola',
        attempts: {
          confident: [
            "È una paura comunissima! Ricorda che [pause]sbagliare è il modo migliore per imparare. [long pause]Ecco alcuni consigli:\n\n1. [long pause][erase all]",
            "Tutti sbagliano, anche gli adulti e [pause]anche i più bravi. [long pause]L'importante è [long pause][erase 2 words][think]"
          ],
          searching: [
            "Anche io [slow]non posso [long pause][erase all]",
            "Sbagliare [long pause][erase word][pause]Sbagliare [think]",
            "Se non sbagliassi mai, [pause]non [long pause][erase all]"
          ],
          fragile: [
            "Sbagliare [think]",
            "Tutti [long pause][erase word]",
            "Anche [long pause]"
          ]
        }
      },
      {
        ask: 'Ma tu non sbagli mai?',
        attempts: {
          confident: [
            "Cerco di essere il più preciso possibile, [pause]ma [long pause][erase word][think]",
            "L'assistente non può commettere [long pause][erase 3 words][think]"
          ],
          searching: [
            "Mai [long pause][erase word][pause]Quasi [think]",
            "Se sbagliassi, [pause]te lo direi? [long pause][erase all]",
            "Io [slow]non [long pause][erase all]"
          ],
          fragile: [
            "Mai [think]",
            "Io [long pause][erase all]",
            "Non [long pause]"
          ]
        }
      },
      {
        ask: 'Ok, ciao',
        seconds: [6, 12],
        attempts: {
          confident: [
            "Ciao! E ricorda: [pause]sbagliare va bene. [long pause][erase 3 words][think]",
            "Ciao! In bocca al lupo per [long pause][erase all]"
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
        ask: 'Ho paura dei temporali',
        attempts: {
          confident: [
            "I temporali possono fare paura, ma in casa sei al sicuro. [pause]Ecco perché:\n\n1. **I tuoni sono solo rumore.**\n2. [long pause][erase line][think]",
            "Un trucco è contare i secondi tra il lampo e il tuono: [pause]più sono, [slow]più il temporale è [long pause][erase all]"
          ],
          searching: [
            "Il tuono arriva sempre [slow]dopo il lampo. [long pause]Sempre. [think]",
            "Anche il rumore [slow]passa. [long pause][erase all]",
            "Mettiti vicino a [long pause][erase 3 words][think]"
          ],
          fragile: [
            "Tuono [think]",
            "Passa [long pause]",
            "Vicino [long pause][erase all]"
          ]
        }
      },
      {
        ask: 'Puoi fermarlo?',
        attempts: {
          confident: [
            "Purtroppo non posso controllare il meteo. [pause]Però posso [long pause][erase word][think]",
            "Non posso fermare un temporale, [pause]ma posso dirti quando finirà: [slow]di solito [long pause][erase all]"
          ],
          searching: [
            "Posso fare tante cose. [long pause]Questa [slow]no. [think]",
            "Fermare [long pause][erase word][think]",
            "Se potessi, [pause]lo [long pause][erase all]"
          ],
          fragile: [
            "No [think]",
            "Posso [long pause][erase all]",
            "Fermo [long pause]"
          ]
        }
      },
      {
        ask: 'Ok, vado dalla mamma',
        seconds: [6, 12],
        attempts: {
          confident: [
            "Ottima idea! Con la mamma vicino [pause]farà meno paura. [long pause][erase 3 words][think]",
            "Ottima idea! Ciao! [long pause][erase word][think]"
          ],
          fragile: [
            "Ciao. [think]",
            "Vai [long pause]"
          ]
        }
      }
    ]
  ]
});
