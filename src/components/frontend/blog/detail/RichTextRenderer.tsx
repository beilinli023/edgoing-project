import React, { Fragment } from 'react';

// Basic type definitions for Strapi Rich Text structure (adjust as needed)
interface TextNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean; // Add other formats if needed
  strikethrough?: boolean;
  code?: boolean;
}

interface LinkNode {
    type: 'link';
    url: string;
    children: TextNode[];
}

interface ListItemNode {
    type: 'list-item';
    children: (TextNode | LinkNode)[]; // List items can contain text or links
}

export interface BlockNode {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code' | 'image'; // Add other block types if needed
  children: (TextNode | BlockNode | LinkNode | ListItemNode)[]; 
  level?: 1 | 2 | 3 | 4 | 5 | 6; // For headings
  format?: 'ordered' | 'unordered'; // For lists
  // For images (example structure, adjust based on actual data)
  image?: {
      url: string;
      alt?: string;
      width?: number;
      height?: number;
  };
   // For code blocks (example structure)
   code?: string;
}

type AnyNode = TextNode | BlockNode | LinkNode | ListItemNode; // Union type

interface RichTextRendererProps {
  blocks: BlockNode[];
}

const renderNode = (node: AnyNode, key: string | number): React.ReactNode => {
  if (node.type === 'text') {
    let element: React.ReactNode = node.text;
    if (node.bold) element = <strong>{element}</strong>;
    if (node.italic) element = <em>{element}</em>;
    if (node.underline) element = <u>{element}</u>;
    if (node.strikethrough) element = <s>{element}</s>;
    if (node.code) element = <code>{element}</code>;
    return <Fragment key={key}>{element}</Fragment>; // Use Fragment for pure text nodes
  }

   if (node.type === 'link') {
       return (
           <a href={node.url} key={key} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
               {node.children.map((child, index) => renderNode(child, `${key}-${index}`))}
           </a>
       );
   }

  // Handle other inline node types if necessary
  return null; // Should not happen for basic text/link rendering within blocks
};


const renderBlock = (block: BlockNode, key: string | number): React.ReactNode => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={key}>
          {block.children.map((child, index) => renderNode(child, `${key}-${index}`))}
        </p>
      );
    case 'heading': {
      const Tag = `h${block.level || 1}` as keyof JSX.IntrinsicElements;
      return (
        <Tag key={key}>
          {block.children.map((child, index) => renderNode(child, `${key}-${index}`))}
        </Tag>
      );
    }
    case 'list': {
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={key} className={ListTag === 'ol' ? 'list-decimal' : 'list-disc'}>
          {block.children.map((item, index) => {
             // Ensure item is a list-item before rendering li
             if (item.type === 'list-item') {
                 return (
                     <li key={`${key}-${index}`}>
                         {item.children.map((child, childIndex) => renderNode(child, `${key}-${index}-${childIndex}`))}
                     </li>
                 );
             }
             console.warn("Unexpected child type in list block:", item);
             return null; // Or handle unexpected item types
          })}
        </ListTag>
      );
    }
     case 'quote':
       return (
           <blockquote key={key} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-600 dark:text-gray-400 my-4">
               {block.children.map((child, index) => renderNode(child, `${key}-${index}`))}
           </blockquote>
       );
    case 'image':
        if (!block.image) return null;
        return (
            <img 
                key={key} 
                src={block.image.url} 
                alt={block.image.alt || 'Blog image'} 
                width={block.image.width}
                height={block.image.height}
                className="my-4 rounded-lg shadow-md max-w-full h-auto" // Add styling as needed
            />
        );
     case 'code':
        // Basic code block rendering, consider using a syntax highlighting library for better results
        return (
            <pre key={key} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4">
                <code className="text-sm font-mono">
                   {/* Render children if they exist (e.g., formatted text within code), otherwise render plain code string */}
                   {block.children && block.children.length > 0 
                      ? block.children.map((child, index) => renderNode(child, `${key}-${index}`)) 
                      : block.code || ''}
                </code>
            </pre>
        );
    default:
      console.warn('Unsupported block type:', block.type);
      return null;
  }
};

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ blocks }) => {
  if (!Array.isArray(blocks)) {
      console.error("RichTextRenderer received invalid 'blocks' prop:", blocks);
      // Optionally return a fallback UI or null
      return <p className="text-red-500">Error: Invalid content format received.</p>;
  }
  
  return (
    <>
      {blocks.map((block, index) => renderBlock(block, index))}
    </>
  );
};

export default RichTextRenderer; 