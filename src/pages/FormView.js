import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const FormView = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // In a real implementation, this would fetch from your API
        // const response = await API.get('formBuilderApi', `/forms/${formId}`);
        // setForm(response);
        
        // Mock data for demonstration
        setForm({
          formId,
          title: 'サンプルフォーム',
          description: 'これはサンプルフォームです。',
          jsonSchema: {
            type: 'object',
            required: ['name', 'email'],
            properties: {
              name: {
                type: 'string',
                title: 'お名前'
              },
              email: {
                type: 'string',
                format: 'email',
                title: 'メールアドレス'
              },
              age: {
                type: 'integer',
                title: '年齢',
                minimum: 0
              },
              comment: {
                type: 'string',
                title: 'コメント',
              }
            }
          },
          uiSchema: {
            comment: {
              'ui:widget': 'textarea'
            }
          },
          createdAt: '2025-05-17T10:30:00Z'
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching form:', err);
        setError('フォームの取得中にエラーが発生しました。');
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = async ({ formData }) => {
    setIsSubmitting(true);

    try {
      // In a real implementation, this would send to your API
      // await API.post('formBuilderApi', '/responses', {
      //   body: {
      //     formId,
      //     data: formData
      //   }
      // });

      // Mock submission for demonstration
      console.log('Form submitted:', formData);
      setTimeout(() => {
        setSubmitted(true);
        setIsSubmitting(false);
      }, 1000);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError('フォームの送信中にエラーが発生しました。');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!form) {
    return <div>フォームが見つかりませんでした。</div>;
  }

  return (
    <div>
      <div className="form-header">
        <h2>{form.title}</h2>
      </div>

      <div className="form-container">
        {form.description && (
          <div className="form-description" style={{ marginBottom: '20px' }}>
            {form.description}
          </div>
        )}

        {submitted ? (
          <div className="success-message">
            <h3>送信完了！</h3>
            <p>フォームの回答を受け付けました。ありがとうございました。</p>
          </div>
        ) : (
          <Form
            schema={form.jsonSchema}
            uiSchema={form.uiSchema || {}}
            validator={validator}
            formData={formData}
            onChange={e => setFormData(e.formData)}
            onSubmit={handleSubmit}
            disabled={isSubmitting}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="submit"
                className="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? '送信中...' : '送信'}
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default FormView;
