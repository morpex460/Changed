# Система одноразовых Discord-инвайтов

Безопасная система выдачи одноразовых Discord-инвайтов для криптовалютного веб-сайта YYPS Trade.

## Архитектура

### Backend (Supabase)
- **Edge Function**: `get-discord-invite`
- **База данных**: таблица `invites_pool` с функцией `allocate_invite`
- **Безопасность**: только service_role имеет доступ к пулу инвайтов

### Frontend (React)
- **Компонент**: `SuccessPage.tsx` с интегрированной системой инвайтов
- **Хук**: `useDiscordInvite` для управления состоянием
- **UX**: состояния загрузки, успеха, ошибок с пользовательскими сообщениями

## Развертывание на Netlify

### 1. Подготовка проекта

```bash
cd crypto_website_v2
pnpm install
pnpm run build
```

### 2. Настройка переменных окружения в Netlify

В панели управления Netlify:
**Site Settings > Environment Variables**

Добавить переменные:
```
VITE_SUPABASE_URL=https://opqwpbnwjfmxtddfbbfb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcXdwYm53amZteHRkZGZiYmZiIiwicm9sZUAnfVlub24iLCJpYXQiOjE3NTg3MTEyMjAsImV4cCI6MjA3NDI4NzIyMH0.Rq8xjiPd8EMswaIpUkWKmKrS1aRQy9b9xdDVTVwAKLc
```

### 3. Настройки сборки Netlify

**Build command**: `pnpm run build`
**Publish directory**: `dist`
**Node version**: `18`

### 4. Настройка переадресации для SPA

Создать файл `_redirects` в папке `public`:
```
/*    /index.html   200
```

## Edge Function Configuration

Edge Function `get-discord-invite` уже развернута в Supabase:
- **URL**: `https://opqwpbnwjfmxtddfbbfb.supabase.co/functions/v1/get-discord-invite`
- **Статус**: ACTIVE

Переменные окружения для Edge Function должны быть установлены в Supabase Dashboard:
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcXdwYm53amZteHRkZGZiYmZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODcxMTIyMCwiZXhwIjoyMDc0Mjg3MjIwfQ.SA_FUzO_fVQQRxLK94443pgMc3-zFPeq8nEkuWMQ20s
SUPABASE_URL=https://opqwpbnwjfmxtddfbbfb.supabase.co
```

## Использование

1. Пользователь завершает оплату и попадает на SuccessPage
2. В секции "Discord Access Ready" нажимает кнопку "Получить Discord Инвайт"
3. Frontend вызывает Edge Function `get-discord-invite`
4. Edge Function безопасно вызывает `allocate_invite` в базе данных
5. Пользователь получает одноразовую ссылку для Discord
6. После использования ссылка становится недоступной

## Безопасность

- ✅ Клиент не имеет прямого доступа к таблице `invites_pool`
- ✅ Только Edge Function с service_role может выдавать инвайты
- ✅ Каждая ссылка используется только один раз
- ✅ Proper error handling и user-friendly сообщения
- ✅ Состояния загрузки предотвращают множественные запросы

## Структура файлов

```
crypto_website_v2/
├── src/
│   ├── components/
│   │   └── SuccessPage.tsx          # Модифицированный компонент с Discord интеграцией
│   ├── hooks/
│   │   └── useDiscordInvite.tsx     # Хук для управления Discord инвайтами
│   └── lib/
│       └── supabase.ts              # Supabase клиент
├── supabase/
│   └── functions/
│       └── get-discord-invite/
│           └── index.ts             # Edge Function для выдачи инвайтов
├── .env.example                     # Пример переменных окружения
└── DISCORD_INVITES_README.md        # Эта документация
```

## Troubleshooting

### Ошибка "Нет доступных инвайтов в пуле"
- Проверьте наличие записей в таблице `invites_pool`
- Убедитесь что функция `allocate_invite` работает корректно
- Проверьте логи Edge Function в Supabase Dashboard

### Edge Function возвращает 500
- Проверьте переменные окружения в Supabase Dashboard
- Проверьте логи в Supabase Dashboard > Edge Functions > get-discord-invite
- Убедитесь что service_role key правильный и имеет доступ к таблице

### Frontend не может вызвать Edge Function
- Проверьте переменные окружения в Netlify
- Проверьте URL Supabase в настройках
- Убедитесь что anon key правильный

Для отладки включите логи в браузере (Developer Tools > Console).