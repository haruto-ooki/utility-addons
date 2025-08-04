import * as server from "@minecraft/server";

const world = server.world;
const system = server.system;

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

        // 💣 第二波：遅延召喚（0.2秒後）
        for (let i = 0; i < 10; i++) {
            const offsetX = Math.random() * spread * 2 - spread;
            const offsetY = Math.random() * 2;
            const offsetZ = Math.random() * spread * 2 - spread;

            const x = Math.floor(location.x + offsetX);
            const y = Math.floor(location.y + offsetY);
            const z = Math.floor(location.z + offsetZ);

            tntQueue.push({ x, y, z, entity: sourceEntity });
        }

        delaySeconds = 0.2;
        delayTicks = delaySeconds * 20; // ≒ 20ティック = 1秒
    }
});

// ⏱ 毎ティック監視して遅延召喚
system.runInterval(() => {
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
}, 1);