import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Fetch active projects
	const { data: projects } = await supabase
		.from('projects')
		.select('*')
		.eq('status', 'in-progress')
		.order('created_at', { ascending: false })
		.limit(5);

	// Fetch recent maintenance logs with appliance details
	const { data: recentLogs } = await supabase
		.from('maintenance_logs')
		.select('*, appliances(name)')
		.order('created_at', { ascending: false })
		.limit(5);

	return {
		projects: projects ?? [],
		recentLogs: recentLogs ?? []
	};
};
