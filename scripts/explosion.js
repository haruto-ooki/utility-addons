import * as server from "@minecraft/server";

const world = server.world;

console.log("爆発コマンドを登録しました！");

world.afterEvents.projectileHitBlock.subscribe((event) => {
    const projectile = event.projectile;

    if (projectile.typeId === "minecraft:snowball") {
        const location = event.location;
        const sourceEntity = event.source;

        if (!sourceEntity) return;

        for (let i = 0; i < 5; i++) { // TNTの個数を5に増やしました
            const offsetX = Math.random() * 8 - 4;   // -4 ～ +4
            const offsetY = Math.random() * 4;       // 0 ～ 4（空中も含む）
            const offsetZ = Math.random() * 8 - 4;

            const spawnX = Math.floor(location.x + offsetX);
            const spawnY = Math.floor(location.y + offsetY);
            const spawnZ = Math.floor(location.z + offsetZ);

            sourceEntity.runCommand(
                `summon tnt ${spawnX} ${spawnY} ${spawnZ}`
            );
        }
    }
});