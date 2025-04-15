import React from "react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  getLocalizedText: (en: string, zh: string) => string;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  getLocalizedText
}) => {
  // 生成页码数组，最多显示5个页码
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 复杂情况，需要显示省略号
      if (currentPage <= 3) {
        // 当前页靠近开始位置
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // 当前页靠近结束位置
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 当前页在中间位置
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1.5">
      {/* 上一页按钮 */}
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={`flex items-center justify-center px-3 py-1 border rounded ${
          currentPage === 1
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        aria-label={getLocalizedText("Previous page", "上一页")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="w-3 h-3"
        >
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
        <span className="ml-1">{getLocalizedText("Previous", "上一页")}</span>
      </button>

      {/* 页码 */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => goToPage(number)}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            currentPage === number
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
          aria-label={getLocalizedText(`Page ${number}`, `第${number}页`)}
          aria-current={currentPage === number ? "page" : undefined}
        >
          {number}
        </button>
      ))}

      {/* 下一页按钮 */}
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center px-3 py-1 border rounded ${
          currentPage === totalPages
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        aria-label={getLocalizedText("Next page", "下一页")}
      >
        <span className="mr-1">{getLocalizedText("Next", "下一页")}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="w-3 h-3"
        >
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>
  );
};

export default BlogPagination;
