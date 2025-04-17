
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SlideForm from "./hero-slider/SlideForm";
import SlidesList from "./hero-slider/SlidesList";
import { useHeroSlider } from "@/hooks/useHeroSlider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { SlideItem } from "@/hooks/useHeroSlider";

const HeroSliderManager = () => {
  const { 
    slides, 
    newSlide, 
    setNewSlide, 
    addSlide, 
    removeSlide, 
    moveSlide 
  } = useHeroSlider();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSlide = async () => {
    if (!newSlide.title_en || !newSlide.title_zh) {
      toast({
        title: "请完善表单",
        description: "请至少填写英文和中文标题",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addSlide();
      setIsAddDialogOpen(false);
      toast({
        title: "添加成功",
        description: "轮播图片已成功添加",
      });
    } catch (error) {
      toast({
        title: "添加失败",
        description: "添加轮播图片时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>轮播横幅管理</CardTitle>
        <CardDescription>管理首页轮播图片和文本内容（1-5张）</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                if (slides.length >= 5) {
                  toast({
                    title: "已达上限",
                    description: "最多只能添加5张轮播图片",
                    variant: "destructive",
                  });
                  return;
                }
                setIsAddDialogOpen(true);
              }}
            >
              <Plus size={16} className="mr-2" />
              添加轮播图片
            </Button>
          </div>
          
          <SlidesList 
            slides={slides}
            moveSlide={moveSlide}
            removeSlide={(id) => {
              if (confirm("确定要删除这张轮播图片吗？")) {
                removeSlide(id);
                toast({
                  title: "删除成功",
                  description: "轮播图片已成功删除",
                });
              }
            }}
          />

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>添加轮播图片</DialogTitle>
                <DialogDescription>
                  请上传图片并填写轮播图片的详细信息
                </DialogDescription>
              </DialogHeader>
              <SlideForm 
                newSlide={newSlide} 
                setNewSlide={setNewSlide}
                onSubmit={handleAddSlide}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSliderManager;
