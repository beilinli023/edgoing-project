import express from 'express';
import { validateAdminCredentials } from '../config/admin.mjs';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.mjs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || 'c9e3a0a9c1a5a9e3a0a9c1a5a9e3a0a9c1a5a9e3a0a9c1a5a9e3a0a9c1a5a9e3a0a9c1a5a9e3a0a9c1a5a9e3a0a9c1a5';

// 登录页面
router.get('/login', isNotAuthenticated, (req, res) => {
  const error = req.query.error;

  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>管理员登录 - EdGoing API服务</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #333;
        }
        .login-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 360px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .login-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 24px;
          font-weight: 600;
        }
        .login-header p {
          margin: 10px 0 0;
          color: #7f8c8d;
          font-size: 14px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #2c3e50;
        }
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }
        input:focus {
          border-color: #3498db;
          outline: none;
        }
        button {
          width: 100%;
          padding: 12px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #2980b9;
        }
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
        .back-link {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
        }
        .back-link a {
          color: #3498db;
          text-decoration: none;
        }
        .back-link a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <div class="login-header">
          <h1>管理员登录</h1>
          <p>请输入您的管理员凭据</p>
        </div>

        ${error ? `<div class="error-message">${error}</div>` : ''}

        <form action="/admin/login" method="POST">
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" name="username" required autocomplete="username">
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" name="password" required autocomplete="current-password">
          </div>

          <button type="submit">登录</button>
        </form>

        <div class="back-link">
          <a href="/">返回首页</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 处理登录请求
router.post('/login', isNotAuthenticated, async (req, res) => {
  const { username, password } = req.body;

  // 验证用户名和密码
  try {
    const isValid = await validateAdminCredentials(username, password);

    if (isValid) {
      // 登录成功，设置会话
      req.session.isAuthenticated = true;
      req.session.username = username;

      // 重定向到之前尝试访问的页面，或默认到仪表板
      const returnTo = req.session.returnTo || '/admin/dashboard';
      delete req.session.returnTo;

      res.redirect(returnTo);
    } else {
      // 登录失败
      res.redirect('/admin/login?error=用户名或密码不正确');
    }
  } catch (error) {
    console.error('登录验证错误:', error);
    res.redirect('/admin/login?error=登录过程中发生错误，请稍后再试');
  }
});

// 管理员仪表板
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    // 获取表单提交数据
    let formSubmissions = [];
    try {
      const formSubmissionsResponse = await axios.get(`${STRAPI_URL}/api/form-submissions?populate=*`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      });

      if (formSubmissionsResponse.data && formSubmissionsResponse.data.data) {
        formSubmissions = formSubmissionsResponse.data.data;
        console.log('表单提交数据结构:', JSON.stringify(formSubmissions[0], null, 2));
      }
    } catch (error) {
      console.error('获取表单提交数据失败:', error.message);
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>管理员仪表板 - EdGoing API服务</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e1e5eb;
          }
          .header h1 {
            margin: 0;
            color: #2c3e50;
            font-size: 24px;
          }
          .header-actions {
            display: flex;
            align-items: center;
          }
          .user-info {
            margin-right: 20px;
            font-size: 14px;
            color: #7f8c8d;
          }
          .user-info strong {
            color: #2c3e50;
          }
          .logout-btn {
            padding: 8px 16px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            text-decoration: none;
          }
          .logout-btn:hover {
            background-color: #c0392b;
          }
          .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
            overflow: hidden;
          }
          .card-header {
            padding: 20px;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e1e5eb;
          }
          .card-header h2 {
            margin: 0;
            font-size: 18px;
            color: #2c3e50;
          }
          .card-body {
            padding: 20px;
          }
          .table-container {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e1e5eb;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
          }
          td {
            font-size: 14px;
          }
          tr:hover {
            background-color: #f8f9fa;
          }
          .empty-state {
            padding: 40px;
            text-align: center;
            color: #7f8c8d;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }
          .badge-success {
            background-color: #e3fcef;
            color: #0c905d;
          }
          .badge-primary {
            background-color: #e1f0ff;
            color: #1a73e8;
          }
          .view-link {
            color: #3498db;
            text-decoration: none;
          }
          .view-link:hover {
            text-decoration: underline;
          }
          .actions {
            margin-bottom: 20px;
            text-align: right;
          }
          .download-btn {
            display: inline-block;
            padding: 10px 16px;
            background-color: #27ae60;
            color: white;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
          }
          .download-btn:hover {
            background-color: #219653;
            text-decoration: none;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e1e5eb;
            text-align: center;
            font-size: 14px;
            color: #7f8c8d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>管理员仪表板</h1>
            <div class="header-actions">
              <div class="user-info">
                登录为: <strong>${req.session.username}</strong>
              </div>
              <a href="/admin/logout" class="logout-btn">登出</a>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>表单提交数据</h2>
            </div>
            <div class="card-body">
              <div class="table-container">
                <div class="actions">
                  <a href="/admin/download-submissions" class="download-btn" style="margin-right: 10px;">下载CSV文件</a>
                  <a href="/admin/download-submissions-json" class="download-btn" style="background-color: #3498db;">下载JSON文件</a>
                </div>
                ${formSubmissions.length > 0 ? `
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>角色</th>
                        <th>姓名</th>
                        <th>邮箱</th>
                        <th>电话</th>
                        <th>学校</th>
                        <th>年级</th>
                        <th>省份</th>
                        <th>城市</th>
                        <th>目的地</th>
                        <th>兴趣</th>
                        <th>提交时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${formSubmissions.map(submission => {
                        // 检查数据结构
                        const id = submission.id || '';
                        const attrs = submission.attributes || {};

                        // 提取字段值，并提供默认值
                        const role = attrs.role || '';
                        const lastName = attrs.lastName || '';
                        const firstName = attrs.firstName || '';
                        const email = attrs.email || '';
                        const phone = attrs.phone || '';
                        const schoolName = attrs.schoolName || '-';
                        const gradeLevel = attrs.gradeLevel || '';
                        const province = attrs.province || '-';
                        const city = attrs.city || '-';
                        const destinations = attrs.destinations || '-';
                        const interests = attrs.interests || '-';
                        // 使用submittedAt字段作为提交时间，如果不存在则使用createdAt字段
                        const submittedAt = attrs.submittedAt ? new Date(attrs.submittedAt).toLocaleString('zh-CN') :
                                           (attrs.createdAt ? new Date(attrs.createdAt).toLocaleString('zh-CN') : '-');

                        // 解析角色
                        let roleDisplay = '其他';
                        if (role === 'student') roleDisplay = '学生';
                        else if (role === 'parent') roleDisplay = '家长';
                        else if (role === 'teacher') roleDisplay = '教师';
                        else if (role === 'school_admin') roleDisplay = '学校管理员';

                        // 解析年级
                        let gradeLevelDisplay = '其他';
                        if (gradeLevel === 'elementary') gradeLevelDisplay = '小学';
                        else if (gradeLevel === 'middle') gradeLevelDisplay = '初中';
                        else if (gradeLevel === 'high') gradeLevelDisplay = '高中';
                        else if (gradeLevel === 'college') gradeLevelDisplay = '大学';

                        return `
                        <tr>
                          <td>${id}</td>
                          <td>
                            <span class="badge badge-primary">
                              ${roleDisplay}
                            </span>
                          </td>
                          <td>${lastName} ${firstName}</td>
                          <td>${email}</td>
                          <td>${phone}</td>
                          <td>${schoolName}</td>
                          <td>${gradeLevelDisplay}</td>
                          <td>${province}</td>
                          <td>${city}</td>
                          <td>${destinations}</td>
                          <td>${interests}</td>
                          <td>${submittedAt}</td>
                          <td>
                            <a href="/admin/form-submissions/${id}" class="view-link">查看详情</a>
                          </td>
                        </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                ` : `
                  <div class="empty-state">
                    <p>暂无表单提交数据</p>
                  </div>
                `}
              </div>
            </div>
          </div>

          <div class="footer">
            &copy; ${new Date().getFullYear()} EdGoing API服务 | 管理员仪表板
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('获取表单提交数据失败:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>错误 - EdGoing API服务</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
          }
          .error-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            padding: 40px;
            width: 400px;
            text-align: center;
          }
          h1 {
            color: #e74c3c;
            margin-top: 0;
          }
          p {
            margin-bottom: 20px;
          }
          .back-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
          }
          .back-link:hover {
            background-color: #2980b9;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>发生错误</h1>
          <p>获取表单提交数据时发生错误，请稍后再试。</p>
          <a href="/admin/dashboard" class="back-link">刷新页面</a>
        </div>
      </body>
      </html>
    `);
  }
});

// 查看表单提交详情
router.get('/form-submissions/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    let submission = null;

    try {
      // 先尝试直接获取表单提交详情
      const response = await axios.get(`${STRAPI_URL}/api/form-submissions/${id}`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      });

      console.log('表单提交详情响应:', JSON.stringify(response.data, null, 2));
      submission = response.data.data || {};
    } catch (error) {
      console.log('直接获取表单提交详情失败，尝试从列表中获取:', error.message);

      // 如果直接获取失败，尝试从列表中获取
      const listResponse = await axios.get(`${STRAPI_URL}/api/form-submissions`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      });

      if (listResponse.data && listResponse.data.data) {
        // 从列表中查找指定ID的表单提交
        const foundSubmission = listResponse.data.data.find(item => item.id.toString() === id.toString());
        if (foundSubmission) {
          submission = {
            id: foundSubmission.id,
            attributes: foundSubmission
          };
          delete submission.attributes.id; // 移除重复的ID字段
          console.log('从列表中找到表单提交:', JSON.stringify(submission, null, 2));
        }
      }
    }

    if (!submission) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>未找到 - EdGoing API服务</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f7f9fc;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              color: #333;
            }
            .error-container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
              padding: 40px;
              width: 400px;
              text-align: center;
            }
            h1 {
              color: #e74c3c;
              margin-top: 0;
            }
            p {
              margin-bottom: 20px;
            }
            .back-link {
              display: inline-block;
              padding: 10px 20px;
              background-color: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              transition: background-color 0.3s;
            }
            .back-link:hover {
              background-color: #2980b9;
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>未找到</h1>
            <p>未找到ID为 ${id} 的表单提交数据。</p>
            <a href="/admin/dashboard" class="back-link">返回仪表板</a>
          </div>
        </body>
        </html>
      `);
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>表单提交详情 - EdGoing API服务</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e1e5eb;
          }
          .header h1 {
            margin: 0;
            color: #2c3e50;
            font-size: 24px;
          }
          .back-link {
            color: #3498db;
            text-decoration: none;
            display: flex;
            align-items: center;
          }
          .back-link:hover {
            text-decoration: underline;
          }
          .back-link:before {
            content: '←';
            margin-right: 5px;
          }
          .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
            overflow: hidden;
          }
          .card-header {
            padding: 20px;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e1e5eb;
          }
          .card-header h2 {
            margin: 0;
            font-size: 18px;
            color: #2c3e50;
          }
          .card-body {
            padding: 20px;
          }
          .info-group {
            margin-bottom: 20px;
          }
          .info-group:last-child {
            margin-bottom: 0;
          }
          .info-group h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #2c3e50;
            border-bottom: 1px solid #e1e5eb;
            padding-bottom: 10px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-label {
            width: 150px;
            font-weight: 600;
            color: #7f8c8d;
            font-size: 14px;
          }
          .info-value {
            flex: 1;
            font-size: 14px;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }
          .badge-success {
            background-color: #e3fcef;
            color: #0c905d;
          }
          .badge-primary {
            background-color: #e1f0ff;
            color: #1a73e8;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e1e5eb;
            text-align: center;
            font-size: 14px;
            color: #7f8c8d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>表单提交详情</h1>
            <a href="/admin/dashboard" class="back-link">返回仪表板</a>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>提交信息 #${submission.id || ''}</h2>
            </div>
            <div class="card-body">
              <div class="info-group">
                <h3>个人信息</h3>
                <div class="info-row">
                  <div class="info-label">角色</div>
                  <div class="info-value">
                    <span class="badge badge-primary">
                      ${(submission.attributes && submission.attributes.role === 'student') ? '学生' :
                        (submission.attributes && submission.attributes.role === 'parent') ? '家长' :
                        (submission.attributes && submission.attributes.role === 'teacher') ? '教师' :
                        (submission.attributes && submission.attributes.role === 'school_admin') ? '学校管理员' : '其他'}
                    </span>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-label">姓名</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.lastName) || ''} ${(submission.attributes && submission.attributes.firstName) || ''}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">邮箱</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.email) || ''}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">电话</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.phone) || ''}</div>
                </div>
              </div>

              <div class="info-group">
                <h3>教育信息</h3>
                <div class="info-row">
                  <div class="info-label">学校名称</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.schoolName) || '-'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">年级</div>
                  <div class="info-value">
                    ${(submission.attributes && submission.attributes.gradeLevel === 'elementary') ? '小学' :
                      (submission.attributes && submission.attributes.gradeLevel === 'middle') ? '初中' :
                      (submission.attributes && submission.attributes.gradeLevel === 'high') ? '高中' :
                      (submission.attributes && submission.attributes.gradeLevel === 'college') ? '大学' : '其他'}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-label">省份</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.province) || '-'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">城市</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.city) || '-'}</div>
                </div>
              </div>

              <div class="info-group">
                <h3>兴趣和目的地</h3>
                <div class="info-row">
                  <div class="info-label">目的地</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.destinations) || '-'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">兴趣</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.interests) || '-'}</div>
                </div>
              </div>

              <div class="info-group">
                <h3>其他信息</h3>
                <div class="info-row">
                  <div class="info-label">问题</div>
                  <div class="info-value">${(submission.attributes && submission.attributes.questions) || '-'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">同意接收信息</div>
                  <div class="info-value">
                    ${(submission.attributes && submission.attributes.agreeToReceiveInfo) ?
                      '<span class="badge badge-success">是</span>' :
                      '<span class="badge badge-danger">否</span>'}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-label">提交时间</div>
                  <div class="info-value">
                    ${(submission.attributes && submission.attributes.submittedAt) ?
                      new Date(submission.attributes.submittedAt).toLocaleString('zh-CN') :
                      ((submission.attributes && submission.attributes.createdAt) ?
                        new Date(submission.attributes.createdAt).toLocaleString('zh-CN') : '-')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            &copy; ${new Date().getFullYear()} EdGoing API服务 | 管理员仪表板
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('获取表单提交详情失败:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>错误 - EdGoing API服务</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
          }
          .error-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            padding: 40px;
            width: 400px;
            text-align: center;
          }
          h1 {
            color: #e74c3c;
            margin-top: 0;
          }
          p {
            margin-bottom: 20px;
          }
          .back-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
          }
          .back-link:hover {
            background-color: #2980b9;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>发生错误</h1>
          <p>获取表单提交详情时发生错误，请稍后再试。</p>
          <a href="/admin/dashboard" class="back-link">返回仪表板</a>
        </div>
      </body>
      </html>
    `);
  }
});

// 下载表单提交数据为CSV格式
router.get('/download-submissions', isAuthenticated, async (req, res) => {
  try {
    // 获取表单提交数据
    const formSubmissionsResponse = await axios.get(`${STRAPI_URL}/api/form-submissions?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    let formSubmissions = [];
    if (formSubmissionsResponse.data && formSubmissionsResponse.data.data) {
      formSubmissions = formSubmissionsResponse.data.data;
      console.log('获取到的表单提交数据数量:', formSubmissions.length);
      if (formSubmissions.length > 0) {
        console.log('第一条数据结构:', JSON.stringify(formSubmissions[0], null, 2));
      } else {
        console.log('没有获取到表单提交数据');
      }
    } else {
      console.log('响应数据结构不符合预期:', JSON.stringify(formSubmissionsResponse.data, null, 2));
    }

    // 生成CSV文件内容
    let csvContent = 'ID,角色,姓,名,邮箱,电话,学校,年级,省份,城市,目的地,兴趣,问题,同意接收信息,提交时间\n';

    formSubmissions.forEach(submission => {
      // 检查数据结构
      console.log('处理数据:', JSON.stringify(submission, null, 2));

      // 处理两种可能的数据结构
      let id, attrs;

      if (submission.attributes) {
        // 标准Strapi响应结构
        id = submission.id || '';
        attrs = submission.attributes || {};
      } else {
        // 列表API返回的数据结构
        id = submission.id || '';
        attrs = submission; // 整个对象就是属性
      }

      // 提取字段值，并提供默认值
      const role = attrs.role || '';
      const lastName = attrs.lastName || '';
      const firstName = attrs.firstName || '';
      const email = attrs.email || '';
      const phone = attrs.phone || '';
      const schoolName = attrs.schoolName || '';
      const gradeLevel = attrs.gradeLevel || '';
      const province = attrs.province || '';
      const city = attrs.city || '';
      const destinations = attrs.destinations || '';
      const interests = attrs.interests || '';
      const questions = attrs.questions ? attrs.questions.replace(/,/g, '、').replace(/\n/g, ' ') : '';
      const agreeToReceiveInfo = attrs.agreeToReceiveInfo ? '是' : '否';
      // 使用submittedAt字段作为提交时间，如果不存在则使用createdAt字段
      const submittedTime = attrs.submittedAt ? new Date(attrs.submittedAt).toLocaleString('zh-CN') :
                         (attrs.createdAt ? new Date(attrs.createdAt).toLocaleString('zh-CN') : '');

      // 解析角色
      let roleDisplay = '其他';
      if (role === 'student') roleDisplay = '学生';
      else if (role === 'parent') roleDisplay = '家长';
      else if (role === 'teacher') roleDisplay = '教师';
      else if (role === 'school_admin') roleDisplay = '学校管理员';

      // 解析年级
      let gradeLevelDisplay = '其他';
      if (gradeLevel === 'elementary') gradeLevelDisplay = '小学';
      else if (gradeLevel === 'middle') gradeLevelDisplay = '初中';
      else if (gradeLevel === 'high') gradeLevelDisplay = '高中';
      else if (gradeLevel === 'college') gradeLevelDisplay = '大学';

      // 添加到CSV内容
      csvContent += `${id},${roleDisplay},${lastName},${firstName},${email},${phone},${schoolName},${gradeLevelDisplay},${province},${city},${destinations},${interests},${questions},${agreeToReceiveInfo},${submittedTime}\n`;
    });

    // 设置响应头，指定文件类型和文件名
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=form-submissions.csv');

    // 添加BOM，确保Excel正确识别UTF-8编码
    res.write('\ufeff');

    // 发送CSV内容
    res.end(csvContent);
  } catch (error) {
    console.error('生成CSV文件失败:', error);
    res.status(500).send('生成CSV文件失败，请稍后再试。');
  }
});

// 下载表单提交数据为JSON格式
router.get('/download-submissions-json', isAuthenticated, async (req, res) => {
  try {
    // 获取表单提交数据
    const formSubmissionsResponse = await axios.get(`${STRAPI_URL}/api/form-submissions?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    let formSubmissions = [];
    if (formSubmissionsResponse.data && formSubmissionsResponse.data.data) {
      formSubmissions = formSubmissionsResponse.data.data;
      console.log('JSON导出: 获取到的表单提交数据数量:', formSubmissions.length);
      if (formSubmissions.length > 0) {
        console.log('JSON导出: 第一条数据结构:', JSON.stringify(formSubmissions[0], null, 2));
      }
    } else {
      console.log('JSON导出: 响应数据结构不符合预期:', JSON.stringify(formSubmissionsResponse.data, null, 2));
    }

    // 处理数据，使其更易读
    const processedData = formSubmissions.map(submission => {
      // 处理两种可能的数据结构
      let id, attrs;

      if (submission.attributes) {
        // 标准Strapi响应结构
        id = submission.id || '';
        attrs = submission.attributes || {};
      } else {
        // 列表API返回的数据结构
        id = submission.id || '';
        attrs = submission; // 整个对象就是属性
      }

      // 解析角色
      let roleDisplay = '其他';
      if (attrs.role === 'student') roleDisplay = '学生';
      else if (attrs.role === 'parent') roleDisplay = '家长';
      else if (attrs.role === 'teacher') roleDisplay = '教师';
      else if (attrs.role === 'school_admin') roleDisplay = '学校管理员';

      // 解析年级
      let gradeLevelDisplay = '其他';
      if (attrs.gradeLevel === 'elementary') gradeLevelDisplay = '小学';
      else if (attrs.gradeLevel === 'middle') gradeLevelDisplay = '初中';
      else if (attrs.gradeLevel === 'high') gradeLevelDisplay = '高中';
      else if (attrs.gradeLevel === 'college') gradeLevelDisplay = '大学';

      // 格式化时间
      const createdAt = attrs.createdAt ? new Date(attrs.createdAt).toLocaleString('zh-CN') : '';
      const updatedAt = attrs.updatedAt ? new Date(attrs.updatedAt).toLocaleString('zh-CN') : '';
      // 使用submittedAt字段作为提交时间，如果不存在则使用createdAt字段
      const submittedAt = attrs.submittedAt ? new Date(attrs.submittedAt).toLocaleString('zh-CN') :
                         (attrs.createdAt ? new Date(attrs.createdAt).toLocaleString('zh-CN') : '');

      // 返回格式化的数据
      return {
        id,
        role: attrs.role,
        roleDisplay,
        lastName: attrs.lastName || '',
        firstName: attrs.firstName || '',
        email: attrs.email || '',
        phone: attrs.phone || '',
        schoolName: attrs.schoolName || '',
        gradeLevel: attrs.gradeLevel,
        gradeLevelDisplay,
        province: attrs.province || '',
        city: attrs.city || '',
        destinations: attrs.destinations || '',
        interests: attrs.interests || '',
        questions: attrs.questions || '',
        agreeToReceiveInfo: attrs.agreeToReceiveInfo ? true : false,
        submittedAt,
        createdAt,
        updatedAt
      };
    });

    // 生成JSON文件内容
    const jsonContent = JSON.stringify(processedData, null, 2);

    // 设置响应头，指定文件类型和文件名
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=form-submissions.json');

    // 发送JSON内容
    res.end(jsonContent);
  } catch (error) {
    console.error('生成JSON文件失败:', error);
    res.status(500).send('生成JSON文件失败，请稍后再试。');
  }
});

// 登出
router.get('/logout', (req, res) => {
  // 清除会话
  req.session.destroy(err => {
    if (err) {
      console.error('登出错误:', err);
    }

    // 重定向到首页
    res.redirect('/');
  });
});

export default router;
