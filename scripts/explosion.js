import * as server from "@minecraft/server";

const world = server.world;

console.log("爆発コマンドを登録しました！");

world.afterEvents.projectileHitBlock.subscribe((event)=>{
	const projectile = event.projectile; // 投げものの情報を取得

	if(projectile.typeId === "minecraft:snowball"){ // 投げものが雪玉だったら
		const dimension = event.dimension;
		const location = event.location;

		dimension.createExplosion(location, 10);
	}
});