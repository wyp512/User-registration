# 用户管理系统

一个简单的用户管理系统，包含用户注册和用户列表功能。系统由React前端和Flask后端组成。

## 项目结构

```
├── backend/             # Flask后端
│   ├── app.py          # 主应用入口
│   ├── models.py       # 数据库模型
│   ├── requirements.txt # 依赖列表
│   └── database/       # 数据库文件目录
├── myapp/              # React前端
│   ├── public/         # 静态资源
│   ├── src/            # 源代码
│   │   ├── components/ # 组件
│   │   └── App.tsx     # 主应用组件
│   ├── package.json    # 依赖配置
│   └── tsconfig.json   # TypeScript配置
└── start.bat           # 启动脚本
```

## 技术栈

### 后端
- Python 
- Flask 
- SQLite3 (内置数据库)
- Flask-CORS 

### 前端
- React 
- TypeScript 
- React Router 

## 安装步骤

### 前提条件
- 安装 [Node.js](https://nodejs.org/) (推荐 v18.x 或更高版本)
- 安装 [Python](https://www.python.org/) (推荐 3.8 或更高版本)

### 后端设置

1. 创建并激活Python虚拟环境（推荐）

   ```bash
   # 使用venv（Python 3.3+内置）
   python -m venv venv
   
   # Windows激活虚拟环境
   venv\Scripts\activate
   
   # macOS/Linux激活虚拟环境
   source venv/bin/activate
   ```

2. 安装后端依赖

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### 前端设置

1. 安装前端依赖

   ```bash
   cd myapp
   npm install
   ```

## 环境变量配置

后端支持通过`.env`文件配置环境变量。在`backend`目录下创建`.env`文件：

```
# .env.example - 复制此文件为.env并根据需要修改

# Flask配置
FLASK_APP=app.py
FLASK_ENV=development

# 服务器配置
HOST=0.0.0.0
PORT=5000

# 数据库配置
DATABASE_PATH=database/users.db
```

## 数据库初始化

数据库会在后端应用首次启动时自动初始化。初始化过程包括：

1. 创建`database`目录（如果不存在）
2. 创建`users.db` SQLite数据库文件
3. 创建`users`表，包含以下字段：
   - `id`: 自增主键
   - `username`: 用户名（3-20字符，唯一）
   - `age`: 年龄（0-120之间的整数）
   - `created_at`: 创建时间戳

如果需要手动初始化数据库，可以运行：

```bash
# 进入Python交互式环境
python -c "from models import init_db; init_db()"
```

## 启动应用

### 方法一：使用批处理脚本（Windows）

直接运行项目根目录下的`start.bat`文件：

```bash
start.bat
```

这将自动启动后端API服务和前端开发服务器。

### 方法二：手动启动

1. 启动后端服务

   ```bash
   # 在backend目录下
   python app.py
   ```

   后端API将在 http://localhost:5000 上运行

2. 启动前端服务

   ```bash
   # 在myapp目录下
   npm start
   ```

   前端应用将在 http://localhost:3000 上运行

## API测试

### 使用curl测试

#### 获取用户列表

```bash
curl http://localhost:5000/api/users
```

#### 按关键字搜索用户

```bash
curl "http://localhost:5000/api/users?keyword=test"
```

#### 创建新用户

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","age":25}'
```

### 使用HTTPie测试（如已安装）

#### 获取用户列表

```bash
http GET http://localhost:5000/api/users
```

#### 创建新用户

```bash
http POST http://localhost:5000/api/users username=testuser age=25
```

### 使用Postman测试

1. 获取用户列表
   - 方法: GET
   - URL: http://localhost:5000/api/users

2. 创建新用户
   - 方法: POST
   - URL: http://localhost:5000/api/users
   - Headers: Content-Type: application/json
   - Body (raw, JSON): 
     ```json
     {
       "username": "testuser",
       "age": 25
     }
     ```