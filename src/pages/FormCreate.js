import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const FormCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jsonSchema, setJsonSchema] = useState('');
  const [uiSchema, setUiSchema] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdForm, setCreatedForm] = useState(null);

  const navigate = useNavigate();

  const validateInput = () => {
    if (!title.trim()) {
      setError('フォームのタイトルを入力してください。');
      return false;
    }

    try {
      // Validate JSON Schema
      if (!jsonSchema.trim()) {
        setError('JSON Schemaを入力してください。');
        return false;
      }
      
      const parsedSchema = JSON.parse(jsonSchema);
      
      if (!parsedSchema.type || !parsedSchema.properties) {
        setError('有効なJSON Schemaではありません。type と properties が必要です。');
        return false;
      }
    } catch (err) {
      setError('有効なJSONではありません: ' + err.message);
      return false;
    }

    // Validate UI Schema if provided
    if (uiSchema.trim()) {
      try {
        JSON.parse(uiSchema);
      } catch (err) {
        setError('UI Schemaが有効なJSONではありません: ' + err.message);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateInput()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would send the data to your API
      // const result = await API.post('formBuilderApi', '/forms', {
      //   body: {
      //     title,
      //     description,
      //     jsonSchema: JSON.parse(jsonSchema),
      //     uiSchema: uiSchema.trim() ? JSON.parse(uiSchema) : {}
      //   }
      // });

      // For now, we'll mock the API response
      const mockResult = {
        formId: 'mock-form-' + Date.now(),
        formUrl: window.location.origin + '/forms/mock-form-' + Date.now()
      };

      setCreatedForm(mockResult);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error creating form:', err);
      setError('フォームの作成中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  const handleCopyUrl = () => {
    if (createdForm && createdForm.formUrl) {
      navigator.clipboard.writeText(createdForm.formUrl)
        .then(() => {
          alert('URLをクリップボードにコピーしました！');
        })
        .catch(err => {
          console.error('URLのコピーに失敗しました:', err);
        });
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="form-header">
        <h2>新規フォームを作成</h2>
      </div>

      <div className="form-container">
        {createdForm ? (
          <div className="success-message">
            <h3>フォームが正常に作成されました！</h3>
            <p>以下のURLを使用してフォームにアクセスできます：</p>
            
            <div className="url-display">
              {createdForm.formUrl}
              <button onClick={handleCopyUrl} className="button copy-button">
                コピー
              </button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => navigate(`/forms/${createdForm.formId}`)} className="button">
                フォームを表示
              </button>
              <button 
                onClick={handleBackToDashboard} 
                className="button" 
                style={{ marginLeft: '10px', background: '#6c757d' }}
              >
                ダッシュボードに戻る
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="title">フォームタイトル *</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">説明</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="jsonSchema">JSON Schema *</label>
              <textarea
                id="jsonSchema"
                className="form-control json-editor"
                value={jsonSchema}
                onChange={(e) => setJsonSchema(e.target.value)}
                placeholder='例: {"type": "object", "properties": {"name": {"type": "string", "title": "名前"}}}'
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="uiSchema">UI Schema (オプション)</label>
              <textarea
                id="uiSchema"
                className="form-control json-editor"
                value={uiSchema}
                onChange={(e) => setUiSchema(e.target.value)}
                placeholder='例: {"name": {"ui:autofocus": true}}'
              />
            </div>
            
            <div className="form-group">
              <button 
                type="submit" 
                className="button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? '作成中...' : 'フォームを作成'}
              </button>
              <button 
                type="button" 
                onClick={handleBackToDashboard} 
                className="button" 
                style={{ marginLeft: '10px', background: '#6c757d' }}
                disabled={isSubmitting}
              >
                キャンセル
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormCreate;
