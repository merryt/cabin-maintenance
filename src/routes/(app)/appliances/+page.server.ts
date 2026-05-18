import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: appliances } = await supabase
		.from('appliances')
		.select('*')
		.order('name');

	return {
		appliances: appliances ?? []
	};
};

export const actions: Actions = {
	addAppliance: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const brand = formData.get('brand') as string;
		const model_number = formData.get('model_number') as string;

		if (!name) return fail(400, { missing: true });

		await supabase.from('appliances').insert({
			name,
			brand,
			model_number
		});

		return { success: true };
	}
};
