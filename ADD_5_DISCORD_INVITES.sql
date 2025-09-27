-- 🚀 БЫСТРОЕ ДОБАВЛЕНИЕ 5 DISCORD ИНВАЙТОВ
-- Замените коды инвайтов на реальные коды из Discord

INSERT INTO public.invites_pool (code, invite_url) 
VALUES 
    ('INVITE_001', 'https://discord.gg/INVITE_001'),
    ('INVITE_002', 'https://discord.gg/INVITE_002'),
    ('INVITE_003', 'https://discord.gg/INVITE_003'),
    ('INVITE_004', 'https://discord.gg/INVITE_004'),
    ('INVITE_005', 'https://discord.gg/INVITE_005')
ON CONFLICT (code) DO NOTHING;

-- Проверить результат:
-- SELECT COUNT(*) as total_available FROM public.invites_pool WHERE used_at IS NULL;

-- 📝 ИНСТРУКЦИЯ:
-- 1. Замените INVITE_001, INVITE_002, и т.д. на реальные коды Discord инвайтов
-- 2. Убедитесь, что инвайты созданы в Discord и действительны
-- 3. Выполните этот скрипт в Supabase SQL Editor
-- 4. Проверьте результат запросом выше