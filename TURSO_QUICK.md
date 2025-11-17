# ⚡ Быстрая настройка Turso для вашего проекта

## У вас уже есть connection string:
```
libsql://elki-db-leskort.aws-us-east-1.turso.io
```

## Что нужно сделать:

### 1. Получите токен доступа

1. Зайдите на https://turso.tech
2. Перейдите в ваш проект
3. Откройте базу данных `elki-db-leskort`
4. Перейдите в **"Settings"** → **"Tokens"**
5. Нажмите **"Create Token"**
6. Назовите токен (например, `netlify-token`)
7. **ВАЖНО:** Скопируйте токен сразу - он показывается только один раз!

### 2. Сформируйте полный DATABASE_URL

Формат:
```
libsql://elki-db-leskort.aws-us-east-1.turso.io?authToken=ВАШ-ТОКЕН
```

Пример:
```
libsql://elki-db-leskort.aws-us-east-1.turso.io?authToken=turso_auth_token_abc123xyz789
```

### 3. Добавьте в Netlify

1. Зайдите в настройки вашего сайта на Netlify
2. **Site settings** → **Environment variables**
3. Добавьте переменные:

```
DATABASE_URL=libsql://elki-db-leskort.aws-us-east-1.turso.io?authToken=ВАШ-ТОКЕН
NEXTAUTH_SECRET=сгенерируйте-случайную-строку-32-символа
NEXTAUTH_URL=https://elkis.netlify.app
```

### 4. Сгенерируйте NEXTAUTH_SECRET

В PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Или онлайн: https://generate-secret.vercel.app/32

### 5. После добавления переменных

1. Пересоберите сайт в Netlify (Deploys → Trigger deploy → Clear cache and deploy site)
2. После успешного деплоя выполните миграции:

```bash
# Локально с вашим connection string
DATABASE_URL="libsql://elki-db-leskort.aws-us-east-1.turso.io?authToken=ВАШ-ТОКЕН" npm run db:migrate
DATABASE_URL="libsql://elki-db-leskort.aws-us-east-1.turso.io?authToken=ВАШ-ТОКЕН" npm run db:seed
```

## ✅ Готово!

После этого ваш сайт будет работать с базой данных Turso!

