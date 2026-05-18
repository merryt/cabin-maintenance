import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: inventory } = await supabase
		.from('inventory')
		.select('*')
		.order('item_name')
		.order('id');

	return {
		inventory: inventory ?? []
	};
};

export const actions: Actions = {
	updateQuantity: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const delta = parseInt(formData.get('delta') as string);

		if (!id || isNaN(delta)) return fail(400);

		// We could fetch the current quantity and update, or use an RPC.
		// For simplicity, we'll just fetch and update.
		const { data: item } = await supabase.from('inventory').select('quantity').eq('id', id).single();
		if (item) {
			await supabase.from('inventory').update({ quantity: item.quantity + delta }).eq('id', id);
		}
		
		return { success: true };
	},
	markAsNeeded: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400);

		await supabase.from('inventory').update({ quantity: 0 }).eq('id', id);

		return { success: true };
	},
	addItem: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const item_name = formData.get('item_name') as string;
		const notes = formData.get('notes') as string;
		const location = formData.get('location') as string;
		const status = formData.get('status') as string;

		if (!item_name) return fail(400, { missing: true });

		const initialQuantity = status === 'need' ? 0 : 1;

		await supabase.from('inventory').insert({
			item_name,
			notes,
			location,
			quantity: initialQuantity
		});

		return { success: true };
	},
	deleteItem: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400);

		await supabase.from('inventory').delete().eq('id', id);

		return { success: true };
	},
	updateField: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const field = formData.get('field') as string;
		const value = formData.get('value') as string;

		if (!id || !field) return fail(400);

		// Prevent unauthorized column writes by restricting to safe list
		const allowedFields = ['item_name', 'notes', 'location'];
		if (!allowedFields.includes(field)) return fail(400);

		await supabase.from('inventory').update({ [field]: value }).eq('id', id);

		return { success: true };
	}
};
