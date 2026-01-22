# Инструкция по настройке Supabase

## Шаг 1: Создание аккаунта и проекта

1. Перейдите на https://supabase.com
2. Нажмите "Start your project" или "Sign up"
3. Войдите через GitHub (рекомендуется) или создайте аккаунт
4. Нажмите "New Project"
5. Заполните форму:
   - **Name**: `inventory-tracker` (или любое другое имя)
   - **Database Password**: создайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион
   - **Pricing Plan**: выберите "Free" (бесплатный план)
6. Нажмите "Create new project"
7. Подождите 1-2 минуты, пока проект создается

## Шаг 2: Получение API ключей

1. После создания проекта откройте **Settings** (шестеренка внизу слева)
2. Перейдите в раздел **API**
3. Скопируйте следующие значения:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** ключ (длинная строка под "Project API keys")

## Шаг 3: Создание таблиц в базе данных

1. Перейдите в раздел **SQL Editor** (иконка базы данных слева)
2. Нажмите "New query"
3. Скопируйте и выполните следующий SQL код:

```sql
-- Создание таблицы для позиций (stores)
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  products JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы для названий категорий
CREATE TABLE IF NOT EXISTS category_names (
  id SERIAL PRIMARY KEY,
  category1 TEXT NOT NULL DEFAULT 'Електроніка',
  category2 TEXT NOT NULL DEFAULT 'Аксесуари',
  category3 TEXT NOT NULL DEFAULT 'Послуги',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение Row Level Security (RLS)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_names ENABLE ROW LEVEL SECURITY;

-- Создание политик для публичного доступа (все могут читать и писать)
CREATE POLICY "Allow public read access" ON stores FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON stores FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON stores FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON category_names FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON category_names FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON category_names FOR UPDATE USING (true);
```

4. Нажмите "Run" или `Ctrl+Enter`
5. Должно появиться сообщение "Success. No rows returned"

## Шаг 4: Настройка переменных окружения

### В Vercel:

1. Откройте ваш проект в Vercel
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     **Value**: ваш Project URL из шага 2
   
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     **Value**: ваш anon public ключ из шага 2

4. Нажмите "Save"
5. **ВАЖНО**: Пересоберите проект (Redeploy) после добавления переменных

### Локально (для разработки):

1. Создайте файл `.env.local` в корне проекта (`C:\Users\user\inventory-tracker\.env.local`)
2. Добавьте следующие строки:

```
NEXT_PUBLIC_SUPABASE_URL=ваш_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
```

3. Замените значения на ваши из шага 2
4. **ВАЖНО**: Не коммитьте этот файл в Git! Он уже добавлен в `.gitignore`

## Шаг 5: Установка зависимостей и запуск

```powershell
cd C:\Users\user\inventory-tracker
npm install
npm run dev
```

## Проверка работы

1. Откройте http://localhost:3000
2. Попробуйте добавить позицию
3. Откройте Supabase Dashboard → Table Editor
4. Вы должны увидеть данные в таблице `stores`

## Загрузка на Vercel

После настройки переменных окружения в Vercel:

```powershell
git add .
git commit -m "Добавлена интеграция с Supabase для синхронизации данных"
git push
```

Vercel автоматически пересоберет проект с новыми переменными окружения.

## Готово! 🎉

Теперь все пользователи будут видеть одни и те же данные, так как они хранятся в базе данных Supabase, а не в localStorage браузера.

---

**Проблемы?** Проверьте:
- Правильно ли скопированы API ключи
- Созданы ли таблицы в базе данных
- Добавлены ли переменные окружения в Vercel
- Пересобран ли проект после добавления переменных
