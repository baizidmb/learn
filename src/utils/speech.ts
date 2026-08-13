import { SpeechEvalResult } from '../types';

// Web Speech Synthesis (TTS) Helper
export function speakText(text: string, lang: 'ro-RO' | 'en-US' = 'ro-RO', rate: number = 0.9, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  if (lang === 'ro-RO') {
    const roVoice = voices.find(v => v.lang.includes('ro') || v.name.toLowerCase().includes('romanian'));
    if (roVoice) {
      utterance.voice = roVoice;
    }
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

// Check SpeechRecognition browser support
export function isSpeechRecognitionSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

/**
 * Normalizes Romanian text for SpeechRecognition scoring:
 * - Lowercases and strips punctuation
 * - Folds Romanian diacritic variants (both comma-below ș/ț and cedilla ş/ţ):
 *   ă/â -> a, î -> i, ș/ş -> s, ț/ţ -> t
 */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip standard accents
    .replace(/[ăâ]/g, 'a')
    .replace(/î/g, 'i')
    .replace(/[șş]/g, 's')
    .replace(/[țţ]/g, 't')
    .replace(/[^\w\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein Distance algorithm for text similarity
export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Evaluates spoken text against target phrase using generous similarity matching (≥75% = good match).
 */
export function evaluateSpeechMatch(targetText: string, spokenText: string): SpeechEvalResult {
  const normTarget = normalizeText(targetText);
  const normSpoken = normalizeText(spokenText);

  if (!normSpoken) {
    return {
      transcript: spokenText || '(no speech detected)',
      score: 0,
      rating: 'retry',
      feedbackMessage: 'Nu s-a auzit clar. Încearcă din nou! (Nothing heard, try again!)'
    };
  }

  const maxLength = Math.max(normTarget.length, normSpoken.length);
  if (maxLength === 0) {
    return { transcript: spokenText, score: 100, rating: 'perfect', feedbackMessage: 'Excelent! Perfect!' };
  }

  const distance = calculateLevenshteinDistance(normTarget, normSpoken);
  const similarityRatio = Math.max(0, 1 - distance / maxLength);
  const score = Math.round(similarityRatio * 100);

  let rating: 'perfect' | 'great' | 'close' | 'retry' = 'retry';
  let feedbackMessage = '';

  // Generous speech practice thresholds
  if (score >= 85) {
    rating = 'perfect';
    feedbackMessage = 'Pronunție excelentă! 🎯 (Perfect pronunciation!)';
  } else if (score >= 75) {
    rating = 'great';
    feedbackMessage = 'Foarte bine! Te faci înțeles clar. 🌟 (Good match!)';
  } else if (score >= 50) {
    rating = 'close';
    feedbackMessage = 'Aproape! Mai încearcă o dată. 💡 (Close match!)';
  } else {
    rating = 'retry';
    feedbackMessage = 'Nu-i nimic, mai încearcă o dată! 🔄 (Try again!)';
  }

  return {
    transcript: spokenText,
    score,
    rating,
    feedbackMessage
  };
}

// Speech Recognition Manager class
export class SpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor(
    private onResultCallback: (result: SpeechEvalResult) => void,
    private onErrorCallback: (errMessage: string) => void,
    private onStateChangeCallback: (listening: boolean) => void
  ) {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'ro-RO';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStateChangeCallback(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStateChangeCallback(false);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        this.onStateChangeCallback(false);
        this.onErrorCallback(event.error || 'A apărut o eroare la înregistrare');
      };
    }
  }

  public startListening(targetPhrase: string) {
    if (!this.recognition) {
      this.onErrorCallback('Browserul nu suportă recunoașterea vocală.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      const evalResult = evaluateSpeechMatch(targetPhrase, spokenText);
      this.onResultCallback(evalResult);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error(e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
