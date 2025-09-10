@echo off

echo Starting User Management System...

echo 1. Starting backend service...
start cmd /k "cd %~dp0backend && python app.py"

echo 2. Waiting for backend service to start...
timeout /t 3 /nobreak

echo 3. Starting frontend application...
start cmd /k "cd %~dp0myapp && npm start"

echo User Management System started successfully!
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000