import React from 'react';

interface RichTextRendererProps {
  content: any;
}

/**
 * 富文本渲染组件，用于渲染 Strapi 的富文本内容
 * 支持两种格式：
 * 1. 字符串格式（兼容旧数据）
 * 2. Strapi v4 的块格式
 */
const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  if (!content) return null;

  // 处理字符串格式的内容（兼容旧数据）
  if (typeof content === 'string') {
    return <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // 处理块格式的内容
  return (
    <div className="rich-text-content">
      {content.map((block: any, index: number) => {
        switch (block.type) {
          case 'paragraph':
            // 如果段落是空的，添加一个空行
            if (block.children.length === 1 && block.children[0].text === '') {
              return <div key={index} className="empty-line"></div>;
            }

            return (
              <p key={index} className="rich-text-paragraph">
                {block.children.map((child: any, i: number) => {
                  // 组合样式处理
                  let textContent = child.text;
                  let Component = 'span';
                  let className = '';

                  if (child.bold) {
                    Component = 'strong';
                  }
                  if (child.italic) {
                    Component = child.bold ? 'strong' : 'em';
                    className = child.bold ? 'italic' : '';
                  }
                  if (child.underline) {
                    className += ' underline';
                  }

                  // 处理特殊字符和格式
                  if (textContent.startsWith('•') || textContent.startsWith('-') || textContent.startsWith('‣') || textContent.startsWith('*')) {
                    className += ' list-item';
                    // 将项目符号改为统一的圆点
                    textContent = '• ' + textContent.substring(1).trim();
                  }

                  // 处理冒号后的内容加粗
                  if (textContent.includes('：') || textContent.includes(':')) {
                    const parts = textContent.split(/[：:]/);
                    if (parts.length > 1) {
                      return (
                        <span key={i}>
                          <strong>{parts[0]}：</strong>{parts.slice(1).join('：')}
                        </span>
                      );
                    }
                  }

                  return React.createElement(
                    Component as any,
                    { key: i, className: className || undefined },
                    textContent
                  );
                })}
              </p>
            );

          case 'heading':
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag key={index} className="rich-text-heading">
                {block.children.map((child: any) => child.text).join('')}
              </HeadingTag>
            );

          case 'list':
            if (block.format === 'ordered') {
              return (
                <ol key={index} className="rich-text-ordered-list">
                  {block.children.map((item: any, i: number) => (
                    <li key={i} className="rich-text-list-item">
                      {item.children.map((child: any, j: number) => {
                        if (child.bold) {
                          return <strong key={j}>{child.text}</strong>;
                        }
                        if (child.italic) {
                          return <em key={j}>{child.text}</em>;
                        }
                        if (child.underline) {
                          return <u key={j}>{child.text}</u>;
                        }
                        return child.text;
                      })}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={index} className="rich-text-unordered-list">
                {block.children.map((item: any, i: number) => (
                  <li key={i} className="rich-text-list-item">
                    {item.children.map((child: any, j: number) => {
                      if (child.bold) {
                        return <strong key={j}>{child.text}</strong>;
                      }
                      if (child.italic) {
                        return <em key={j}>{child.text}</em>;
                      }
                      if (child.underline) {
                        return <u key={j}>{child.text}</u>;
                      }
                      return child.text;
                    })}
                  </li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default RichTextRenderer;
