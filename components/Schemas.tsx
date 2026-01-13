import React, { useState } from 'react';

interface SchemaProperty {
    name: string;
    type: string;
    description?: string;
    required?: boolean;
}

interface Schema {
    name: string;
    description: string;
    properties: SchemaProperty[];
}

const SCHEMAS: Schema[] = [
    {
        name: 'Product',
        description: 'Product entity in the grocery store',
        properties: [
            { name: 'id', type: 'integer', description: 'Unique identifier', required: true },
            { name: 'name', type: 'string', description: 'Product name', required: true },
            { name: 'price', type: 'number', description: 'Price in USD', required: true },
            { name: 'category', type: 'string', description: 'Product category' },
            { name: 'inventory', type: 'integer', description: 'Available stock quantity' },
        ],
    },
    {
        name: 'Order',
        description: 'Customer order',
        properties: [
            { name: 'id', type: 'integer', description: 'Unique order identifier', required: true },
            { name: 'customer_id', type: 'integer', description: 'Customer who placed the order', required: true },
            { name: 'items', type: 'array[OrderItem]', description: 'List of ordered items', required: true },
            { name: 'total_price', type: 'number', description: 'Total order amount', required: true },
            { name: 'status', type: 'string', description: 'Order status: pending, completed, cancelled' },
            { name: 'created_at', type: 'string', description: 'Timestamp when order was created' },
        ],
    },
    {
        name: 'OrderItem',
        description: 'Individual item in an order',
        properties: [
            { name: 'product_id', type: 'integer', description: 'Reference to product', required: true },
            { name: 'quantity', type: 'integer', description: 'Quantity ordered', required: true },
            { name: 'price_at_purchase', type: 'number', description: 'Price at time of purchase' },
        ],
    },
    {
        name: 'Customer',
        description: 'Registered customer',
        properties: [
            { name: 'id', type: 'integer', description: 'Unique customer identifier', required: true },
            { name: 'name', type: 'string', description: 'Customer full name', required: true },
            { name: 'email', type: 'string', description: 'Customer email address', required: true },
        ],
    },
    {
        name: 'Category',
        description: 'Product category',
        properties: [
            { name: 'id', type: 'integer', description: 'Unique category identifier', required: true },
            { name: 'name', type: 'string', description: 'Category name', required: true },
        ],
    },
];

export const Schemas: React.FC = () => {
    const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set());

    const toggleSchema = (schemaName: string) => {
        setExpandedSchemas(prev => {
            const next = new Set(prev);
            if (next.has(schemaName)) {
                next.delete(schemaName);
            } else {
                next.add(schemaName);
            }
            return next;
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Schemas</h2>
                <p className="text-gray-600 mt-2">Data models used in the API</p>
            </div>

            <div className="space-y-3">
                {SCHEMAS.map((schema) => {
                    const isExpanded = expandedSchemas.has(schema.name);

                    return (
                        <div key={schema.name} className="bg-white border rounded shadow-sm overflow-hidden">
                            <div
                                className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between select-none"
                                onClick={() => toggleSchema(schema.name)}
                            >
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 font-mono">{schema.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{schema.description}</p>
                                </div>
                                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400`}></i>
                            </div>

                            {isExpanded && (
                                <div className="border-t bg-gray-50 p-4">
                                    <table className="w-full bg-white border rounded">
                                        <thead className="bg-gray-50 border-b">
                                            <tr className="text-xs text-gray-600">
                                                <th className="text-left p-3 font-semibold">Property</th>
                                                <th className="text-left p-3 font-semibold">Type</th>
                                                <th className="text-left p-3 font-semibold">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schema.properties.map((prop, idx) => (
                                                <tr key={idx} className="border-b last:border-0">
                                                    <td className="p-3">
                                                        <span className="font-mono text-sm font-semibold text-gray-800">
                                                            {prop.name}
                                                        </span>
                                                        {prop.required && (
                                                            <span className="text-red-500 ml-1" title="Required">*</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700">
                                                            {prop.type}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-600">
                                                        {prop.description || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Example JSON */}
                                    <div className="mt-4">
                                        <div className="text-sm font-semibold text-gray-700 mb-2">Example</div>
                                        <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                                            {schema.name === 'Product' && `{
  "id": 1,
  "name": "Honeycrisp Apple",
  "price": 1.25,
  "category": "Fruits",
  "inventory": 50
}`}
                                            {schema.name === 'Order' && `{
  "id": 1001,
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 5,
      "price_at_purchase": 1.25
    }
  ],
  "total_price": 6.25,
  "status": "pending",
  "created_at": "2026-01-13T10:30:00Z"
}`}
                                            {schema.name === 'OrderItem' && `{
  "product_id": 1,
  "quantity": 3,
  "price_at_purchase": 1.25
}`}
                                            {schema.name === 'Customer' && `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}`}
                                            {schema.name === 'Category' && `{
  "id": 1,
  "name": "Fruits"
}`}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
