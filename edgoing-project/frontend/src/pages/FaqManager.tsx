
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/common/PageHeader";
import FaqSearchBar from "@/components/faq/FaqSearchBar";
import FaqTable from "@/components/faq/FaqTable";
import DeleteConfirmDialog from "@/components/faq/DeleteConfirmDialog";
import { faqData } from "@/components/faq/mockData";

const FaqManager = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);

  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleAddFaq = () => {
    navigate("/admin/faq/add");
  };

  const handleEditFaq = (id: string) => {
    navigate(`/admin/faq/edit/${id}`);
  };

  const handleDeleteFaq = (id: string) => {
    setSelectedFaq(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: "删除成功",
      description: "FAQ已成功删除",
    });
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader 
        title="FAQ管理" 
        description="管理常见问题与解答内容"
        backUrl="/admin"
        actions={
          <Button onClick={handleAddFaq}>
            <Plus className="mr-2 h-4 w-4" />
            添加新FAQ
          </Button>
        }
      />

      <div className="space-y-4">
        <FaqSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Card>
          <FaqTable
            faqs={filteredFaqs}
            onEdit={handleEditFaq}
            onDelete={handleDeleteFaq}
          />
        </Card>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default FaqManager;
