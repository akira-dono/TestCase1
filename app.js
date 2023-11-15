const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

//* Подключение к базе данных
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    username: 'username',
    password: 'password',
    database: 'database',
});

//* Создание таблицы пользователя
const User = sequelize.define('User', {
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10000,
        validate: {
            min: 0,
        },
    },
});

//* Создание таблицы "users" в базе данных и Добавление одного пользователя
sequelize.sync({ force: true }).then(() => {
    User.create();
});

app.use(express.json());

//* Маршрут для обновления баланса пользователя
app.put('/update-balance/:userId', async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (user.balance >= amount) {
            user.balance -= amount;
            await user.save();

            res.status(200).json({ message: 'Баланс успешно обновлен.' });
        } else {
            res.status(400).json({ error: 'Недостаточно средств на балансе.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
    }
});

//* Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
