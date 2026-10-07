/*
 * Interface text for each language. A station picks one with `language`,
 * and can still override any single string in its `display` section.
 */
(function (global) {
  'use strict';

  const HTBH = (global.HTBH = global.HTBH || {});

  HTBH.STRINGS = {
    it: {
      headerTitle: 'Nuova chat',
      placeholder: 'Fai una domanda',
      footnote: "L'assistente può commettere errori. Verifica le informazioni importanti."
    },
    en: {
      headerTitle: 'New chat',
      placeholder: 'Ask anything',
      footnote: 'The assistant can make mistakes. Check important info.'
    },
    fr: {
      headerTitle: 'Nouveau chat',
      placeholder: 'Posez une question',
      footnote: "L'assistant peut faire des erreurs. Vérifiez les informations importantes."
    },
    es: {
      headerTitle: 'Nuevo chat',
      placeholder: 'Pregunta lo que quieras',
      footnote: 'El asistente puede cometer errores. Verifica la información importante.'
    },
    de: {
      headerTitle: 'Neuer Chat',
      placeholder: 'Stelle eine Frage',
      footnote: 'Der Assistent kann Fehler machen. Überprüfe wichtige Informationen.'
    }
  };
})(window);
