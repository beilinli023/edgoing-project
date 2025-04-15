
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilmIcon, Plus, Trash2, Edit, ExternalLink, Youtube } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

// 模拟外部视频数据
interface ExternalVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  embedCode: string;
  platform: 'youtube' | 'tencent';
  thumbnail: string;
  createdAt: string;
}

const mockExternalVideos: ExternalVideo[] = [
  {
    id: "1",
    title: "英国留学体验分享",
    description: "学生分享在牛津大学的留学经历和体验",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedCode: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    platform: 'youtube',
    thumbnail: "https://placehold.co/300x200/FF0000/FFFFFF/png?text=YouTube",
    createdAt: "2023-08-10"
  },
  {
    id: "2",
    title: "中国文化探索",
    description: "探索中国传统文化与现代教育的结合",
    url: "https://v.qq.com/x/cover/mzc00200mzrtjip/g0040vtza28.html",
    embedCode: '<iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=g0040vtza28" allowFullScreen="true"></iframe>',
    platform: 'tencent',
    thumbnail: "https://placehold.co/300x200/00A0E9/FFFFFF/png?text=腾讯视频",
    createdAt: "2023-09-05"
  }
];

const ExternalVideoLibrary: React.FC = () => {
  const [videos, setVideos] = useState<ExternalVideo[]>(mockExternalVideos);
  const [newVideo, setNewVideo] = useState<Partial<ExternalVideo>>({
    title: "",
    description: "",
    url: "",
    platform: 'youtube',
  });
  const [editingVideo, setEditingVideo] = useState<ExternalVideo | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const generateEmbedCode = (url: string, platform: 'youtube' | 'tencent'): string => {
    if (platform === 'youtube') {
      // 提取YouTube视频ID
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      const videoId = match ? match[1] : '';
      
      if (videoId) {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    } else if (platform === 'tencent') {
      // 提取腾讯视频ID
      const regex = /\/([a-z0-9]+)\.html/;
      const match = url.match(regex);
      const videoId = match ? match[1] : '';
      
      if (videoId) {
        return `<iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=${videoId}" allowFullScreen="true"></iframe>`;
      }
    }
    
    return '';
  };

  const generateThumbnail = (platform: 'youtube' | 'tencent'): string => {
    if (platform === 'youtube') {
      return "https://placehold.co/300x200/FF0000/FFFFFF/png?text=YouTube";
    } else {
      return "https://placehold.co/300x200/00A0E9/FFFFFF/png?text=腾讯视频";
    }
  };

  const handleAdd = () => {
    if (!newVideo.url) {
      toast({
        title: "错误",
        description: "请输入视频链接",
        variant: "destructive"
      });
      return;
    }
    
    if (!newVideo.title) {
      toast({
        title: "错误",
        description: "请输入视频标题",
        variant: "destructive"
      });
      return;
    }

    const embedCode = generateEmbedCode(newVideo.url, newVideo.platform as 'youtube' | 'tencent');
    
    if (!embedCode) {
      toast({
        title: "错误",
        description: "无法解析视频链接，请确保输入正确的YouTube或腾讯视频链接",
        variant: "destructive"
      });
      return;
    }

    const addedVideo: ExternalVideo = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description || "",
      url: newVideo.url,
      embedCode,
      platform: newVideo.platform as 'youtube' | 'tencent',
      thumbnail: generateThumbnail(newVideo.platform as 'youtube' | 'tencent'),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setVideos([addedVideo, ...videos]);
    setNewVideo({
      title: "",
      description: "",
      url: "",
      platform: 'youtube',
    });
    setShowAddDialog(false);
    
    toast({
      title: "添加成功",
      description: "外部视频已成功添加到媒体库",
    });
  };

  const handleEdit = (video: ExternalVideo) => {
    setEditingVideo(video);
    setShowEditDialog(true);
  };

  const saveEdit = () => {
    if (!editingVideo) return;
    
    // 如果URL发生变化，重新生成embedCode
    if (editingVideo.url !== videos.find(v => v.id === editingVideo.id)?.url) {
      const embedCode = generateEmbedCode(editingVideo.url, editingVideo.platform);
      editingVideo.embedCode = embedCode;
    }
    
    setVideos(videos.map(v => 
      v.id === editingVideo.id ? editingVideo : v
    ));
    
    setShowEditDialog(false);
    setEditingVideo(null);
    
    toast({
      title: "已更新",
      description: "视频信息已成功更新",
    });
  };

  const handleDelete = (videoId: string) => {
    setVideos(videos.filter(v => v.id !== videoId));
    toast({
      title: "已删除",
      description: "视频已从媒体库中删除",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">外部视频链接库</h3>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加外部视频
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>添加外部视频链接</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="platform">选择平台</Label>
                <Select 
                  value={newVideo.platform || 'youtube'} 
                  onValueChange={(value) => setNewVideo({...newVideo, platform: value as 'youtube' | 'tencent'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择视频平台" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tencent">腾讯视频</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="url">视频链接</Label>
                <Input
                  id="url"
                  value={newVideo.url || ""}
                  onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                  placeholder={newVideo.platform === 'youtube' 
                    ? "输入YouTube视频链接，例如：https://www.youtube.com/watch?v=..." 
                    : "输入腾讯视频链接，例如：https://v.qq.com/x/cover/.../....html"}
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">视频标题</Label>
                <Input
                  id="title"
                  value={newVideo.title || ""}
                  onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                  placeholder="输入视频标题"
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">视频描述</Label>
                <Textarea
                  id="description"
                  value={newVideo.description || ""}
                  onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  placeholder="简要描述视频内容"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button onClick={handleAdd}>添加视频</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>编辑视频信息</DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-platform">视频平台</Label>
                  <Select 
                    value={editingVideo.platform} 
                    onValueChange={(value) => setEditingVideo({...editingVideo, platform: value as 'youtube' | 'tencent'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择视频平台" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tencent">腾讯视频</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-url">视频链接</Label>
                  <Input
                    id="edit-url"
                    value={editingVideo.url}
                    onChange={(e) => setEditingVideo({...editingVideo, url: e.target.value})}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-title">视频标题</Label>
                  <Input
                    id="edit-title"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-description">视频描述</Label>
                  <Textarea
                    id="edit-description"
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button onClick={saveEdit}>保存更改</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">还没有添加外部视频链接</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            添加来自YouTube或腾讯视频的视频链接，系统将自动生成嵌入代码
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加第一个外部视频
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>
                {video.platform === 'youtube' && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-md flex items-center">
                    <Youtube className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">YouTube</span>
                  </div>
                )}
                {video.platform === 'tencent' && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-md flex items-center">
                    <span className="text-xs font-medium">腾讯视频</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {video.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      添加于: {video.createdAt}
                    </p>
                  </div>
                  <div className="flex mt-1 space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleEdit(video)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExternalVideoLibrary;
