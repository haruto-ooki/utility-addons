import * as server from "@minecraft/server";

const world = server.world;

console.log("爆発コマンドを登録しました！");

world.afterEvents.projectileHitBlock.subscribe((event) => {
    const projectile = event.projectile;

    if (projectile.typeId === "minecraft:snowball") {
        const location = event.location;
        const sourceEntity = event.source; // 修正されたプロパティ

        if (!sourceEntity) return; // 念のためnullチェック

        for (let i = 0; i < 4; i++) {
            const offsetX = Math.random() * 2 - 1;
            const offsetY = Math.random();
            const offsetZ = Math.random() * 2 - 1;

            const spawnX = location.x + offsetX;
            const spawnY = location.y + offsetY;
            const spawnZ = location.z + offsetZ;

            sourceEntity.runCommand(
                `summon tnt ${spawnX} ${spawnY} ${spawnZ}`
            );
        }
    }
});