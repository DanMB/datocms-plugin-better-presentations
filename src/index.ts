import { type BuildItemPresentationInfoCtx, connect, type Item } from 'datocms-plugin-sdk';

connect({
	async buildItemPresentationInfo(item: Item, ctx: BuildItemPresentationInfoCtx) {
		console.log('buildItemPresentationInfo', item);
		if ('preview' in item.attributes) {
			return {
				title: (item.attributes.title ?? item.attributes.name ?? item.id) as string,
				imageUrl: item.attributes.custom_preview as string,
			};
		}
	},
});
