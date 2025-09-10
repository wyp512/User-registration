import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserList.css';

interface User {
  id: number;
  username: string;
  age: string;
  created_at: string;
}

interface UserResponse {
  users: User[];
  total: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  
  // 分页参数
  const [limit] = useState<number>(5); // 每页显示5条记录
  const [offset, setOffset] = useState<number>(0);

  // 获取用户数据，支持搜索和分页
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // 构建带查询参数的URL
      const url = new URL('http://localhost:5000/api/users');
      if (keyword) url.searchParams.append('keyword', keyword);
      if (limit) url.searchParams.append('limit', limit.toString());
      if (offset !== undefined) url.searchParams.append('offset', offset.toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('获取用户数据失败');
      }
      const data: UserResponse = await response.json();
      setUsers(data.users);
      setTotalUsers(data.total);
      setError('');
    } catch (err) {
      console.error('获取用户数据出错:', err);
      setError('获取用户数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 当搜索关键字或分页参数变化时重新获取数据
  useEffect(() => {
    fetchUsers();
  }, [keyword, offset]);
  
  // 处理搜索表单提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0); // 重置到第一页
    fetchUsers();
  };
  
  // 处理分页
  const handlePrevPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };
  
  const handleNextPage = () => {
    if (offset + limit < totalUsers) {
      setOffset(offset + limit);
    }
  };

  return (
    <div className="user-list-container">
      <h2>已登记用户列表</h2>
      <Link to="/" className="back-btn">返回登记页面</Link>
      
      {/* 搜索框 */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="按用户名搜索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            搜索
          </button>
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <p className="loading-text">加载中...</p>
      ) : users.length === 0 ? (
        <p className="no-data-text">暂无用户数据</p>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>年龄</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.age}</td>
                    <td>{new Date(user.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 分页控制 */}
          <div className="pagination-container">
            <button 
              onClick={handlePrevPage} 
              disabled={loading || offset === 0}
              className="pagination-btn"
            >
              上一页
            </button>
            <span className="pagination-info">
              显示 {offset + 1} - {Math.min(offset + limit, totalUsers)} 条，共 {totalUsers} 条
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={loading || offset + limit >= totalUsers}
              className="pagination-btn"
            >
              下一页
            </button>
          </div>
        </>
      )}
      
      <button onClick={fetchUsers} className="refresh-btn" disabled={loading}>
        {loading ? '刷新中...' : '刷新数据'}
      </button>
    </div>
  );
};

export default UserList;