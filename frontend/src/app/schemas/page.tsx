'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

type Schema = {
  ID: number
  Name: string
  Description: string
  CreatedAt: string
  UpdatedAt: string
}

type Table = {
  name: string
  description: string
  columns: Column[]
}

type Column = {
  name: string
  type: string
  description: string
  isPrimary: boolean
  isForeign: boolean
  references?: string
}

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<Schema[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tables: [
      {
        name: '',
        description: '',
        columns: [
          {
            name: '',
            type: '',
            description: '',
            isPrimary: false,
            isForeign: false,
            references: ''
          }
        ]
      }
    ]
  })

  useEffect(() => {
    fetchSchemas()
  }, [])

  const fetchSchemas = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/schemas')
      setSchemas(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch schemas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post('/api/schemas', formData)
      setShowForm(false)
      setFormData({
        name: '',
        description: '',
        tables: [
          {
            name: '',
            description: '',
            columns: [
              {
                name: '',
                type: '',
                description: '',
                isPrimary: false,
                isForeign: false,
                references: ''
              }
            ]
          }
        ]
      })
      fetchSchemas()
    } catch (err) {
      setError('Failed to create schema')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTable = () => {
    setFormData({
      ...formData,
      tables: [
        ...formData.tables,
        {
          name: '',
          description: '',
          columns: [
            {
              name: '',
              type: '',
              description: '',
              isPrimary: false,
              isForeign: false,
              references: ''
            }
          ]
        }
      ]
    })
  }

  const addColumn = (tableIndex: number) => {
    const newTables = [...formData.tables]
    newTables[tableIndex].columns.push({
      name: '',
      type: '',
      description: '',
      isPrimary: false,
      isForeign: false,
      references: ''
    })
    setFormData({
      ...formData,
      tables: newTables
    })
  }

  const updateTable = (index: number, field: string, value: string) => {
    const newTables = [...formData.tables]
    newTables[index] = {
      ...newTables[index],
      [field]: value
    }
    setFormData({
      ...formData,
      tables: newTables
    })
  }

  const updateColumn = (
    tableIndex: number,
    columnIndex: number,
    field: string,
    value: any
  ) => {
    const newTables = [...formData.tables]
    newTables[tableIndex].columns[columnIndex] = {
      ...newTables[tableIndex].columns[columnIndex],
      [field]: value
    }
    setFormData({
      ...formData,
      tables: newTables
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Database Schemas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : 'Add New Schema'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create New Schema</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schema Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Tables</h4>
                <button
                  type="button"
                  onClick={addTable}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-2 rounded"
                >
                  Add Table
                </button>
              </div>

              {formData.tables.map((table, tableIndex) => (
                <div
                  key={tableIndex}
                  className="border rounded-md p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table Name
                      </label>
                      <input
                        type="text"
                        value={table.name}
                        onChange={(e) =>
                          updateTable(tableIndex, 'name', e.target.value)
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table Description
                      </label>
                      <input
                        type="text"
                        value={table.description}
                        onChange={(e) =>
                          updateTable(tableIndex, 'description', e.target.value)
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-md font-medium">Columns</h5>
                      <button
                        type="button"
                        onClick={() => addColumn(tableIndex)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-2 rounded"
                      >
                        Add Column
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300 border">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Type
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Description
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Primary
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Foreign
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              References
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                          {table.columns.map((column, columnIndex) => (
                            <tr key={columnIndex}>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={column.name}
                                  onChange={(e) =>
                                    updateColumn(
                                      tableIndex,
                                      columnIndex,
                                      'name',
                                      e.target.value
                                    )
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={column.type}
                                  onChange={(e) =>
                                    updateColumn(
                                      tableIndex,
                                      columnIndex,
                                      'type',
                                      e.target.value
                                    )
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={column.description}
                                  onChange={(e) =>
                                    updateColumn(
                                      tableIndex,
                                      columnIndex,
                                      'description',
                                      e.target.value
                                    )
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="checkbox"
                                  checked={column.isPrimary}
                                  onChange={(e) =>
                                    updateColumn(
                                      tableIndex,
                                      columnIndex,
                                      'isPrimary',
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="checkbox"
                                  checked={column.isForeign}
                                  onChange={(e) =>
                                    updateColumn(
                                      tableIndex,
                                      columnIndex,
                                      'isForeign',
                                      e.target.checked
                                    )
                                  }
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={column.references || ''}
                                  onChange={(e) =>
                                    updateColumn(
                                      tableIndex,
                                      columnIndex,
                                      'references',
                                      e.target.value
                                    )
                                  }
                                  disabled={!column.isForeign}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Schema'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <div className="text-center py-4">Loading schemas...</div>
      ) : schemas.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No schemas found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemas.map((schema) => (
            <div key={schema.ID} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{schema.Name}</h3>
              <p className="text-gray-600 mb-4">{schema.Description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created: {new Date(schema.CreatedAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(schema.UpdatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
