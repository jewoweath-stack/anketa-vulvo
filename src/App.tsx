// src/App.tsx — Финальный вариант без ошибок TypeScript
import { useEffect, useState, useRef } from 'react';
import { init, miniApp as tmaMiniApp, themeParams as tmaThemeParams, backButton as tmaBackButton } from '@tma.js/sdk';

// Принудительно указываем тип any, чтобы TypeScript не ругался
const miniApp: any = tmaMiniApp;
const themeParams: any = tmaThemeParams;
const backButton: any = tmaBackButton;

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    painLevel: 5,
    symptoms: '',
  });

  const alertShown = useRef(false);

  const totalSteps = 3;

  useEffect(() => {
    console.log('App запущен');

    const initialize = () => {
      try {
        console.log('Инициализация SDK...');

        init();

        if (miniApp) {
          miniApp.ready?.();
          miniApp.expand?.();
          console.log('ready и expand вызваны');
        }

        if (backButton) {
          backButton.mount?.();
          backButton.show?.();
          console.log('backButton показан');

          backButton.on?.('click', () => {
            console.log('Нажата кнопка Назад');
            if (step > 1) {
              setStep((prev) => prev - 1);
            } else {
              miniApp?.close?.();
            }
          });
        }
      } catch (error) {
        console.error('Ошибка инициализации Mini App:', error);

        if (!alertShown.current) {
          alertShown.current = true;
          alert('Для полной работы откройте приложение внутри Telegram');
        }
      }
    };

    initialize();

    return () => {
      if (backButton) {
        backButton.hide?.();
      }
    };
  }, [step]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const submitForm = () => {
    try {
      console.log('Отправка данных:', formData);
      miniApp?.sendData?.(JSON.stringify(formData));
      miniApp?.showAlert?.('Анкета отправлена! Спасибо!');
      miniApp?.close?.();
    } catch (err) {
      console.warn('Отправка не удалась (не в Telegram?):', err);
      alert('Анкета готова!\n\n' + JSON.stringify(formData, null, 2));
    }
  };

  // Адаптация темы с полной защитой
  const isDark = themeParams?.isDark ?? false;
  const bgColor = themeParams?.bgColor ?? (isDark ? '#0f1621' : '#ffffff');
  const textColor = themeParams?.textColor ?? (isDark ? '#e0e0e0' : '#000000');
  const accentColor = themeParams?.buttonColor ?? '#5288c1';
  const secondaryBg = themeParams?.sectionBgColor ?? (isDark ? '#1c1c1e' : '#f5f5f5');
  const hintColor = themeParams?.hintColor ?? '#888888';

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px 16px',
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Прогресс-бар */}
      <div
        style={{
          height: '6px',
          backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          borderRadius: '3px',
          marginBottom: '24px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(step / totalSteps) * 100}%`,
            height: '100%',
            backgroundColor: accentColor,
            transition: 'width 0.35s ease-out',
          }}
        />
      </div>

      <h1 style={{ margin: '0 0 28px', fontSize: '24px', fontWeight: 600 }}>
        Анкета — шаг {step} из {totalSteps}
      </h1>

      {step === 1 && (
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Ваш возраст
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder="Например: 32"
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '17px',
              borderRadius: '12px',
              border: `1px solid ${hintColor}`,
              backgroundColor: secondaryBg,
              color: textColor,
              outline: 'none',
            }}
          />
        </div>
      )}

      {step === 2 && (
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
            Уровень боли сейчас (0–10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={formData.painLevel}
            onChange={(e) => handleChange('painLevel', Number(e.target.value))}
            style={{ width: '100%', marginBottom: '12px' }}
          />
          <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: 600 }}>
            {formData.painLevel}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Опишите основные симптомы
          </label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => handleChange('symptoms', e.target.value)}
            placeholder="Жжение, зуд, боль при сидении..."
            rows={5}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '17px',
              borderRadius: '12px',
              border: `1px solid ${hintColor}`,
              backgroundColor: secondaryBg,
              color: textColor,
              resize: 'vertical',
              minHeight: '120px',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '40px' }}>
        {step > 1 && (
          <button
            onClick={prevStep}
            style={{
              padding: '14px 28px',
              fontSize: '17px',
              fontWeight: 500,
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isDark ? '#2c2c2e' : '#e5e5ea',
              color: textColor,
              cursor: 'pointer',
            }}
          >
            Назад
          </button>
        )}

        {step < totalSteps ? (
          <button
            onClick={nextStep}
            style={{
              padding: '14px 36px',
              fontSize: '17px',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              backgroundColor: accentColor,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Далее
          </button>
        ) : (
          <button
            onClick={submitForm}
            style={{
              padding: '14px 36px',
              fontSize: '17px',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              backgroundColor: accentColor,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Отправить
          </button>
        )}
      </div>
    </div>
  );
}

export default App;