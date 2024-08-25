"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connected');
})
    .catch((error) => {
    console.error('Database connection error:', error);
});
