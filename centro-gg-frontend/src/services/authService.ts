import type { AppRole } from '@/types/roles';
import { supabase } from '@/services/supabase';

export async function getUserRole(userId: string): Promise<AppRole | null> {
	const { data, error } = await supabase
		.from('user_roles')
		.select('role')
		.eq('user_id', userId)
		.single();

	if (error || !data) {
		return null;
	}

	return data.role as AppRole;
}
