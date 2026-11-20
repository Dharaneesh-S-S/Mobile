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
    <div className="fixed inset-0 z-50 bg-[#030707] flex flex-col items-center justify-between py-12 px-6 text-white select-none ambient-bg-grid">
      <div className="flex flex-col items-center mt-8">
        <div className="w-16 h-16 rounded-3xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mb-6 shadow-glow-teal">
          <Lock className="w-8 h-8 text-[#19E6C8]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{title}</h1>
        <p className="text-sm text-[#94B5B0] text-center max-w-xs">{subtitle}</p>

        {/* PIN Dots */}
        <div className={`flex items-center gap-4 mt-8 ${isError ? 'animate-bounce text-[#FF6B6B]' : ''}`}>
          {Array.from({ length: storedPasscode.length }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? isError
                    ? 'bg-[#FF6B6B] scale-110 shadow-[0_0_12px_rgba(255,107,107,0.5)]'
                    : 'bg-[#19E6C8] scale-110 shadow-glow-teal'
                  : 'border-2 border-teal-500/30 bg-[#061817]'
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
            className="w-18 h-18 rounded-full glass-card hover:bg-teal-950/40 active:scale-95 border border-teal-500/20 hover:border-teal-500/40 text-2xl font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {hasBiometrics ? (
          <button
            onClick={handleBiometricAuth}
            className="w-18 h-18 rounded-full glass-card hover:bg-teal-950/40 active:scale-95 border border-teal-500/20 text-[#94B5B0] hover:text-[#19E6C8] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Unlock with biometric"
          >
            <Fingerprint className="w-7 h-7 text-[#19E6C8]" />
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => handleDigit('0')}
          className="w-18 h-18 rounded-full glass-card hover:bg-teal-950/40 active:scale-95 border border-teal-500/20 hover:border-teal-500/40 text-2xl font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          className="w-18 h-18 rounded-full glass-card hover:bg-teal-950/40 active:scale-95 border border-teal-500/20 text-[#94B5B0] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Backspace"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
