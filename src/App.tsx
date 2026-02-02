// src/App.tsx — Анкета с 18 вопросами + отправка в чат -5127067703
import { useEffect, useState } from 'react';

// Глобальный Telegram WebApp
const telegramWebApp = (window as any).Telegram?.WebApp;

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    maritalStatus: '',
    cityTimezone: '',
    contact: '',
    symptomsDuration: '',
    vulvaSymptoms: '',
    urinationSymptoms: '',
    painConstant: '',
    painDuringSleep: '',
    painSitting: '',
    painPsychoLink: '',
    treatmentsTried: '',
    treatmentEffect: '',
    diagnosis: '',
    lifeImpact: '',
    desiredResults: '',
    additionalInfo: '',
  });

  const totalSteps = 18;

  useEffect(() => {
    if (telegramWebApp) {
      try {
        telegramWebApp.ready();
        telegramWebApp.expand();

        const tgBackButton = telegramWebApp.BackButton;
        if (tgBackButton) {
          tgBackButton.show();

          tgBackButton.onClick(() => {
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
    }
  }, [step]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitForm = () => {
    if (telegramWebApp) {
      // Отправляем данные боту
      telegramWebApp.sendData(JSON.stringify(formData));
      telegramWebApp.showAlert('Анкета отправлена! Спасибо!');
      telegramWebApp.close();
    } else {
      // Для теста на компьютере
      alert('Анкета готова!\n\n' + JSON.stringify(formData, null, 2));
    }
  };

  // Тема из Telegram или fallback
  const isDark = telegramWebApp?.colorScheme === 'dark' || false;
  const bgColor = isDark ? '#0f1621' : '#ffffff';
  const textColor = isDark ? '#e0e0e0' : '#000000';
  const accentColor = '#5288c1';
  const secondaryBg = isDark ? '#1c1c1e' : '#f5f5f5';
  const hintColor = '#888888';

  const questions = [
    { label: '1. Как Вас зовут?', field: 'name', type: 'text', placeholder: 'Ваше имя' },
    { label: '2. Ваш возраст', field: 'age', type: 'number', placeholder: 'Например: 32' },
    {
      label: '3. Семейное положение',
      field: 'maritalStatus',
      type: 'select',
      options: ['Замужем', 'В отношениях', 'Свободна'],
    },
    { label: '4. Ваш город и часовой пояс по отношению к Москве', field: 'cityTimezone', type: 'text', placeholder: 'Например: Екатеринбург, +2' },
    { label: '5. Контакт для связи', field: 'contact', type: 'text', placeholder: '@username или телефон' },
    { label: '6. Как давно Вы ощущаете симптомы', field: 'symptomsDuration', type: 'text', placeholder: 'Например: 2 года' },
    {
      label: '7. Какие симптомы в области вульвы/влагалища вас беспокоят?',
      field: 'vulvaSymptoms',
      type: 'textarea',
      placeholder: 'Жжение и зуд вульвы; Боль вульвы; Ощущение поврежденной слизистой; Гипер чувствительный клитор; Ощущение жжения как при молочнице и рецидивирующая молочница; Жалоб в области вульвы нет; Другое',
    },
    {
      label: '8. Какие симптомы при мочеиспускании вас беспокоят?',
      field: 'urinationSymptoms',
      type: 'textarea',
      placeholder: 'Зуд и жжение в уретре; Жжение при мочеиспускании; Циститные ощущения и рецидивирующие циститы; Ложные позывы к мочеиспусканию; Чувство неопрожненного мочевого пузыря; Задержка при мочеиспускании; Жалоб при мочеиспускании нет; Другое',
    },
    {
      label: '9. Боль носит постоянный характер?',
      field: 'painConstant',
      type: 'select',
      options: [
        'Да, болит постоянно, просто с разной интенсивностью',
        'Болит только во время полового акта',
        'Болит только если прикасаться или давить',
        'Другое',
      ],
    },
    {
      label: '10. Есть боль во время сна?',
      field: 'painDuringSleep',
      type: 'select',
      options: ['Да', 'Нет', 'Обычно нет, но в период обострения боль может мешать даже во сне'],
    },
    {
      label: '11. Усиливается в положении сидя?',
      field: 'painSitting',
      type: 'select',
      options: ['Да', 'Нет'],
    },
    {
      label: '12. Замечаете взаимосвязь боли и психологического состояния?',
      field: 'painPsychoLink',
      type: 'select',
      options: ['Да, взаимосвязь есть', 'Нет, не сказала бы', 'Другое'],
    },
    {
      label: '13. Какие варианты лечения пробовали?',
      field: 'treatmentsTried',
      type: 'textarea',
      placeholder: 'Антибактериальные препараты; Противогрибковые; Антидепрессанты; Блокада полового нерва; Инъекции ботокса; Операции; Физиотерапия; Другое',
    },
    {
      label: '14. Был ли замечен значительный эффект от лечения?',
      field: 'treatmentEffect',
      type: 'select',
      options: ['Да', 'Нет', 'Другое'],
    },
    {
      label: '15. Доктора зафиксировали диагноз? Если да, то какой',
      field: 'diagnosis',
      type: 'textarea',
      placeholder: 'Вульводиния, вагинизм; Синдром хронической тазовой боли; Нейропатия полового нерва; Миофасциальный болевой синдром; Цисталгия; Диагноз не зафиксирован; Другое',
    },
    {
      label: '16. На каких сферах вашей жизни боль сказывается сильнее всего?',
      field: 'lifeImpact',
      type: 'textarea',
      placeholder: 'Не могу вести половую жизнь; Пропускаю работу/учебу; Не могу выполнять домашние дела; Боль наносит удар по всем сферам; Психологическое давление; Другое',
    },
    {
      label: '17. Каких результатов вы хотите достичь в первую очередь? С какими симптомами справиться?',
      field: 'desiredResults',
      type: 'textarea',
      placeholder: 'Напишите подробно...',
    },
    {
      label: '18. Напишите, если есть что-то, о чем мы вас не спросили, но вам хочется рассказать:',
      field: 'additionalInfo',
      type: 'textarea',
      placeholder: 'Ваши мысли...',
    },
  ];

  const currentQuestion = questions[step - 1];

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

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        {currentQuestion.label}
      </label>

      {currentQuestion.type === 'text' || currentQuestion.type === 'number' ? (
        <input
          type={currentQuestion.type}
          value={formData[currentQuestion.field as keyof typeof formData]}
          onChange={(e) => handleChange(currentQuestion.field as keyof typeof formData, e.target.value)}
          placeholder={currentQuestion.placeholder}
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
      ) : currentQuestion.type === 'select' ? (
        <select
          value={formData[currentQuestion.field as keyof typeof formData]}
          onChange={(e) => handleChange(currentQuestion.field as keyof typeof formData, e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: '17px',
            borderRadius: '12px',
            border: `1px solid ${hintColor}`,
            backgroundColor: secondaryBg,
            color: textColor,
          }}
        >
          <option value="">Выберите...</option>
          {currentQuestion.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <textarea
          value={formData[currentQuestion.field as keyof typeof formData]}
          onChange={(e) => handleChange(currentQuestion.field as keyof typeof formData, e.target.value)}
          placeholder={currentQuestion.placeholder}
          rows={currentQuestion.field.includes('additional') ? 8 : 5}
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
            Отправить анкету
          </button>
        )}
      </div>
    </div>
  );
}

export default App;