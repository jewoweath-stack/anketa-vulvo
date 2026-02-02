// src/App.tsx — Финальный вариант без предупреждения
import { useEffect, useState } from 'react';

// Глобальный Telegram WebApp (нативный, без внешних пакетов)
const telegramWebApp = (window as any).Telegram?.WebApp;

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    painLevel: 5,
    symptoms: '',
  });

  const totalSteps = 3;

  useEffect(() => {
    console.log('Приложение запущено');

    if (telegramWebApp) {
      console.log('Telegram WebApp найден — инициализация');

      try {
        telegramWebApp.ready();
        telegramWebApp.expand();

        const tgBackButton = telegramWebApp.BackButton;
        if (tgBackButton) {
          tgBackButton.show();

          tgBackButton.onClick(() => {
            console.log('Нажата кнопка Назад');
            if (step > 1) {
              setStep((prev) => prev - 1);
            } else {
              telegramWebApp.close();
            }
          });
        }
      } catch (err) {
        console.error('Ошибка Telegram WebApp:', err);
      }
    } else {
      console.warn('Telegram WebApp не найден — запуск вне Telegram');
      // alert убрали полностью — теперь просто лог в консоль
    }
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
    if (telegramWebApp) {
      telegramWebApp.sendData(JSON.stringify(formData));
      telegramWebApp.showAlert('Анкета отправлена! Спасибо!');
      telegramWebApp.close();
    } else {
      alert('Анкета готова!\n\n' + JSON.stringify(formData, null, 2));
    }
  };

  // Определяем тему из Telegram (если доступно)
  const isDark = telegramWebApp?.colorScheme === 'dark' || false;

  // Цвета
  const bgColor = isDark ? '#0f1621' : '#ffffff';
  const textColor = isDark ? '#e0e0e0' : '#000000';
  const accentColor = '#5288c1';
  const secondaryBg = isDark ? '#1c1c1e' : '#f5f5f5';
  const hintColor = '#888888';

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