from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from models import init_db, get_all_users, get_user_by_id, add_user

app = Flask(__name__)
CORS(app)  # 启用CORS以允许前端访问

# 在应用启动时初始化数据库
init_db()

@app.route('/api/users', methods=['GET'])
def get_users():
    # 获取查询参数
    keyword = request.args.get('keyword')
    limit = request.args.get('limit', type=int)
    offset = request.args.get('offset', type=int)
    
    # 调用带参数的get_all_users函数
    result = get_all_users(keyword=keyword, limit=limit, offset=offset)
    return jsonify(result)

@app.route('/api/users', methods=['POST'])
def create_user():
    user_data = request.json
    
    # 验证请求数据
    if not user_data or 'username' not in user_data or 'age' not in user_data:
        return jsonify({
            'error': 'validation_error',
            'message': '缺少必要的用户数据',
            'details': {'required_fields': ['username', 'age']}
        }), 400
    
    try:
        # 转换年龄为整数
        age = int(user_data['age'])
        if age < 0 or age > 120:
            return jsonify({
                'error': 'validation_error',
                'message': '年龄必须在0到120之间',
                'details': {'field': 'age', 'min': 0, 'max': 120}
            }), 400
    except ValueError:
        return jsonify({
            'error': 'validation_error',
            'message': '年龄必须是有效的数字',
            'details': {'field': 'age'}
        }), 400
    
    try:
        user_id = add_user(user_data['username'], age)
        
        return jsonify({
            'id': user_id,
            'username': user_data['username'],
            'age': age,
            'message': '用户添加成功'
        }), 201
    except ValueError as e:
        # 处理数据库异常
        error_type, error_message = e.args
        if error_type == 'unique_constraint_failed':
            return jsonify({
                    'error': '用户名已存在',
                    'message': error_message,
                    'details': {'field': 'username'}
                }), 409
        elif error_type == 'validation_error':
            return jsonify({
                'error': 'validation_error',
                'message': error_message,
                'details': {}
            }), 400
        else:
            return jsonify({
                'error': 'database_error',
                'message': error_message,
                'details': {}
            }), 400
    except Exception as e:
        # 处理其他未预期的异常
        return jsonify({
            'error': 'server_error',
            'message': '服务器内部错误',
            'details': {'error': str(e)}
        }), 500

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = get_user_by_id(user_id)
        
        if user is None:
            return jsonify({
                'error': 'not_found',
                'message': '用户不存在',
                'details': {'user_id': user_id}
            }), 404
        
        return jsonify(user)
    except Exception as e:
        # 处理其他未预期的异常
        return jsonify({
            'error': 'server_error',
            'message': '服务器内部错误',
            'details': {'error': str(e)}
        }), 500

# 全局错误处理
@app.errorhandler(Exception)
def handle_exception(e):
    # 记录异常信息
    app.logger.error(f'未处理的异常: {str(e)}\n{traceback.format_exc()}')
    
    # 返回统一的错误格式
    return jsonify({
        'error': 'server_error',
        'message': '服务器内部错误',
        'details': {'error': str(e)}
    }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)