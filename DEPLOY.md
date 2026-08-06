## 踏云行官网 — Cloudflare 部署指南

### 前置条件

1. 已注册并登录 Cloudflare 账号
2. 已安装 Node.js（你电脑有 v20.19.4）
3. 已安装 Git

---

### 第一步：创建 GitHub 仓库

Cloudflare Pages 需要从 GitHub 拉取代码。

```bash
cd company-website
git init
git add .
git commit -m "init: 踏云行官网"
```

然后在 GitHub 创建一个新仓库（如 `tayunxing-website`），按提示推送：

```bash
git remote add origin https://github.com/你的用户名/tayunxing-website.git
git branch -M main
git push -u origin main
```

---

### 第二步：部署后端（Workers + D1）

在终端中执行：

```bash
cd workers
npm install
```

#### 2.1 登录 Cloudflare

```bash
npx wrangler login
```

浏览器会弹出授权页面，点击允许。

#### 2.2 创建 D1 数据库

```bash
npx wrangler d1 create tayunxing-db
```

输出类似：
```
✅ Successfully created DB 'tayunxing-db'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**复制 database_id**，然后编辑 `wrangler.toml`，把 `YOUR_DATABASE_ID` 替换为真实值：

```toml
[[d1_databases]]
binding = "DB"
database_name = "tayunxing-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### 2.3 初始化数据库表

```bash
npx wrangler d1 execute tayunxing-db --file=schema.sql
```

#### 2.4 本地测试（可选）

```bash
npx wrangler dev
```

访问 http://localhost:8787/api/v1/health 看到 `{"code":200,"data":{"status":"UP"}}` 即成功。

#### 2.5 部署 Workers

```bash
npx wrangler deploy
```

部署成功后会显示地址，如：
```
https://tayunxing-api.your-subdomain.workers.dev
```

**记下这个地址**，后面要用。

---

### 第三步：部署前端（Pages）

#### 3.1 更新前端 API 地址

编辑 `.env.production`，把 Workers 地址填进去：

```
VITE_API_BASE_URL=https://tayunxing-api.your-subdomain.workers.dev/api/v1
```

#### 3.2 更新 CORS 配置

编辑 `workers/wrangler.toml`，把 `CORS_ORIGIN` 改为 Pages 的域名：

```toml
[vars]
CORS_ORIGIN = "https://tayunxing.pages.dev"
JWT_SECRET = "换一个随机字符串比如abc123xyz789"
```

然后重新部署 Workers：

```bash
npx wrangler deploy
```

#### 3.3 在 Cloudflare 控制台连接 GitHub

1. 登录 https://dash.cloudflare.com
2. 左侧菜单 → **Workers & Pages**
3. 点击 **Create** → 选择 **Pages** → **Connect to Git**
4. 选择你的 GitHub 仓库 `tayunxing-website`
5. 配置构建设置：

| 设置项 | 值 |
|--------|-----|
| Framework preset | 选 **Vue** (或 None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/`（仓库根目录） |

6. 点击 **Save and Deploy**

首次部署约 2-3 分钟，完成后会显示：
```
https://tayunxing.pages.dev
```

---

### 第四步：验证

1. 打开 `https://tayunxing.pages.dev` — 首页正常显示
2. 打开 `https://tayunxing.pages.dev/admin/login` — 后台登录页
3. 用 `admin` / `admin123` 登录
4. 测试创建文章、编辑案例等功能

---

### 常见问题

**Q: 刷新页面 404？**
已添加 `public/_redirects` 文件处理 SPA 路由，确保文件在仓库中。

**Q: 后台 API 报 CORS 错误？**
检查 `workers/wrangler.toml` 中的 `CORS_ORIGIN` 是否为 Pages 的完整域名（含 https://）。

**Q: 登录失败？**
确认已执行 `npx wrangler d1 execute tayunxing-db --file=schema.sql` 初始化数据。

**Q: 如何绑定自己的域名？**
在 Cloudflare Pages 控制台 → 项目设置 → Custom domains → 添加域名，按提示配置 DNS。

---

### 后续更新

代码推送到 GitHub 后，Cloudflare Pages 会自动重新部署。Workers 需要手动执行 `npx wrangler deploy`。
