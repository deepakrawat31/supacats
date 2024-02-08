// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '../$types';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// if the user is already logged in return them to the account page
	if (session) {
		throw redirect(303, '/profile');
	}

	return { url: url.origin };
};

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
			provider: 'github'
		});
		if (err) {
			console.log(err);
		}
		if (data.url != null) {
			throw redirect(303, data.url);
		}
	}
};
