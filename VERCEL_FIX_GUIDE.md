# Руководство по исправлению проблемы с маршрутизацией на Vercel

## Проблема
При обновлении страницы `/wallet` на Vercel сайт ломается, но при переходе через кнопки все работает нормально.

## Причина
Это типичная проблема с Single Page Application (SPA). Когда вы переходите по кнопкам, React Router обрабатывает маршрутизацию на клиенте. Но когда вы обновляете страницу, браузер отправляет HTTP запрос к серверу Vercel за URL `/wallet`, а сервер не знает об этом маршруте и возвращает 404.

## Решение

### Шаг 1: Обновленные файлы (уже сделано)

Я обновил следующие файлы:

1. **vercel.json** - добавлены параметры `buildCommand` и `outputDirectory`
2. **vite.config.ts** - добавлены настройки для production build

### Шаг 2: Настройка Vercel (в веб-интерфейсе)

1. Зайдите в настройки вашего проекта на Vercel (vercel.com)
2. Перейдите в раздел **Settings** → **General**
3. Убедитесь, что:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (или путь к папке crypto_website_v2, если вы загрузили весь zip)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Шаг 3: Переразвертывание

После обновления настроек:
1. Закоммитьте изменения в Git
2. Запушьте на GitHub/GitLab/Bitbucket
3. Vercel автоматически переразвернет проект

Или вручную:
```bash
vercel --prod
```

## Альтернативные варианты конфигурации

### Вариант 1: vercel.json с routes (для старых версий Vercel)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Вариант 2: vercel.json с cleanUrls

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Вариант 3: Минимальная конфигурация

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Проверка работы

После деплоя:
1. Откройте ваш сайт на Vercel
2. Перейдите на страницу `/wallet` через кнопку
3. Нажмите F5 (обновить страницу)
4. Страница должна загрузиться без ошибок

## Дополнительные проблемы

### Если проблема сохраняется:

1. **Проверьте консоль браузера** (F12):
   - Есть ли ошибки 404?
   - Загружаются ли все ресурсы (JS, CSS)?

2. **Проверьте логи Vercel**:
   - Зайдите в Deployments → последний деплой → Build Logs
   - Убедитесь, что build завершился успешно
   - Проверьте, что все файлы попали в dist/

3. **Проверьте структуру dist/**:
   - В папке dist/ должен быть index.html
   - Все ассеты должны быть в dist/assets/

4. **Попробуйте HashRouter** (временное решение):
   
   В файле `src/App.tsx` замените:
   ```tsx
   import { BrowserRouter as Router } from 'react-router-dom';
   ```
   
   На:
   ```tsx
   import { HashRouter as Router } from 'react-router-dom';
   ```
   
   При этом URLs будут выглядеть как `/#/wallet` вместо `/wallet`, но проблема с обновлением страницы исчезнет.

## Контактная информация для отладки

Если проблема сохраняется, предоставьте:
1. URL вашего проекта на Vercel
2. Логи из консоли браузера при обновлении страницы /wallet
3. Логи билда из Vercel

## Итоговые измененные файлы

1. `vercel.json` - обновлена конфигурация
2. `vite.config.ts` - добавлены настройки для production

Эти файлы уже готовы к использованию в вашем проекте.