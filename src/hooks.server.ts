import { createSupabaseServerClient } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event);

	// Helper function for safe session fetching
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// Session might be corrupted, returning null will force a logout or login attempt
			return { session: null, user: null };
		}

		return { session, user };
	};

	const { session, user } = await event.locals.safeGetSession();

	// Protect /(app) routes
	if (event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/projects') || event.url.pathname.startsWith('/appliances') || event.url.pathname.startsWith('/inventory')) {
		if (!session) {
			throw redirect(303, '/');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
