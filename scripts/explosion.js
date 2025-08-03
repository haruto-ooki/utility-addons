import * as server from "@minecraft/server";

const world = server.world;

console.log("爆発コマンドを登録しました！");

let tntQueue: { x: number, y: number, z: number, entity: server.Entity }[] = [];
let delayTicks = 0;
let delaySeconds = 0.0;

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

        // 💣 第二波：1秒後に召喚するTNTをキューに追加
        for (let i = 0; i < 10; i++) {
            const offsetX = Math.random() * spread * 2 - spread;
            const offsetY = Math.random() * 2;
            const offsetZ = Math.random() * spread * 2 - spread;

            const x = Math.floor(location.x + offsetX);
            const y = Math.floor(location.y + offsetY);
            const z = Math.floor(location.z + offsetZ);

            tntQueue.push({ x, y, z, entity: sourceEntity });
        }
        delaySeconds = 1; // 1秒後に実行するための設定
        delayTicks = delaySeconds * 20; // 1秒 ≈ 20 ticks
    }
});

// ⏱ 毎tickチェックして、遅延実行
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