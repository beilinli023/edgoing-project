
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilmIcon, Plus, Trash2, Edit, Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

// 模拟视频数据
interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  createdAt: string;
}

const mockVideos: Video[] = [
  {
    id: "1",
    title: "留学申请指南",
    description: "详细介绍如何申请国际知名大学",
    url: "https://example.com/video1.mp4",
    thumbnail: "https://placehold.co/300x200/2563eb/FFFFFF/png?text=留学申请指南",
    createdAt: "2023-06-15"
  },
  {
    id: "2",
    title: "美国文化体验",
    description: "探索美国校园文化与生活方式",
    url: "https://example.com/video2.mp4",
    thumbnail: "https://placehold.co/300x200/2563eb/FFFFFF/png?text=美国文化体验",
    createdAt: "2023-07-20"
  }
];

const VideoLibrary: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [isUploading, setIsUploading] = useState(false);
  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      
      // 生成一个预览URL，实际项目中可能会直接上传并获取服务器URL
      const videoPreviewUrl = URL.createObjectURL(files[0]);
      setNewVideo({
        ...newVideo,
        url: videoPreviewUrl,
        thumbnail: "https://placehold.co/300x200/2563eb/FFFFFF/png?text=新上传视频"
      });
      
      toast({
        title: "视频已选择",
        description: `已选择视频: ${files[0].name}`,
      });
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "错误",
        description: "请先选择一个视频文件",
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

    setIsUploading(true);
    
    // 模拟上传过程
    setTimeout(() => {
      const uploadedVideo: Video = {
        id: Date.now().toString(),
        title: newVideo.title || "未命名视频",
        description: newVideo.description || "",
        url: newVideo.url || "",
        thumbnail: newVideo.thumbnail || "",
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setVideos([uploadedVideo, ...videos]);
      setIsUploading(false);
      setSelectedFile(null);
      setNewVideo({
        title: "",
        description: "",
      });
      setShowAddDialog(false);
      
      toast({
        title: "上传成功",
        description: "视频已成功上传到媒体库",
      });
    }, 2000);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setShowEditDialog(true);
  };

  const saveEdit = () => {
    if (!editingVideo) return;
    
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
        <h3 className="text-xl font-medium">上传视频库</h3>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              上传新视频
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>上传新视频</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="videoFile">选择视频文件</Label>
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                />
                <p className="text-xs text-muted-foreground mt-1">支持MP4, WebM, MOV格式，最大文件大小50MB</p>
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
                <Input
                  id="description"
                  value={newVideo.description || ""}
                  onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  placeholder="简要描述视频内容"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    上传中...
                  </>
                ) : (
                  "上传视频"
                )}
              </Button>
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
                  <Label htmlFor="edit-title">视频标题</Label>
                  <Input
                    id="edit-title"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-description">视频描述</Label>
                  <Input
                    id="edit-description"
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
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
          <FilmIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">还没有上传视频</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            上传视频文件将显示在此处，您可以管理和编辑所有视频的信息
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            上传第一个视频
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
                  <Button variant="secondary" size="sm" className="rounded-full">
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {video.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      上传于: {video.createdAt}
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

export default VideoLibrary;
