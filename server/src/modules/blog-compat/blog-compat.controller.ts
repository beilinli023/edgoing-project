import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 兼容旧式API路径的控制器
 * 这个控制器将 /blog-posts 路径重定向到 /proxy/blog
 */
@Controller('blog-posts')
export class BlogCompatController {
  /**
   * 将所有旧的路径请求重定向到新路径
   */
  @All()
  redirectToBlog(@Req() req: Request, @Res() res: Response) {
    // 构建新URL，保留所有查询参数
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    const newUrl = `/proxy/blog${queryString ? '?' + queryString : ''}`;
    
    // 重定向到新路径
    return res.redirect(302, newUrl);
  }
} 