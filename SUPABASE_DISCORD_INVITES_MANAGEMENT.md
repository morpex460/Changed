# 🎮 УПРАВЛЕНИЕ DISCORD ИНВАЙТАМИ В SUPABASE

## 📋 Содержание
- [Просмотр состояния пула](#просмотр-состояния-пула)
- [Добавление новых инвайтов](#добавление-новых-инвайтов)
- [Удаление использованных инвайтов](#удаление-использованных-инвайтов)
- [Управление истекшими инвайтами](#управление-истекшими-инвайтами)
- [Полезные запросы для мониторинга](#полезные-запросы-для-мониторинга)

---

## 📊 Просмотр состояния пула

### Общая статистика
```sql
SELECT 
  COUNT(*) as total_invites,
  COUNT(*) FILTER (WHERE used_at IS NULL) as available_invites,
  COUNT(*) FILTER (WHERE used_at IS NOT NULL) as used_invites,
  COUNT(*) FILTER (WHERE expires_at IS NOT NULL AND expires_at < NOW()) as expired_invites
FROM public.invites_pool;
```

### Просмотр всех инвайтов
```sql
-- Все инвайты с информацией о статусе
SELECT 
  code,
  invite_url,
  CASE 
    WHEN used_at IS NOT NULL THEN '🔴 Использован'
    WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN '⏰ Истек'
    ELSE '✅ Доступен'
  END as status,
  used_by,
  used_at,
  expires_at,
  created_at
FROM public.invites_pool
ORDER BY created_at DESC;
```

### Только доступные инвайты
```sql
SELECT code, invite_url, created_at
FROM public.invites_pool 
WHERE used_at IS NULL 
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY expires_at NULLS LAST, created_at;
```

---

## ➕ Добавление новых инвайтов

### Добавить один инвайт
```sql
INSERT INTO public.invites_pool (code, invite_url) 
VALUES ('ABC123XYZ', 'https://discord.gg/ABC123XYZ')
ON CONFLICT (code) DO NOTHING;
```

### Добавить несколько инвайтов сразу
```sql
INSERT INTO public.invites_pool (code, invite_url) 
VALUES 
  ('DEF456ABC', 'https://discord.gg/DEF456ABC'),
  ('GHI789DEF', 'https://discord.gg/GHI789DEF'),
  ('JKL012GHI', 'https://discord.gg/JKL012GHI'),
  ('MNO345JKL', 'https://discord.gg/MNO345JKL'),
  ('PQR678MNO', 'https://discord.gg/PQR678MNO')
ON CONFLICT (code) DO NOTHING;
```

### Добавить инвайт с TTL (время жизни)
```sql
-- Инвайт истечет через 30 дней
INSERT INTO public.invites_pool (code, invite_url, expires_at) 
VALUES (
  'TEMP30DAYS', 
  'https://discord.gg/TEMP30DAYS',
  NOW() + INTERVAL '30 days'
)
ON CONFLICT (code) DO NOTHING;

-- Инвайт истечет через 7 дней
INSERT INTO public.invites_pool (code, invite_url, expires_at) 
VALUES (
  'WEEK7DAYS', 
  'https://discord.gg/WEEK7DAYS',
  NOW() + INTERVAL '7 days'
)
ON CONFLICT (code) DO NOTHING;
```

---

## 🗑️ Удаление использованных инвайтов

### Удалить все использованные инвайты
```sql
-- ⚠️ ВНИМАНИЕ: Это удалит ВСЮ историю использованных инвайтов!
DELETE FROM public.invites_pool 
WHERE used_at IS NOT NULL;
```

### Удалить использованные инвайты старше 30 дней
```sql
-- Более безопасный вариант - удаляем только старые записи
DELETE FROM public.invites_pool 
WHERE used_at IS NOT NULL 
  AND used_at < NOW() - INTERVAL '30 days';
```

### Удалить конкретный использованный инвайт
```sql
DELETE FROM public.invites_pool 
WHERE code = 'ABC123XYZ' AND used_at IS NOT NULL;
```

### Удалить истекшие инвайты
```sql
DELETE FROM public.invites_pool 
WHERE expires_at IS NOT NULL 
  AND expires_at < NOW();
```

---

## ⏰ Управление истекшими инвайтами

### Найти истекшие инвайты
```sql
SELECT code, invite_url, expires_at, used_at
FROM public.invites_pool 
WHERE expires_at IS NOT NULL 
  AND expires_at < NOW()
ORDER BY expires_at;
```

### Продлить срок действия инвайта
```sql
-- Продлить на 30 дней от текущего времени
UPDATE public.invites_pool 
SET expires_at = NOW() + INTERVAL '30 days'
WHERE code = 'ABC123XYZ';

-- Убрать ограничение по времени (сделать бессрочным)
UPDATE public.invites_pool 
SET expires_at = NULL
WHERE code = 'ABC123XYZ';
```

---

## 📈 Полезные запросы для мониторинга

### История использования по датам
```sql
SELECT 
  DATE(used_at) as date,
  COUNT(*) as invites_used
FROM public.invites_pool 
WHERE used_at IS NOT NULL
GROUP BY DATE(used_at)
ORDER BY date DESC
LIMIT 30;
```

### Топ пользователей по количеству использованных инвайтов
```sql
SELECT 
  used_by,
  COUNT(*) as invites_count,
  MIN(used_at) as first_invite,
  MAX(used_at) as last_invite
FROM public.invites_pool 
WHERE used_by IS NOT NULL
GROUP BY used_by
ORDER BY invites_count DESC;
```

### Инвайты, которые скоро истекут
```sql
SELECT 
  code,
  invite_url,
  expires_at,
  (expires_at - NOW()) as time_left
FROM public.invites_pool 
WHERE expires_at IS NOT NULL 
  AND expires_at > NOW()
  AND expires_at < NOW() + INTERVAL '7 days'
ORDER BY expires_at;
```

---

## 🔄 Автоматизация с помощью скриптов

### Скрипт для регулярной очистки (раз в месяц)
```sql
-- Создание функции для очистки старых записей
CREATE OR REPLACE FUNCTION cleanup_old_invites()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Удаляем использованные инвайты старше 90 дней
  DELETE FROM public.invites_pool 
  WHERE used_at IS NOT NULL 
    AND used_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Удаляем истекшие инвайты
  DELETE FROM public.invites_pool 
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
    
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Вызов функции очистки
SELECT cleanup_old_invites();
```

---

## 🚨 Важные замечания

### ⚠️ Безопасность
- **Всегда делайте бэкап** перед массовым удалением
- Используйте `ON CONFLICT (code) DO NOTHING` при добавлении инвайтов
- Не удаляйте использованные инвайты сразу - сохраняйте историю

### 📝 Рекомендации
1. **Регулярно проверяйте пул** - поддерживайте 10-50 свободных инвайтов
2. **Отслеживайте истекшие** - настройте уведомления для инвайтов с TTL
3. **Архивируйте историю** - экспортируйте старые записи перед удалением
4. **Мониторьте активность** - следите за частотой использования

### 🛠️ Быстрые команды

```sql
-- Быстро проверить статус
SELECT COUNT(*) as available FROM public.invites_pool WHERE used_at IS NULL;

-- Быстро добавить тестовый инвайт
INSERT INTO public.invites_pool (code, invite_url) VALUES ('TEST'.||extract(epoch from now()), 'https://discord.gg/TEST'||extract(epoch from now())) ON CONFLICT DO NOTHING;

-- Быстро очистить тестовые инвайты
DELETE FROM public.invites_pool WHERE code LIKE 'TEST%';
```

---

**📞 Поддержка:**
Если возникнут вопросы по управлению базой данных, обратитесь к документации Supabase или используйте SQL Editor в панели управления Supabase.