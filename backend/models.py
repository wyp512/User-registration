import sqlite3
import os
from datetime import datetime
import re

# 确保数据库目录存在
DB_PATH = os.path.join(os.path.dirname(__file__), 'database')
os.makedirs(DB_PATH, exist_ok=True)
DATABASE = os.path.join(DB_PATH, 'users.db')

def get_db_connection():
    """创建数据库连接"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """初始化数据库表结构"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 创建用户表，使用username字段并添加约束
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE CHECK(length(username) >= 3 AND length(username) <= 20),
        age INTEGER NOT NULL CHECK(age >= 0 AND age <= 120),
        created_at TIMESTAMP NOT NULL
    )
    ''')
    
    conn.commit()
    conn.close()

def get_all_users(keyword=None, limit=None, offset=None):
    """获取所有用户，支持关键字搜索和分页"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM users'
    params = []
    
    # 添加关键字搜索条件
    if keyword:
        query += ' WHERE username LIKE ?'
        params.append(f'%{keyword}%')
    
    query += ' ORDER BY id DESC'
    
    # 添加分页
    if limit is not None:
        query += ' LIMIT ?'
        params.append(limit)
        
        if offset is not None:
            query += ' OFFSET ?'
            params.append(offset)
    
    cursor.execute(query, params)
    users = [dict(row) for row in cursor.fetchall()]
    
    # 获取总记录数
    count_query = 'SELECT COUNT(*) as count FROM users'
    if keyword:
        count_query += ' WHERE username LIKE ?'
        cursor.execute(count_query, [f'%{keyword}%'])
    else:
        cursor.execute(count_query)
    
    total_count = cursor.fetchone()['count']
    
    conn.close()
    return {'users': users, 'total': total_count}

def get_user_by_id(user_id):
    """根据ID获取用户"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def validate_username(username):
    """验证用户名格式"""
    if not username or len(username) < 3 or len(username) > 20:
        return False, '用户名长度必须在3-20个字符之间'
    
    # 只允许字母、数字和下划线
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, '用户名只能包含字母、数字和下划线'
    
    return True, ''

def add_user(username, age):
    """添加新用户"""
    # 验证用户名格式
    is_valid, error_msg = validate_username(username)
    if not is_valid:
        raise ValueError('validation_error', error_msg)
    
    # 验证年龄范围
    if age < 0 or age > 120:
        raise ValueError('validation_error', '年龄必须在0-120之间')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 生成UTC时间戳
        created_at = datetime.utcnow().isoformat() + 'Z'
        
        cursor.execute(
            'INSERT INTO users (username, age, created_at) VALUES (?, ?, ?)',
            (username, age, created_at)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return user_id
    except sqlite3.IntegrityError as e:
        conn.close()
        # 处理唯一约束冲突
        if 'UNIQUE constraint failed' in str(e):
            raise ValueError('unique_constraint_failed', '用户名已存在')
        # 处理其他完整性错误
        raise ValueError('integrity_error', f'数据库完整性错误: {str(e)}')
    except Exception as e:
        conn.close()
        raise ValueError('database_error', f'数据库错误: {str(e)}')