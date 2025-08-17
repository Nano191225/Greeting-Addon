import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, PlayerPermissionLevel, system, world } from "@minecraft/server";

const greetingMessages: string[] = [
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

world.afterEvents.playerSpawn.subscribe((event) => {
    const { player, initialSpawn } = event;
    if (!initialSpawn) return;
    if (world.getDynamicProperty("greeting-addon:enabled") === false) return;

    const operators = world.getAllPlayers().filter((p) => p.playerPermissionLevel === PlayerPermissionLevel.Operator);
    for (const operator of operators) {
        if (operator.id === player.id) continue;
        const chance = world.getDynamicProperty("greeting-addon:chance") as number | undefined ?? 1;
        if (Math.random() > chance) continue;

        const greetingMessage = greetingMessages[Math.floor(Math.random() * Math.random() * greetingMessages.length)];
        const format = world.getDynamicProperty("greeting-addon:format") as string | undefined ?? "<{name}> {message}";
        const message = format.replace("{name}", operator.name).replace("{message}", greetingMessage);

        system.runTimeout(() => {
            if (!player.isValid || !operator.isValid) return;
            if (world.getDynamicProperty("greeting-addon:websocket") === true) {
                const rawtext = { rawtext: [{ translate: "chat.type.text", with: [operator.name, greetingMessage] }] };
                player.runCommand(`tellraw @a ${JSON.stringify(rawtext)}`);
            } else {
                world.sendMessage(message);
            }
        }, Math.floor(Math.random() * 100) + 40);
    }
});

world.afterEvents.worldLoad.subscribe(() => {
    world.sendMessage("§l§a挨拶アドオン§rが読み込まれました！");
});

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand(
        {
            name: "greet:on",
            description: "挨拶アドオンを有効にします",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
        },
        () => {
            world.setDynamicProperty("greeting-addon:enabled", true);
            return { status: CustomCommandStatus.Success, message: "挨拶アドオンが有効になりました！" };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "greet:off",
            description: "挨拶アドオンを無効にします",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
        },
        () => {
            world.setDynamicProperty("greeting-addon:enabled", false);
            return { status: CustomCommandStatus.Success, message: "挨拶アドオンが無効になりました！" };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "greet:setchance",
            description: "挨拶メッセージの表示確率を設定します",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [{ name: "chance", type: CustomCommandParamType.Float }],
        },
        (_origin, parameter) => {
            if (typeof parameter !== "number" || isNaN(parameter) || parameter < 0 || parameter > 1) {
                return { status: CustomCommandStatus.Failure, message: "§c挨拶メッセージの表示確率は0から1の間の数値でなければなりません。" };
            }
            world.setDynamicProperty("greeting-addon:chance", parameter);
            return { status: CustomCommandStatus.Success, message: `挨拶メッセージの表示確率が ${Math.floor(parameter * 100000) / 1000}%% に設定されました！` };
        }
    );

    customCommandRegistry.registerCommand({
        name: "greet:format",
        description: "挨拶メッセージのフォーマットを設定します",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: false,
        mandatoryParameters: [{ name: "format", type: CustomCommandParamType.String }],
    }, (_origin, parameter) => {
        if (typeof parameter !== "string") {
            return { status: CustomCommandStatus.Failure, message: "§c挨拶メッセージのフォーマットは文字列でなければなりません。" };
        }
        if (parameter.length > 100) {
            return { status: CustomCommandStatus.Failure, message: "§c挨拶メッセージのフォーマットは100文字以内でなければなりません。" };
        }
        if (!parameter.includes("{name}")) {
            return { status: CustomCommandStatus.Failure, message: "§c挨拶メッセージのフォーマットには {name} プレースホルダが必要です。" };
        }
        if (!parameter.includes("{message}")) {
            return { status: CustomCommandStatus.Failure, message: "§c挨拶メッセージのフォーマットには {message} プレースホルダが必要です。" };
        }
        world.setDynamicProperty("greeting-addon:format", parameter);
        return { status: CustomCommandStatus.Success, message: `挨拶メッセージのフォーマットが "${parameter}" に設定されました！` };
    });

    customCommandRegistry.registerCommand({
        name: "greet:websocket",
        description: "挨拶アドオンをWebSocketに対応させます",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: false,
        mandatoryParameters: [{ name: "enabled", type: CustomCommandParamType.Boolean }],
    }, (_origin, parameter) => {
        if (typeof parameter !== "boolean") {
            return { status: CustomCommandStatus.Failure, message: "§c挨拶アドオンをWebSocketに対応させるには、trueまたはfalseを指定してください。" };
        }
        world.setDynamicProperty("greeting-addon:websocket", parameter);
        return { status: CustomCommandStatus.Success, message: `挨拶アドオンをWebSocketに対応させる設定が ${parameter} に変更されました！` };
    });

    // help cmd
    customCommandRegistry.registerCommand({
        name: "greet:help",
        description: "挨拶アドオンのヘルプを表示します",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: false,
    }, () => {
        return {
            status: CustomCommandStatus.Success,
            message: "挨拶アドオンのコマンド一覧:\n" +
                "/greet:on - 挨拶アドオンを有効にします\n" +
                "/greet:off - 挨拶アドオンを無効にします\n" +
                "/greet:setchance <0-1> - 挨拶メッセージの表示確率を設定します\n" +
                "/greet:format <format> - 挨拶メッセージのフォーマットを設定します ( {name} と {message} を含む必要があります )\n" +
                "/greet:websocket <true/false> - 挨拶アドオンをWebSocketに対応させます\n\n" +
                "GitHubリポジトリ: §3https://github.com/Nano191225/Greeting-Addon§r\n" +
                "Discordサーバーに参加して最新情報をゲットしよう！\n" +
                "§3https://discord.gg/QF3n85dr4P§r\n"
        };
    });
});
