import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: projects } = await supabase
		.from('projects')
		.select('*, todos(*)')
		.order('created_at', { ascending: false });

	return {
		projects: projects ?? []
	};
};

export const actions: Actions = {
	addProject: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		if (!title) return fail(400, { missing: true });

		await supabase.from('projects').insert({
			title,
			description,
			status: 'planned'
		});

		return { success: true };
	},
	updateProject: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const status = formData.get('status') as string;

		if (!id || !title) return fail(400);

		await supabase.from('projects').update({ title, description, status }).eq('id', id);

		return { success: true };
	},
	deleteProject: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400);

		await supabase.from('projects').delete().eq('id', id);

		return { success: true };
	},
	toggleTodo: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const is_completed = formData.get('is_completed') === 'true';

		if (!id) return fail(400);

		await supabase.from('todos').update({ is_completed }).eq('id', id);

		return { success: true };
	},
	addTodo: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const project_id = formData.get('project_id') as string;
		const task = formData.get('task') as string;

		if (!project_id || !task) return fail(400);

		await supabase.from('todos').insert({ project_id, task });

		return { success: true };
	},
	deleteTodo: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400);

		await supabase.from('todos').delete().eq('id', id);

		return { success: true };
	},
	updateTodo: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const task = formData.get('task') as string;

		if (!id || !task) return fail(400);

		await supabase.from('todos').update({ task }).eq('id', id);

		return { success: true };
	}
};
