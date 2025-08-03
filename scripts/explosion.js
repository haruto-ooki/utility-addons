import * as server from "@minecraft/server";

const world = server.world;

console.log("爆発コマンドを登録しました！");

// 第二波TNTのためのキュー
let tntQueue = [];
let delayTicks = 0;
let delaySeconds = 0;

world.afterEvents.projectileHitBlock.subscribe((event) => {
    const projectile = event.projectile;

    if (projectile.typeId === "minecraft:snowball") {
        const location = event.location;
        const sourceEntity = event.source;

        if (!sourceEntity) return;

        const spread = 6;

        // 💥 第一波：即時召喚
        for (let i = 0; i < 5; i++) {
            const offsetX = Math.random() * spread * 2 - spread;
            const offsetY = Math.random() * 2;
            const offsetZ = Math.random() * spread * 2 - spread;

            const x = Math.floor(location.x + offsetX);
            const y = Math.floor(location.y + offsetY);
            const z = Math.floor(location.z + offsetZ);

            sourceEntity.runCommand(`summon tnt ${x} ${y} ${z}`);
        }

        // 💣 第二波：1秒後に爆発
        for (let i = 0; i < 10; i++) {
            const offsetX = Math.random() * spread * 2 - spread;
            const offsetY = Math.random() * 2;
            const offsetZ = Math.random() * spread * 2 - spread;

            const x = Math.floor(location.x + offsetX);
            const y = Math.floor(location.y + offsetY);
            const z = Math.floor(location.z + offsetZ);

            tntQueue.push({ x: x, y: y, z: z, entity: sourceEntity });
        }
        delaySeconds = 0.2
        delayTicks = delaySeconds * 20; // 1秒 ≒ 20ティック
    }
});

// ⏱ 毎ティック監視し、遅延召喚を実行
world.events.tick.subscribe(() => {
    if (delayTicks > 0) {
        delayTicks--;
        return;
    }

    if (tntQueue.length > 0) {
        for (const tnt of tntQueue) {
            tnt.entity.runCommand(`summon tnt ${tnt.x} ${tnt.y} ${tnt.z}`);
        }
        tntQueue = [];
    }
});