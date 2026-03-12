import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'RSBK', short: '15%' },
  { label: 'Audit Klinis', short: '60%' },
  { label: 'PRM', short: '25%' },
];

export default function FormStepper({ currentStep }) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isComplete = currentStep > stepNum;
        const isActive = currentStep === stepNum;

        return (
          <div key={idx} className="flex items-center flex-1 last:flex-0">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isComplete
                    ? '#3b82f6'
                    : isActive
                    ? '#1e40af'
                    : '#1e293b',
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isComplete
                    ? 'border-primary-500'
                    : isActive
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                    : 'border-surface-700'
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-bold ${
                      isActive ? 'text-white' : 'text-surface-300'
                    }`}
                  >
                    {stepNum}
                  </span>
                )}
              </motion.div>
              <p
                className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                  isActive ? 'text-primary-400' : isComplete ? 'text-surface-300' : 'text-surface-300/50'
                }`}
              >
                {step.label}
              </p>
              <p className="text-[9px] text-surface-300/40">{step.short}</p>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="flex-1 mx-3 h-0.5 rounded-full bg-surface-700 relative overflow-hidden mt-[-20px]">
                <motion.div
                  initial={false}
                  animate={{ width: isComplete ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-primary-500 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
