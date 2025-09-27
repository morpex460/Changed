Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        console.log('Discord invite request received - starting processing');

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        console.log('Environment check:');
        console.log('- supabaseUrl:', supabaseUrl);
        console.log('- serviceRoleKey exists:', !!serviceRoleKey);
        console.log('- serviceRoleKey length:', serviceRoleKey ? serviceRoleKey.length : 0);

        if (!serviceRoleKey || !supabaseUrl) {
            console.error('Supabase configuration missing:', {
                hasServiceRole: !!serviceRoleKey,
                hasUrl: !!supabaseUrl
            });
            throw new Error('Server configuration error');
        }

        const rpcUrl = `${supabaseUrl}/rest/v1/rpc/allocate_invite`;
        console.log('Making request to:', rpcUrl);

        const requestHeaders = {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        };
        
        console.log('Request headers configured (service role masked)');

        // Call the allocate_invite database function
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({})
        });

        console.log('Response received:');
        console.log('- Status:', response.status);
        console.log('- Status text:', response.statusText);
        console.log('- Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Database function call failed:');
            console.error('- Status:', response.status);
            console.error('- Error text:', errorText);
            
            // Try to parse error as JSON for better info
            try {
                const errorJson = JSON.parse(errorText);
                console.error('- Parsed error:', errorJson);
            } catch {
                console.error('- Error text is not JSON');
            }
            
            if (response.status === 404) {
                throw new Error('Нет доступных инвайтов в пуле');
            } else if (response.status === 401 || response.status === 403) {
                throw new Error('Проблема авторизации с базой данных');
            }
            
            throw new Error(`Ошибка вызова функции: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Function result received:');
        console.log('- Type:', typeof result);
        console.log('- Value:', result);
        
        // Handle different possible result formats
        if (result === null || result === undefined) {
            console.log('Function returned null - no invites available in pool');
            
            // Return HTTP 200 with error message instead of throwing
            return new Response(JSON.stringify({
                error: 'Нет доступных инвайтов в пуле'
            }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } 
        
        let inviteData = null;
        
        if (typeof result === 'object') {
            // Direct object result
            if (result.invite_url) {
                inviteData = result;
                console.log('Found invite data in direct result');
            } else {
                console.log('Object result does not contain invite_url:', Object.keys(result));
                throw new Error('Некорректный формат ответа от базы данных');
            }
        } else {
            console.log('Unexpected result type:', typeof result);
            throw new Error('Неожиданный формат ответа');
        }

        if (!inviteData || !inviteData.invite_url) {
            console.error('No valid invite data found:', inviteData);
            throw new Error('Нет доступных инвайтов');
        }

        console.log('Returning successful response:');
        console.log('- Code:', inviteData.code);
        console.log('- Invite URL exists:', !!inviteData.invite_url);

        return new Response(JSON.stringify({
            data: {
                invite_url: inviteData.invite_url,
                code: inviteData.code
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Discord invite allocation error:');
        console.error('- Error type:', typeof error);
        console.error('- Error message:', error.message);
        console.error('- Full error:', error);

        const errorResponse = {
            error: {
                code: 'INVITE_ALLOCATION_FAILED',
                message: error.message || 'Не удалось получить Discord инвайт'
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});