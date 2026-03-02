import { motion } from 'motion/react';
import { BugIcon } from './BugIcon';

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <div className="relative flex flex-col items-center justify-between h-full bg-[#0A0E1A] overflow-hidden px-6 py-10">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(#43D9BB 1px, transparent 1px), linear-gradient(90deg, #43D9BB 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}/>

      {/* Floating bug particles */}
      {[0, 1, 2, 3, 4].map((type) => (
        <motion.div
          key={type}
          className="absolute opacity-20"
          style={{ left: `${10 + type * 18}%`, top: `${15 + (type % 3) * 20}%` }}
          animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
          transition={{ duration: 3 + type * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BugIcon type={type} size={28} />
        </motion.div>
      ))}

      <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
        {/* Logo icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, #0D2420 0%, #0A0E1A 100%)', border: '2px solid #43D9BB44', boxShadow: '0 0 40px rgba(67,217,187,0.25)' }}>
            <BugIcon type={2} size={56} />
          </div>
          <motion.div
            className="absolute -inset-2 rounded-[28px]"
            style={{ border: '1.5px solid rgba(67,217,187,0.3)' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[#43D9BB] text-xs tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            — release panic —
          </p>
          <h1 className="text-white leading-none mb-1"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Bug Hunter
          </h1>
          <p className="text-[#6B7FA3] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            Match. Clear. Ship. Repeat.
          </p>
        </motion.div>

        {/* Bug showcase row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3"
        >
          {[0, 1, 2, 3, 4].map((type, i) => (
            <motion.div
              key={type}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: ['#071A16','#07111E','#1A0707','#1A1507','#0F071A'][type],
                border: `1.5px solid ${['#43D9BB','#4DA3FF','#FF4D4F','#FFD84D','#A96CFF'][type]}44`,
              }}
            >
              <BugIcon type={type} size={26} />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-6 px-6 py-4 rounded-2xl"
          style={{ background: 'rgba(14,22,48,0.8)', border: '1px solid #1E2D4E' }}
        >
          {[
            { label: 'Levels', value: '30' },
            { label: 'Bug Types', value: '5' },
            { label: 'Power-Ups', value: '4' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-white" style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1.2rem' }}>
                {value}
              </div>
              <div className="text-[#6B7FA3] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 w-full"
      >
        <motion.button
          onClick={onContinue}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl text-[#0A0E1A] relative overflow-hidden"
          style={{ background: '#43D9BB', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.02em' }}
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{ background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          />
          START HUNTING
        </motion.button>
        <p className="text-center text-[#3D4E6B] text-xs mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Swipe to match · Combo to score · Ship to win
        </p>
      </motion.div>
    </div>
  );
}
