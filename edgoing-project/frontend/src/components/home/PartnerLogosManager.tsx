import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, Upload, ExternalLink, Edit, MoveUp, MoveDown } from 'lucide-react';
import axios from 'axios';

interface PartnerLogo {
  id: number;
  name: string;
  image_url: string;
  website_url?: string;
  description?: string;
  order?: number;
}

interface NewPartnerLogo {
  name_en: string;
  name_zh: string;
  image: File | null;
  website_url: string;
  description_en: string;
  description_zh: string;
}

const PartnerLogosManager: React.FC = () => {
  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLogo, setNewLogo] = useState<NewPartnerLogo>({
    name_en: '',
    name_zh: '',
    image: null,
    website_url: '',
    description_en: '',
    description_zh: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingLogo, setEditingLogo] = useState<PartnerLogo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  // 获取合作伙伴Logo列表
  const fetchLogos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/partner-logos?language=en');
      if (response.data) {
        setLogos(response.data);
      }
    } catch (error) {
      console.error('Error fetching partner logos:', error);
      toast({
        title: '获取数据失败',
        description: '无法加载合作伙伴Logo数据',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件加载时获取数据
  useEffect(() => {
    fetchLogos();
  }, []);
  
  // 处理图片选择
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewLogo({ ...newLogo, image: file });
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLogo({ ...newLogo, [name]: value });
  };
  
  // 添加新Logo
  const handleAddLogo = async () => {
    if (!newLogo.name_en || !newLogo.name_zh || !newLogo.image) {
      toast({
        title: '表单不完整',
        description: '请填写名称并上传Logo图片',
        variant: 'destructive'
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 这里应该是实际的API调用，将数据发送到Strapi
      // 由于这是一个模拟实现，我们只是添加到本地状态
      
      // 模拟上传成功
      setTimeout(() => {
        const newId = Math.max(0, ...logos.map(logo => logo.id)) + 1;
        const newLogoItem: PartnerLogo = {
          id: newId,
          name: newLogo.name_en,
          image_url: previewUrl || '',
          website_url: newLogo.website_url,
          description: newLogo.description_en,
          order: logos.length
        };
        
        setLogos([...logos, newLogoItem]);
        
        // 重置表单
        setNewLogo({
          name_en: '',
          name_zh: '',
          image: null,
          website_url: '',
          description_en: '',
          description_zh: ''
        });
        setPreviewUrl(null);
        setIsDialogOpen(false);
        
        toast({
          title: '添加成功',
          description: '新的合作伙伴Logo已添加'
        });
        
        setIsUploading(false);
      }, 1500);
    } catch (error) {
      console.error('Error adding partner logo:', error);
      toast({
        title: '添加失败',
        description: '无法添加新的合作伙伴Logo',
        variant: 'destructive'
      });
      setIsUploading(false);
    }
  };
  
  // 删除Logo
  const handleDeleteLogo = async (id: number) => {
    try {
      // 这里应该是实际的API调用，从Strapi删除数据
      // 由于这是一个模拟实现，我们只是从本地状态中删除
      
      setLogos(logos.filter(logo => logo.id !== id));
      
      toast({
        title: '删除成功',
        description: '合作伙伴Logo已删除'
      });
    } catch (error) {
      console.error('Error deleting partner logo:', error);
      toast({
        title: '删除失败',
        description: '无法删除合作伙伴Logo',
        variant: 'destructive'
      });
    }
  };
  
  // 移动Logo顺序
  const handleMoveOrder = (id: number, direction: 'up' | 'down') => {
    const index = logos.findIndex(logo => logo.id === id);
    if (index === -1) return;
    
    const newLogos = [...logos];
    
    if (direction === 'up' && index > 0) {
      // 向上移动
      [newLogos[index], newLogos[index - 1]] = [newLogos[index - 1], newLogos[index]];
    } else if (direction === 'down' && index < logos.length - 1) {
      // 向下移动
      [newLogos[index], newLogos[index + 1]] = [newLogos[index + 1], newLogos[index]];
    }
    
    // 更新顺序号
    newLogos.forEach((logo, idx) => {
      logo.order = idx;
    });
    
    setLogos(newLogos);
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>合作伙伴Logo墙管理</CardTitle>
        <CardDescription>添加、编辑和管理首页上显示的合作伙伴Logo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 添加新Logo按钮 */}
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加新Logo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>添加新的合作伙伴Logo</DialogTitle>
                  <DialogDescription>
                    上传合作伙伴的Logo图片并填写相关信息
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name_en" className="text-right">
                      英文名称
                    </Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={newLogo.name_en}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name_zh" className="text-right">
                      中文名称
                    </Label>
                    <Input
                      id="name_zh"
                      name="name_zh"
                      value={newLogo.name_zh}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website_url" className="text-right">
                      网站链接
                    </Label>
                    <Input
                      id="website_url"
                      name="website_url"
                      value={newLogo.website_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description_en" className="text-right pt-2">
                      英文描述
                    </Label>
                    <Textarea
                      id="description_en"
                      name="description_en"
                      value={newLogo.description_en}
                      onChange={handleInputChange}
                      className="col-span-3"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description_zh" className="text-right pt-2">
                      中文描述
                    </Label>
                    <Textarea
                      id="description_zh"
                      name="description_zh"
                      value={newLogo.description_zh}
                      onChange={handleInputChange}
                      className="col-span-3"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="logo_image" className="text-right pt-2">
                      Logo图片
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('logo_image')?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          选择图片
                        </Button>
                        <Input
                          id="logo_image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      
                      {previewUrl && (
                        <div className="mt-2 border rounded p-2 flex justify-center">
                          <img
                            src={previewUrl}
                            alt="Logo预览"
                            className="max-h-32 object-contain"
                          />
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        推荐尺寸: 200x100像素，透明背景的PNG或SVG格式
                      </p>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleAddLogo}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        上传中...
                      </>
                    ) : (
                      '保存'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Logo列表 */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : logos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">预览</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>网站链接</TableHead>
                  <TableHead className="w-[150px]">排序</TableHead>
                  <TableHead className="text-right w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logos.map((logo) => (
                  <TableRow key={logo.id}>
                    <TableCell>
                      <div className="h-10 w-20 flex items-center justify-center">
                        <img
                          src={logo.image_url}
                          alt={logo.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{logo.name}</TableCell>
                    <TableCell>
                      {logo.website_url ? (
                        <a
                          href={logo.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          {logo.website_url.replace(/^https?:\/\//, '').split('/')[0]}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">无链接</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveOrder(logo.id, 'up')}
                          disabled={logos.indexOf(logo) === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveOrder(logo.id, 'down')}
                          disabled={logos.indexOf(logo) === logos.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {logos.indexOf(logo) + 1} / {logos.length}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingLogo(logo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                您确定要删除"{logo.name}"吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteLogo(logo.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">暂无合作伙伴Logo</p>
              <p className="text-sm text-muted-foreground mt-1">
                点击"添加新Logo"按钮来添加合作伙伴
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerLogosManager;
