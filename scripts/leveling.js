import * as server from '@minecraft/server';

console.log("レベリングコマンドを登録しました！");

server.system.beforeEvents.startup.subscribe(ev => {
    ev.customCommandRegistry.registerCommand({
        name: "utility:leveling",
        description: "整地ができます",
        permissionLevel: server.CommandPermissionLevel.Any,
        mandatoryParameters: [],
        optionalParameters: [
            {
                name: "go_to",
                description: 'アイテムの移動先を指定します。例: "0 0 0" または "home"',
                type: server.CustomCommandParamType.String,
            },
            {
                name: "fill_range",
                description: "整地する範囲を指定します。例: '30 30 30' (デフォルトは30x30x30)",
                type: server.CustomCommandParamType.String,
            }
        ]
    }, (origin, ...args) => {
        server.system.runTimeout(() => {
            let targetLocation = "~ ~ ~"; // デフォルトはプレイヤーの現在位置
            let fillRange = "30 30 30"; // デフォルトの整地範囲
            
            // アイテム移動先の判定
            if (args[0] && args[0].trim() !== "") {
                targetLocation = (args[0].toLowerCase() === "home") ? "11.00 67.00 44.50" : args[0];
            }

            // 整地範囲の判定
            if (args[1] && args[1].trim() !== "") {
                let rangeParts = args[1].split(" ");
                if (rangeParts.length === 3 && rangeParts.every(n => !isNaN(parseInt(n)))) {
                    fillRange = args[1];
                } else {
                    console.error(`無効な整地範囲: ${args[1]}`);
                }
            }

            // 整地処理とアイテムのテレポート
            origin.sourceEntity.runCommand(`fill ~ ~ ~ ^-${fillRange.split(" ")[0]} ^${fillRange.split(" ")[1]} ^${fillRange.split(" ")[2]} air destroy`);
            origin.sourceEntity.runCommand(`tp @e[type=item] ${targetLocation}`);
            origin.sourceEntity.runCommand("say 整地が完了しました");
        }, 1);
    });
});