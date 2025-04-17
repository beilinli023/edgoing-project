/**
 * 表单提交邮件模板服务
 * 
 * 提供表单提交通知邮件的模板生成功能
 */

/**
 * 生成表单提交通知邮件的HTML内容
 * 
 * @param {Object} submission - 表单提交信息对象
 * @returns {string} 格式化的HTML邮件内容
 */
export const generateFormSubmissionNotificationEmail = (submission: any): string => {
  const {
    role,
    firstName,
    lastName,
    email,
    phone,
    schoolName,
    gradeLevel,
    province,
    city,
    destinations,
    interests,
    programTypes,
    questions,
    agreeToReceiveInfo,
    submittedAt
  } = submission;
  
  const formattedDate = new Date(submittedAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>新的表单提交通知</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .header {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px 5px 0 0;
          margin-bottom: 20px;
        }
        .content {
          padding: 0 10px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #777;
        }
        .highlight {
          background-color: #fffbea;
          padding: 10px;
          border-left: 4px solid #f59e0b;
          margin: 15px 0;
        }
        .info-section {
          margin-bottom: 20px;
        }
        .info-section h3 {
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .info-item {
          margin-bottom: 8px;
        }
        .label {
          font-weight: bold;
          display: inline-block;
          width: 120px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>新的表单提交通知</h2>
        </div>
        <div class="content">
          <p>您好，管理员：</p>
          <p>系统收到了一个新的表单提交。以下是详细信息：</p>
          
          <div class="info-section">
            <h3>基本信息</h3>
            <div class="info-item"><span class="label">角色：</span>${role || '未指定'}</div>
            <div class="info-item"><span class="label">姓名：</span>${firstName} ${lastName}</div>
            <div class="info-item"><span class="label">邮箱：</span>${email}</div>
            <div class="info-item"><span class="label">电话：</span>${phone}</div>
            <div class="info-item"><span class="label">提交时间：</span>${formattedDate}</div>
          </div>
          
          <div class="info-section">
            <h3>学校信息</h3>
            <div class="info-item"><span class="label">学校名称：</span>${schoolName || '未提供'}</div>
            <div class="info-item"><span class="label">年级水平：</span>${gradeLevel || '未提供'}</div>
            <div class="info-item"><span class="label">省份：</span>${province || '未提供'}</div>
            <div class="info-item"><span class="label">城市：</span>${city || '未提供'}</div>
          </div>
          
          <div class="info-section">
            <h3>兴趣信息</h3>
            <div class="info-item"><span class="label">目的地：</span>${destinations || '未提供'}</div>
            <div class="info-item"><span class="label">兴趣：</span>${interests || '未提供'}</div>
            <div class="info-item"><span class="label">项目类型：</span>${programTypes || '未提供'}</div>
          </div>
          
          ${questions ? `
          <div class="info-section">
            <h3>问题和留言</h3>
            <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
              ${questions.replace(/\\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
          
          <div class="info-item"><span class="label">同意接收信息：</span>${agreeToReceiveInfo ? '是' : '否'}</div>
          
          <div class="highlight">
            <p>请及时跟进这个潜在的线索。您可以：</p>
            <ul>
              <li>将此联系人添加到您的CRM系统</li>
              <li>发送欢迎邮件或相关资料</li>
              <li>安排销售人员进行跟进</li>
            </ul>
          </div>
          
          <p>您可以通过登录管理后台查看所有表单提交信息：</p>
          <p><a href="http://localhost:1337/admin/content-manager/collectionType/api::form-submission.form-submission">访问表单管理页面</a></p>
        </div>
        <div class="footer">
          <p>此邮件由系统自动发送，请勿直接回复。</p>
          <p>© ${new Date().getFullYear()} YouNiKco. 保留所有权利。</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
