import * as server from "@minecraft/server";

const world = server.world;

console.log("爆発コマンドを登録しました！");

world.afterEvents.projectileHitBlock.subscribe((event , origin)=>{
	const projectile = event.projectile; // 投げものの情報を取得

	if(projectile.typeId === "minecraft:snowball"){ // 投げものが雪玉だったら
		const dimension = event.dimension;
		const location = event.location;

		origin.sourceEntity.runCommand(`fill ${location.x - 2} ${location.y - 2} ${location.z - 2} ${location.x + 2} ${location.y + 2} ${location.z + 2} tnt[explosionPower=4] destroy`);
	}
});