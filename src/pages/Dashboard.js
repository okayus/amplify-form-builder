import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from 'aws-amplify';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, we'll use a mock implementation
    // In a real implementation, you would fetch from your API
    const fetchForms = async () => {
      try {
        // This would be replaced with a real API call
        // const response = await API.get('formBuilderApi', '/forms');
        // setForms(response);
        
        // Mock data for demonstration
        setForms([
          {
            formId: 'mock-id-1',
            title: 'カスタマーフィードバック',
            description: '製品に関するユーザーフィードバックを収集するフォーム',
            createdAt: '2025-05-17T10:30:00Z',
            status: 'ACTIVE'
          },
          {
            formId: 'mock-id-2',
            title: 'イベント登録',
            description: '社内イベントの参加登録フォーム',
            createdAt: '2025-05-15T14:20:00Z',
            status: 'ACTIVE'
          }
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching forms:', err);
        setError('フォームの取得中にエラーが発生しました。');
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="form-header">
        <h2>マイフォーム</h2>
        <Link to="/create">
          <button className="button">新規フォームを作成</button>
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="no-forms">
          <p>フォームがまだありません。「新規フォームを作成」ボタンをクリックして最初のフォームを作成しましょう。</p>
        </div>
      ) : (
        <div className="dashboard">
          {forms.map((form) => (
            <div key={form.formId} className="form-card">
              <h3 className="form-card-title">{form.title}</h3>
              <p className="form-card-description">{form.description}</p>
              <div className="form-card-footer">
                <span className="form-card-date">作成: {formatDate(form.createdAt)}</span>
                <Link to={`/forms/${form.formId}`}>
                  <button className="button">表示</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
