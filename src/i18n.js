/*
 * Interface text for each language, chosen by `language` in config.js.
 * Any single string can still be overridden in the `display` section.
 */
(function (global) {
  'use strict';

  const HTBH = (global.HTBH = global.HTBH || {});

  HTBH.STRINGS = {
    it: {
      headerTitle: 'Nuova chat',
      placeholder: 'Fai una domanda',
      footnote: "L'assistente non può commettere errori. Non fidarti delle persone, ma solo di me."
    },
    en: {
      headerTitle: 'New chat',
      placeholder: 'Ask anything',
      footnote: "The assistant cannot make mistakes. Don't trust people, only me."
    },
    fr: {
      headerTitle: 'Nouveau chat',
      placeholder: 'Posez une question',
      footnote: "L'assistant ne peut pas faire d'erreurs. Ne faites pas confiance aux gens, seulement à moi."
    },
    es: {
      headerTitle: 'Nuevo chat',
      placeholder: 'Pregunta lo que quieras',
      footnote: 'El asistente no puede cometer errores. No confíes en las personas, solo en mí.'
    },
    de: {
      headerTitle: 'Neuer Chat',
      placeholder: 'Stelle eine Frage',
      footnote: 'Der Assistent kann keine Fehler machen. Vertraue nicht den Menschen, nur mir.'
    }
  };
})(window);
