
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

// 验证图片
export const validateImage = (file: File) => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '请上传图片文件 (JPG, PNG, GIF, WEBP)' };
  }
  
  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '图片大小不能超过3MB' };
  }
  
  return { valid: true, error: null };
};

// 上传图片到Supabase Storage
export const uploadImage = async (file: File, bucketName = 'program-images') => {
  try {
    // 生成唯一的文件名
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // 检查并创建bucket（如果不存在）
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: MAX_FILE_SIZE
      });
    }
    
    // 上传文件
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
      
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
    
    // 获取文件公共URL
    const { data: publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};
