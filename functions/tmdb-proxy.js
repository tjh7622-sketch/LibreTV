
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
        return Response.json({ error: '缺少 url 参数' }, { status: 400 });
    }

    try {
        // 带上浏览器伪装头去请求 TMDB
        const resp = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // 设置允许前端跨域读取
        const newHeaders = new Headers(resp.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

        return new Response(resp.body, {
            status: resp.status,
            headers: newHeaders
        });
    } catch (e) {
        // 出错时务必返回 JSON 格式，防止前端 res.json() 崩掉
        return Response.json({ error: '代理请求失败: ' + e.message }, { status: 500 });
    }
}
