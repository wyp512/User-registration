import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserRegistration.css';

interface UserData {
  username: string;
  age: string;
}

const UserRegistration: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    username: '',
    age: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMessage(''); // 清除之前的成功消息
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '提交失败');
      }

      await response.json();
      
      // 重置表单
      setUserData({
        username: '',
        age: ''
      });
      
      setSuccessMessage('创建成功！');
      setError('');
    } catch (err: any) {
      console.error('提交用户数据出错:', err);
      setError(err.message || '提交失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration">
      <h2>用户登记</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="用户名只能包含字母、数字和下划线，长度3-20个字符"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">年龄</label>
          <input
            type="number"
            id="age"
            name="age"
            value={userData.age}
            onChange={handleChange}
            required
            min="1"
            max="120"
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '提交中...' : '提交'}
        </button>
      </form>
      
      <div className="view-list-container">
        <Link to="/users" className="view-list-btn">查看已登记用户列表</Link>
      </div>
    </div>
  );
};

export default UserRegistration;