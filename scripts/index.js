"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@minecraft/server");
const greetingMessages = [
    "こんにちは",
    "こん",
    "こんちは",
    "こん！",
    "こんにちはー！",
    "kon",
    "hi",
    "おはよう",
    "おはようございます",
    "こんばんは",
    "やあ",
    "よっ",
    "いらっしゃい",
    "ようこそ",
    "どうも",
    "hello",
    "Welcome!",
    "Hi there!",
    "かえれ",
];
server_1.world.sendMessage("§l§a挨拶アドオン§rが読み込まれました！");
server_1.world.afterEvents.playerSpawn.subscribe((event) => {
    const { player, initialSpawn } = event;
    const operators = server_1.world.getAllPlayers().filter((p) => p.playerPermissionLevel === server_1.PlayerPermissionLevel.Operator);
    for (const operator of operators) {
        const greetingMessage = greetingMessages[Math.floor(Math.random() * Math.random() * greetingMessages.length)];
        server_1.system.runTimeout(() => {
            if (!player.isValid)
                return;
            server_1.world.sendMessage(`<${operator.name}> ${greetingMessage}`);
        }, Math.floor(Math.random() * 100) + 100);
    }
});
