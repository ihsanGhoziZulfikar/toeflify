'use client';

import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';

export interface CustomTable {
  _type: 'customTable';
  caption?: string;
  table: {
    rows: {
      _key: string;
      cells: string[];
    }[];
  };
}

interface PortableTextBlockProps {
  value: (PortableTextBlock | CustomTable)[];
}

export default function CustomPortableTextBlock({ value }: PortableTextBlockProps) {
  if (!value || value.length === 0) return null;

  const components: PortableTextComponents = {
    types: {
      customTable: ({ value }) => (
        <div className="overflow-x-auto my-6 border border-gray-300 rounded-md">
          <table className="min-w-full border-collapse">
            <tbody>
              {value.table?.rows?.map((row: any) => (
                <tr key={row._key} className="border-b border-gray-200">
                  {row.cells.map((cell: string, index: number) => (
                    <td key={index} className="px-4 py-2 text-gray-700 border-r last:border-none">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {value.caption && (
            <p className="text-sm text-gray-500 text-center italic mt-2">
              {value.caption}
            </p>
          )}
        </div>
      )
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-gray-900">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="italic text-gray-700">{children}</em>
      ),
    },
    block: {
      normal: ({ children }) => (
        <p className="text-gray-700 leading-relaxed mb-3">{children}</p>
      ),
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-semibold text-gray-900 mt-5 mb-2">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-1">
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside mb-4 text-gray-700">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside mb-4 text-gray-700">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="ml-4">{children}</li>,
      number: ({ children }) => <li className="ml-4">{children}</li>,
    },
  };

  return <PortableText value={value} components={components} />;
}
