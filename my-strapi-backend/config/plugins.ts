export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        // 使用Ethereal临时邮箱服务
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // 不使用SSL
        auth: {
          user: 'd3pgrgla26disbo2@ethereal.email',
          pass: '73x1vJKVYvRB8tx2H6',
        },
        // 添加调试信息
        debug: true,
        logger: true
      },
      settings: {
        defaultFrom: 'd3pgrgla26disbo2@ethereal.email',
        defaultReplyTo: 'd3pgrgla26disbo2@ethereal.email',
      },
    },
  },
});
