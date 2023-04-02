# simple-auth

0. Создание проекта в https://console.firebase.google.com/

1. Ининциализация проекта.

2. Установка firebase: npm install firebase @angular/fire

    Импорт нужных файлов в app.module.ts
    Добавление конфигурации firebase в файлы environments.ts .
    Если tsconfig слишком строгий - можно добавить "skipLibCheck": true,
    чтобы run постоянно не ругался

3. Создание необходимых компонентов.

    ng g c components/dashboard
    ng g c components/login
    ng g c components/register
    ng g c components/forgot-password
    ng g c components/verify-email

4. Создание маршрутизации.


