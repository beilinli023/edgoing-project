
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// 模拟获取地区数据的函数
const fetchLocations = async () => {
  // 这里应该是从API获取数据，目前使用模拟数据
  return [
    { id: "1", nameEn: "United States", nameCn: "美国", region: "North America", count: 15 },
    { id: "2", nameEn: "United Kingdom", nameCn: "英国", region: "Europe", count: 10 },
    { id: "3", nameEn: "Japan", nameCn: "日本", region: "Asia", count: 7 },
    { id: "4", nameEn: "Australia", nameCn: "澳大利亚", region: "Oceania", count: 5 },
  ];
};

const ProgramLocationManager = () => {
  const [newLocation, setNewLocation] = useState({ nameEn: "", nameCn: "", region: "" });
  const [editingLocation, setEditingLocation] = useState<any>(null);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['programLocations'],
    queryFn: fetchLocations
  });

  const handleAddLocation = () => {
    if (newLocation.nameEn && newLocation.nameCn && newLocation.region) {
      console.log("添加新地区:", newLocation);
      // 这里应该调用API添加地区
      setNewLocation({ nameEn: "", nameCn: "", region: "" });
    }
  };

  const handleStartEdit = (location: any) => {
    setEditingLocation({ ...location });
  };

  const handleSaveEdit = () => {
    if (editingLocation && editingLocation.nameEn && editingLocation.nameCn) {
      console.log("保存编辑:", editingLocation);
      // 这里应该调用API保存编辑
      setEditingLocation(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingLocation(null);
  };

  const handleDeleteLocation = (id: string) => {
    if (window.confirm("确定要删除此地区吗？此操作可能会影响已分配到该地区的项目。")) {
      console.log("删除地区:", id);
      // 这里应该调用API删除地区
    }
  };

  return (
    <div>
      <Card className="mb-6 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">添加新地区/国家</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="英文名称 (English Name)"
              value={newLocation.nameEn}
              onChange={(e) => setNewLocation({ ...newLocation, nameEn: e.target.value })}
            />
            <Input
              placeholder="中文名称 (Chinese Name)"
              value={newLocation.nameCn}
              onChange={(e) => setNewLocation({ ...newLocation, nameCn: e.target.value })}
            />
            <Input
              placeholder="所属大洲 (Region)"
              value={newLocation.region}
              onChange={(e) => setNewLocation({ ...newLocation, region: e.target.value })}
            />
          </div>
          <Button 
            onClick={handleAddLocation} 
            disabled={!newLocation.nameEn || !newLocation.nameCn || !newLocation.region}
          >
            <Plus className="mr-2 h-4 w-4" /> 添加地区/国家
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden">
              <CardContent className="p-4">
                {editingLocation && editingLocation.id === location.id ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <Input
                        placeholder="英文名称 (English Name)"
                        value={editingLocation.nameEn}
                        onChange={(e) => setEditingLocation({ ...editingLocation, nameEn: e.target.value })}
                      />
                      <Input
                        placeholder="中文名称 (Chinese Name)"
                        value={editingLocation.nameCn}
                        onChange={(e) => setEditingLocation({ ...editingLocation, nameCn: e.target.value })}
                      />
                      <Input
                        placeholder="所属大洲 (Region)"
                        value={editingLocation.region}
                        onChange={(e) => setEditingLocation({ ...editingLocation, region: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit}>保存</Button>
                      <Button variant="outline" onClick={handleCancelEdit}>取消</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{location.nameEn}</h3>
                      <p className="text-sm text-gray-500">{location.nameCn}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {location.region}
                        </span>
                        <span className="text-xs text-gray-400">
                          关联项目数: {location.count}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLocation(location.id)}
                        disabled={location.count > 0}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramLocationManager;
