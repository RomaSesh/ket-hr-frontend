const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'admin123';  // Пароль, который будем использовать
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Пароль:', password);
    console.log('Хеш:', hash);
}

generateHash();