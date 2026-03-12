// Exporting the keys so ResetPasswordScreen can use them!
export const supabaseUrl = 'https://ltrdgyraevtxwroukxkt.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cmRneXJhZXZ0eHdyb3VreGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODA5MDEsImV4cCI6MjA4MTg1NjkwMX0.hERWWr2FjKX9zJJVU3j8JjE2y1ZKJeQCsHyrm1yueEI';

export const supabaseFetch = async (tableName, query = '', method = 'GET', body = null) => {
    try {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token || supabaseAnonKey;

        const url = `${supabaseUrl}/rest/v1/${tableName}${query}`;
        const headers = {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(url, options);
        if (response.status === 204) return null;

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.msg || 'Database request failed');
        }

        return await response.json();
    } catch (e) {
        console.error("Database Error:", e);
        throw e;
    }
};

export const supabase = window.supabase?.createClient ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : {
    auth: {
        getSession: () => ({ data: { session: null } }),
        signInWithPassword: () => ({ data: null, error: new Error("Supabase not available") }),
        signUp: () => ({ data: null, error: new Error("Supabase not available") })
    },
    from: () => ({
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ data: null, error: null }) })
    })
};