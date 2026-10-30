import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Unlock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const PrivacyLockModal = () => {
  const { isScreenLocked, unlockScreen, settings, updateSettings } = useApp();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isScreenLocked) {
      setPin(['', '', '', '']);
      setError('');
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isScreenLocked]);

  if (!isScreenLocked || !settings?.privacyPin) return null;

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit on 4th digit
    if (index === 3 && value) {
      const fullPin = newPin.join('');
      if (fullPin.length === 4) {
        verifyPin(fullPin);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'Enter') {
      verifyPin(pin.join(''));
    }
  };

  const verifyPin = (pinToTest) => {
    const success = unlockScreen(pinToTest);
    if (!success) {
      setError('Incorrect 4-digit PIN. Please try again.');
      setPin(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  const handleForgotPin = () => {
    const reset = window.confirm(
      'Reset Screen Lock PIN? This will temporarily remove your 4-digit PIN so you can access your dashboard.'
    );
    if (reset) {
      updateSettings({ privacyPin: '', screenLockTimeout: 0 });
      unlockScreen('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(2, 20, 14, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 420,
          width: '100%',
          padding: '2.25rem 2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(23, 100, 77, 0.35)',
        }}
      >
        {/* Lock Shield Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            border: '2px solid var(--primary)',
            boxShadow: '0 0 20px var(--primary-glow)',
          }}
        >
          <Lock size={28} />
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Screen Locked for Privacy
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
          Stealth mode active. Enter your 4-digit security PIN to resume viewing your coursework.
        </p>

        {/* 4 Digit PIN Boxes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[0, 1, 2, 3].map((idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={1}
              value={pin[idx]}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: 56,
                height: 62,
                fontSize: '1.75rem',
                fontWeight: 800,
                textAlign: 'center',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                border: pin[idx] ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxShadow: pin[idx] ? '0 0 12px var(--primary-glow)' : 'none',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>

        {/* Error Notice */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: 'var(--danger)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Unlock Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => verifyPin(pin.join(''))}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            <Unlock size={17} /> Unlock Dashboard
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem',
              }}
            >
              {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPin ? 'Hide PIN' : 'Show PIN'}</span>
            </button>

            <button
              type="button"
              onClick={handleForgotPin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '0.3rem',
              }}
            >
              Forgot PIN?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyLockModal;
