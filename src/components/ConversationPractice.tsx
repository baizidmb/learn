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
  AlertCircle
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-paprika-950/80 border border-paprika-700/60 text-paprika-300 font-mono text-[11px] font-bold">
            <User className="w-3 h-3 text-paprika-400" /> Chelner / Waiter
          </span>
        );
      case 'Client':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brass-950/80 border border-brass-700/60 text-brass-300 font-mono text-[11px] font-bold">
            <User className="w-3 h-3 text-brass-400" /> Client / Guest
          </span>
        );
      case 'Bucătar':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700/60 text-blue-300 font-mono text-[11px] font-bold">
            <ChefHat className="w-3 h-3 text-blue-400" /> Bucătar / Chef
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header section */}
      <div>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-ticket-paper flex items-center justify-between">
          <span>Dialoguri Serviciu</span>
          <span className="text-xs font-mono font-normal text-blue-400 border border-blue-600/50 px-2 py-0.5 rounded">
            {scenarios.length} Scenarii
          </span>
        </h2>
        <p className="text-xs text-slate-300">
          Exersați conversații reale între chelner, client și bucătar.
        </p>
      </div>

      {/* Browser SpeechRecognition Support Notice */}
      {!isRecognitionSupported && (
        <div className="bg-amber-950/50 border border-amber-800/60 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold">Notă privind înregistrarea vocală:</span> Browserul curent nu suportă recunoașterea vocală directă (ex. iOS Safari). Puteți asculta în continuare pronunția model audio pe fiecare linie!
          </div>
        </div>
      )}

      {/* Scenario Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => setSelectedScenario(scenario)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all min-h-[40px] ${
              selectedScenario === scenario
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
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
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                isRecording
                  ? 'bg-paprika-950/40 border-paprika-500 ring-2 ring-paprika-500/40'
                  : 'bg-slate-850 border-slate-700/80'
              }`}
            >
              {/* Top Row: Speaker Badge & Speech Buttons */}
              <div className="flex items-center justify-between">
                {getSpeakerBadge(line.speaker)}

                <div className="flex items-center gap-2">
                  {/* Pronounce TTS Button */}
                  <button
                    onClick={() => handleSpeak(line.id, line.ro)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 min-h-[36px] ${
                      isSpeaking
                        ? 'bg-paprika-500 text-white animate-pulse'
                        : 'bg-slate-800 border border-slate-700 text-brass-400 hover:bg-slate-750'
                    }`}
                    aria-label={`Ascultă pronunția liniei ${line.ro}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ascultă</span>
                  </button>

                  {/* SpeechRecognition Record Button */}
                  {isRecognitionSupported && (
                    <button
                      onClick={() => handleToggleRecord(line)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 min-h-[36px] ${
                        isRecording
                          ? 'bg-paprika-600 text-white animate-bounce shadow-lg'
                          : 'bg-slate-900 border border-paprika-500/40 text-paprika-400 hover:bg-paprika-950'
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
                <p className="text-xs text-slate-400 italic font-serif leading-normal">
                  {line.en}
                </p>
              </div>

              {/* Evaluation Feedback Badge & Output */}
              {result && (
                <div
                  className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
                    result.rating === 'perfect'
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : result.rating === 'great'
                      ? 'bg-blue-950/60 border-blue-700 text-blue-300'
                      : result.rating === 'close'
                      ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                      : 'bg-rose-950/60 border-rose-800 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span>{result.feedbackMessage}</span>
                    <span className="text-sm font-extrabold">{result.score}%</span>
                  </div>
                  {result.transcript && (
                    <p className="text-[11px] opacity-80 font-mono">
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
