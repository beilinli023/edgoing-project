
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, ArrowUp, ArrowDown, Upload, Image, Loader2 } from "lucide-react";
import { useStudentStories } from "./student-stories/useStudentStories";

const StudentStoriesManager = () => {
  const {
    stories,
    newStory,
    setNewStory,
    addStory,
    removeStory,
    moveStory,
    isLoading
  } = useStudentStories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>学生故事管理</CardTitle>
        <CardDescription>管理首页学生评价和故事</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-md bg-slate-50">
            <div>
              <div className="flex justify-center items-center h-40 bg-gray-200 rounded-md mb-4">
                <div className="flex flex-col items-center text-gray-500">
                  <Image className="mb-2" size={24} />
                  <span className="text-sm">学生照片</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full">
                  <Upload size={16} className="mr-2" />
                  上传照片
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">姓名 (英文)</label>
                  <Input
                    value={newStory.name_en}
                    onChange={e => setNewStory({ ...newStory, name_en: e.target.value })}
                    placeholder="例如: Emma Thompson"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">姓名 (中文)</label>
                  <Input
                    value={newStory.name_zh}
                    onChange={e => setNewStory({ ...newStory, name_zh: e.target.value })}
                    placeholder="例如: 艾玛·汤普森"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">背景 (英文)</label>
                  <Input
                    value={newStory.background_en}
                    onChange={e => setNewStory({ ...newStory, background_en: e.target.value })}
                    placeholder="例如: High School Senior, Boston"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">背景 (中文)</label>
                  <Input
                    value={newStory.background_zh}
                    onChange={e => setNewStory({ ...newStory, background_zh: e.target.value })}
                    placeholder="例如: 高中毕业生, 波士顿"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">评分 (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={newStory.rating}
                  onChange={e => setNewStory({ ...newStory, rating: parseInt(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">评价 (英文)</label>
                <Textarea
                  value={newStory.testimonial_en}
                  onChange={e => setNewStory({ ...newStory, testimonial_en: e.target.value })}
                  placeholder="My summer program in Japan was life-changing..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">评价 (中文)</label>
                <Textarea
                  value={newStory.testimonial_zh}
                  onChange={e => setNewStory({ ...newStory, testimonial_zh: e.target.value })}
                  placeholder="我在日本的暑期项目改变了我的生活..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={addStory}>添加学生故事</Button>
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-9 gap-2 bg-muted p-3 rounded-t-md">
              <div className="col-span-1">照片</div>
              <div className="col-span-2">姓名</div>
              <div className="col-span-2">背景</div>
              <div className="col-span-1">评分</div>
              <div className="col-span-2">评价</div>
              <div className="col-span-1">操作</div>
            </div>
            <div className="divide-y">
              {stories.map(story => (
                <div key={story.id} className="grid grid-cols-9 gap-2 p-3 items-center">
                  <div className="col-span-1">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Image size={14} />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div>{story.name_en}</div>
                    <div className="text-sm text-muted-foreground">{story.name_zh}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm">{story.background_en}</div>
                    <div className="text-sm text-muted-foreground">{story.background_zh}</div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm truncate">{story.testimonial_en.substring(0, 30)}...</div>
                    <div className="text-sm text-muted-foreground truncate">{story.testimonial_zh.substring(0, 30)}...</div>
                  </div>
                  <div className="col-span-1 flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => moveStory(story.id!, 'up')}
                      disabled={stories.indexOf(story) === 0}
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => moveStory(story.id!, 'down')}
                      disabled={stories.indexOf(story) === stories.length - 1}
                    >
                      <ArrowDown size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeStory(story.id!)}>
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentStoriesManager;
