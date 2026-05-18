import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: appliance } = await supabase
		.from('appliances')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!appliance) {
		throw fail(404, { message: 'Appliance not found' });
	}

	const { data: logs } = await supabase
		.from('maintenance_logs')
		.select('*, profiles(full_name, email)')
		.eq('appliance_id', params.id)
		.order('created_at', { ascending: false });

	return {
		appliance,
		logs: logs ?? []
	};
};

export const actions: Actions = {
	addLog: async ({ request, params, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) return fail(401);

		const formData = await request.formData();
		const content = formData.get('content') as string;
		const photo = formData.get('photo') as File | null;

		if (!content) return fail(400, { missing: true });

		let photo_url = null;

		if (photo && photo.size > 0) {
			const fileExt = photo.name.split('.').pop();
			const filePath = `${user.id}/${Math.random()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('cabin-photos')
				.upload(filePath, photo);

			if (!uploadError) {
				const { data: publicUrl } = supabase.storage
					.from('cabin-photos')
					.getPublicUrl(filePath);
				photo_url = publicUrl.publicUrl;
			}
		}

		await supabase.from('maintenance_logs').insert({
			appliance_id: params.id,
			user_id: user.id,
			content,
			photo_url
		});

		return { success: true };
	}
};
