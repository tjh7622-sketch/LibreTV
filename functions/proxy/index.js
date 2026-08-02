// functions/proxy/index.js
// 豆瓣图片代理 - 彻底解决豆瓣防盗链
// 使用方法：https://你的域名/proxy?url=img1.doubanio.com/xxx.jpg

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response('缺少 url 参数', { status: 400 });
  }
  
  // 只允许豆瓣图片
  if (!targetUrl.includes('doubanio.com') && !targetUrl.includes('img1.doubanio.com')) {
    return new Response('只支持豆瓣图片代理', { status: 403 });
  }
  
  try {
    const response = await fetch(`https://${targetUrl}`, {
      headers: {
        'Referer': 'https://9629659f.libretv-3rt.pages.dev',  // 改成你当前部署的域名
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=3600'); // 1小时缓存
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (e) {
    return new Response('图片代理失败', { status: 500 });
  }
}
