
import { PenLine, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  status: string;
}

interface FaqTableProps {
  faqs: FaqItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FaqTable = ({ faqs, onEdit, onDelete }: FaqTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60%]">问题</TableHead>
          <TableHead>排序</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faqs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              没有找到匹配的FAQ记录
            </TableCell>
          </TableRow>
        ) : (
          faqs.map(faq => (
            <TableRow key={faq.id}>
              <TableCell className="font-medium">{faq.question}</TableCell>
              <TableCell>{faq.order}</TableCell>
              <TableCell>
                <Badge 
                  variant={faq.status === "已发布" ? "default" : "secondary"}
                  className={faq.status === "已发布" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                  {faq.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">操作菜单</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(faq.id)}>
                      <PenLine className="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(faq.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default FaqTable;
