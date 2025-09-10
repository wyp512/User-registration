@echo off
echo 启动用户管理系统...

echo 1. 启动后端服务...
start cmd /k "cd backend && python app.py"

echo 2. 等待后端服务启动...
timeout /t 3 /nobreak

echo 3. 启动前端应用...
start cmd /k "cd myapp && npm start"

echo 用户管理系统启动完成！
echo 后端API: http://localhost:5000
echo 前端应用: http://localhost:3000