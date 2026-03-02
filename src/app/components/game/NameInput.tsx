import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, User } from 'lucide-react';

interface NameInputProps {
  onSubmit: (name: string) => void;
}

export function NameInput({ onSubmit }: NameInputProps) {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Enter your handle to begin'); return; }
    if (trimmed.length < 2) { setError('Minimum 2 characters'); return; }
    if (trimmed.length > 16) { setError('Maximum 16 characters'); return; }
    onSubmit(trimmed);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0A0E1A] px-6"
      style={{ fontFamily: 'Inter, sans-serif' }}>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#43D9BB 1px, transparent 1px), linear-gradient(90deg, #43D9BB 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}/>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: '#0F1629', border: '1.5px solid #1E2D4E' }}>
            <User size={28} color="#43D9BB" />
          </div>
          <h2 className="text-white mb-2" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Your Handle
          </h2>
          <p className="text-[#6B7FA3] text-sm">
            Who's hunting bugs today?
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200"
            style={{
              background: '#0F1629',
              border: `2px solid ${focused ? '#43D9BB' : error ? '#FF4D4F' : '#1E2D4E'}`,
              boxShadow: focused ? '0 0 20px rgba(67,217,187,0.12)' : 'none',
            }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#43D9BB', fontSize: '0.9rem' }}>
              {'>_'}
            </span>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={handleKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="enter_your_handle"
              maxLength={16}
              className="flex-1 bg-transparent outline-none text-white placeholder-[#3D4E6B]"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem' }}
              autoFocus
            />
            <span className="text-[#3D4E6B] text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {name.length}/16
            </span>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#FF4D4F] text-xs mt-2 pl-1"
            >
              ⚠ {error}
            </motion.p>
          )}
        </motion.div>

        {/* Submit button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleSubmit}
          whileTap={{ scale: 0.97 }}
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: name.trim() ? '#43D9BB' : '#1E2D4E',
            color: name.trim() ? '#0A0E1A' : '#3D4E6B',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
          }}
        >
          LET'S HUNT <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
