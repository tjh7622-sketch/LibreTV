// functions/api/tmdb.js
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
        return new Response('缺少 url 参数', { status: 400 });
    }

    try {
        // 让 Cloudflare 服务器代替我们去请求 TMDB
        const resp = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // 设置允许跨域，并转发数据
        const newHeaders = new Headers(resp.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

        return new Response(resp.body, {
            status: resp.status,
            headers: newHeaders
        });
    } catch (e) {
        return new Response('代理请求失败: ' + e.message, { status: 500 });
    }
}
