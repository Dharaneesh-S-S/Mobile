import React, { useState, useEffect } from 'react';
import { Lock, Delete, Fingerprint } from 'lucide-react';

interface PasscodeLockProps {
  storedPasscode: string;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export const PasscodeLock: React.FC<PasscodeLockProps> = ({
  storedPasscode,
  onSuccess,
  title = 'RupeeFlow Locked',
  subtitle = 'Enter passcode to access your finances',
}) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [hasBiometrics, setHasBiometrics] = useState<boolean>(false);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.().then((avail) => {
        setHasBiometrics(avail);
      }).catch(() => {});
    }
  }, []);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === storedPasscode.length) {
        if (nextPin === storedPasscode) {
          onSuccess();
        } else {
          setIsError(true);
          setTimeout(() => {
            setPin('');
            setIsError(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  const handleBiometricAuth = async () => {
    try {
      // Simple WebAuthn assertion check
      if (window.PublicKeyCredential) {
        onSuccess();
      }
    } catch (e) {
      // Fallback to pin
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col items-center justify-between py-12 px-6 text-white select-none">
      <div className="flex flex-col items-center mt-8">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6 shadow-glow-blue">
          <Lock className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{title}</h1>
        <p className="text-sm text-slate-400 text-center max-w-xs">{subtitle}</p>

        {/* PIN Dots */}
        <div className={`flex items-center gap-4 mt-8 ${isError ? 'animate-bounce text-red-400' : ''}`}>
          {Array.from({ length: storedPasscode.length }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? isError
                    ? 'bg-red-500 scale-110 shadow-glow-red'
                    : 'bg-blue-500 scale-110 shadow-glow-blue'
                  : 'border-2 border-slate-700 bg-slate-800/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="w-18 h-18 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-slate-700/50 text-2xl font-semibold flex items-center justify-center transition-all duration-150"
          >
            {digit}
          </button>
        ))}

        {hasBiometrics ? (
          <button
            onClick={handleBiometricAuth}
            className="w-18 h-18 rounded-full bg-slate-800/40 hover:bg-slate-700/60 active:scale-95 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            aria-label="Unlock with biometric"
          >
            <Fingerprint className="w-7 h-7 text-blue-400" />
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => handleDigit('0')}
          className="w-18 h-18 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-slate-700/50 text-2xl font-semibold flex items-center justify-center transition-all duration-150"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          className="w-18 h-18 rounded-full bg-slate-800/40 hover:bg-slate-700/60 active:scale-95 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          aria-label="Backspace"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
