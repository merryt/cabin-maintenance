import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		throw redirect(303, '/dashboard');
	}
};

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, message: 'Email and password are required' });
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(401, { email, message: error.message });
		}

		throw redirect(303, '/dashboard');
	},
	register: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, message: 'Email and password are required' });
		}

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			return fail(400, { email, message: error.message });
		}

		// If email confirmation is disabled, the user is logged in automatically.
		throw redirect(303, '/dashboard');
	}
};
