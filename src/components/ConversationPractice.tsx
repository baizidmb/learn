import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { CONVERSATION_LINES } from '../data/conversationData';
import { ConversationLine, SpeechEvalResult } from '../types';
import { speakText, isSpeechRecognitionSupported, SpeechRecognizer } from '../utils/speech';
import { 
  Volume2, 
  Mic, 
  User, 
  ChefHat, 
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const ConversationPractice: React.FC = () => {
  const { speechRate, markAsKnownAndPromote } = useStore();
  const [selectedScenario, setSelectedScenario] = useState<string>('Întâmpinarea clienților');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Speech Practice State
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<{ [id: string]: SpeechEvalResult }>({});

  const isRecognitionSupported = isSpeechRecognitionSupported();
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  // Group scenarios
  const scenarios = Array.from(new Set(CONVERSATION_LINES.map((line) => line.scenario)));

  const currentLines = CONVERSATION_LINES.filter((line) => line.scenario === selectedScenario);

  useEffect(() => {
    recognizerRef.current = new SpeechRecognizer(
      (result) => {
        if (recordingId) {
          setEvalResult((prev) => ({ ...prev, [recordingId]: result }));
          if (result.score >= 75) {
            markAsKnownAndPromote(recordingId);
          }
        }
        setRecordingId(null);
      },
      (_err) => {
        setRecordingId(null);
      },
      (isListening) => {
        if (!isListening) setRecordingId(null);
      }
    );

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopListening();
      }
    };
  }, [recordingId]);

  const handleSpeak = (id: string, text: string) => {
    setActiveSpeakingId(id);
    speakText(text, 'ro-RO', speechRate, () => {
      setActiveSpeakingId(null);
    });
  };

  const handleToggleRecord = (line: ConversationLine) => {
    if (!isRecognitionSupported) {
      alert('Recunoașterea vocală nu este suportată pe acest browser. Puteți asculta în continuare pronunția model audio.');
      return;
    }

    if (recordingId === line.id) {
      recognizerRef.current?.stopListening();
      setRecordingId(null);
    } else {
      setRecordingId(line.id);
      recognizerRef.current?.startListening(line.ro);
    }
  };

  const getSpeakerBadge = (speaker: ConversationLine['speaker']) => {
    switch (speaker) {
      case 'Chelner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-copper-950/80 border border-copper-700/60 text-copper-300 font-mono text-[11px] font-bold shadow-sm">
            <User className="w-3 h-3 text-copper-400" /> Chelner / Waiter
          </span>
        );
      case 'Client':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-champagne-950/80 border border-champagne-700/60 text-champagne-300 font-mono text-[11px] font-bold shadow-sm">
            <User className="w-3 h-3 text-champagne-400" /> Client / Guest
          </span>
        );
      case 'Bucătar':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-300 font-mono text-[11px] font-bold shadow-sm">
            <ChefHat className="w-3 h-3 text-blue-400" /> Bucătar / Chef
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header section */}
      <div>
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-wider text-ticket-paper flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>Dialoguri & Colegi</span>
            <Briefcase className="w-5 h-5 text-copper-400" />
          </span>
          <span className="text-xs font-mono font-bold text-blue-400 border border-blue-600/50 bg-blue-950/60 px-2.5 py-1 rounded-full shadow-sm">
            {scenarios.length} Scenarii
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Exersați conversații reale între chelner, client, bucătar & colegi de muncă.
        </p>
      </div>

      {/* Browser SpeechRecognition Support Notice */}
      {!isRecognitionSupported && (
        <div className="bg-amber-950/50 border border-amber-800/60 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold">Notă privind înregistrarea vocală:</span> Browserul curent nu suportă recunoașterea vocală directă (ex. iOS Safari). Puteți asculta în continuare pronunția model audio pe fiecare linie!
          </div>
        </div>
      )}

      {/* Scenario Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => setSelectedScenario(scenario)}
            className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all min-h-[40px] ${
              selectedScenario === scenario
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md'
                : 'bg-ember-850 text-slate-300 hover:bg-ember-800 border border-ember-700'
            }`}
            aria-label={`Selectează scenariul ${scenario}`}
          >
            {scenario}
          </button>
        ))}
      </div>

      {/* Dialogue Lines View */}
      <div className="space-y-4">
        {currentLines.map((line) => {
          const isSpeaking = activeSpeakingId === line.id;
          const isRecording = recordingId === line.id;
          const result = evalResult[line.id];

          return (
            <div
              key={line.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 shadow-md ${
                isRecording
                  ? 'bg-copper-950/40 border-copper-500 ring-2 ring-copper-500/40'
                  : 'bg-ember-850 border-ember-700/90 hover:border-ember-600'
              }`}
            >
              {/* Top Row: Speaker Badge & Speech Buttons */}
              <div className="flex items-center justify-between">
                {getSpeakerBadge(line.speaker)}

                <div className="flex items-center gap-2">
                  {/* Pronounce TTS Button */}
                  <button
                    onClick={() => handleSpeak(line.id, line.ro)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 min-h-[38px] ${
                      isSpeaking
                        ? 'bg-copper-500 text-white animate-pulse shadow-md'
                        : 'bg-ember-900 border border-ember-700 text-champagne-400 hover:bg-ember-800'
                    }`}
                    aria-label={`Ascultă pronunția liniei ${line.ro}`}
                  >
                    {isSpeaking ? (
                      <div className="flex items-center gap-0.5 h-3.5">
                        <span className="w-1 bg-white animate-soundwave-1 rounded-full" />
                        <span className="w-1 bg-white animate-soundwave-2 rounded-full" />
                        <span className="w-1 bg-white animate-soundwave-3 rounded-full" />
                      </div>
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>Ascultă</span>
                  </button>

                  {/* SpeechRecognition Record Button */}
                  {isRecognitionSupported && (
                    <button
                      onClick={() => handleToggleRecord(line)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 min-h-[38px] ${
                        isRecording
                          ? 'bg-copper-600 text-white animate-bounce shadow-lg'
                          : 'bg-ember-950 border border-copper-500/50 text-copper-400 hover:bg-copper-950'
                      }`}
                      aria-label={isRecording ? 'Oprește înregistrarea vocală' : 'Înregistrează vocea pentru exersare'}
                    >
                      <Mic className={`w-3.5 h-3.5 ${isRecording ? 'animate-pulse' : ''}`} />
                      <span>{isRecording ? 'Vorbește acum...' : 'Exersează'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* RO & EN Phrases */}
              <div className="space-y-1">
                <p className="text-base font-bold text-ticket-paper leading-snug font-sans">
                  {line.ro}
                </p>
                <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                  {line.en}
                </p>
              </div>

              {/* Evaluation Feedback Badge & Output */}
              {result && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all shadow-inner ${
                    result.rating === 'perfect'
                      ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                      : result.rating === 'great'
                      ? 'bg-blue-950/70 border-blue-700 text-blue-300'
                      : result.rating === 'close'
                      ? 'bg-amber-950/70 border-amber-700 text-amber-300'
                      : 'bg-rose-950/70 border-rose-800 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span>{result.feedbackMessage}</span>
                    <span className="text-sm font-extrabold">{result.score}%</span>
                  </div>
                  {result.transcript && (
                    <p className="text-[11px] opacity-85 font-mono">
                      Ai spus: "{result.transcript}"
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
