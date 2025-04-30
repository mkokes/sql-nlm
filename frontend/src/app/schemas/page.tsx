'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Loader2, Database, Calendar, Upload, FileUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { importSchema } from '@/lib/api'

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
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
  const { toast } = useToast()

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
      toast({
        title: "Error fetching schemas",
        description: "Could not load database schemas. Please try again later.",
        variant: "destructive",
      })
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
      toast({
        title: "Schema created",
        description: "Your database schema has been created successfully.",
      })
    } catch (err) {
      setError('Failed to create schema')
      console.error(err)
      toast({
        title: "Error creating schema",
        description: "There was a problem creating your schema. Please try again.",
        variant: "destructive",
      })
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "No file selected",
        description: "Please select a schema file to import.",
        variant: "destructive",
      })
      return
    }

    try {
      setImportLoading(true)
      await importSchema(importFile)
      setShowImportDialog(false)
      setImportFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      fetchSchemas()
      toast({
        title: "Schema imported",
        description: "Your database schema has been imported successfully.",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error importing schema",
        description: "There was a problem importing your schema. Please check the file format and try again.",
        variant: "destructive",
      })
    } finally {
      setImportLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Schemas</h1>
          <p className="text-muted-foreground mt-2">
            Manage your database schemas for natural language queries.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <FileUp className="h-4 w-4" />
                Import Schema
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Schema</DialogTitle>
                <DialogDescription>
                  Import a database schema from a JSON file.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Schema File (JSON)
                  </label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    The file should contain a valid schema definition in JSON format.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowImportDialog(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={importLoading || !importFile}
                >
                  {importLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add New Schema
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Schema</DialogTitle>
              <DialogDescription>
                Define your database structure to help the AI understand your data.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Schema Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter schema name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your database schema"
                    rows={3}
                  />
                </div>

                <div className="space-y-4 mt-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">Tables</h4>
                    <Button
                      type="button"
                      onClick={addTable}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Table
                    </Button>
                  </div>

                  {formData.tables.map((table, tableIndex) => (
                    <Card key={tableIndex} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">
                              Table Name
                            </label>
                            <Input
                              value={table.name}
                              onChange={(e) => updateTable(tableIndex, 'name', e.target.value)}
                              placeholder="Enter table name"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">
                              Table Description
                            </label>
                            <Input
                              value={table.description}
                              onChange={(e) => updateTable(tableIndex, 'description', e.target.value)}
                              placeholder="Describe this table"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-md font-medium">Columns</h5>
                            <Button
                              type="button"
                              onClick={() => addColumn(tableIndex)}
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs"
                            >
                              <Plus className="h-3 w-3" />
                              Add Column
                            </Button>
                          </div>

                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[150px]">Name</TableHead>
                                  <TableHead className="w-[100px]">Type</TableHead>
                                  <TableHead className="w-[200px]">Description</TableHead>
                                  <TableHead className="w-[80px]">Primary</TableHead>
                                  <TableHead className="w-[80px]">Foreign</TableHead>
                                  <TableHead className="w-[150px]">References</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {table.columns.map((column, columnIndex) => (
                                  <TableRow key={columnIndex}>
                                    <TableCell>
                                      <Input
                                        type="text"
                                        value={column.name}
                                        onChange={(e) => updateColumn(tableIndex, columnIndex, 'name', e.target.value)}
                                        required
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="text"
                                        value={column.type}
                                        onChange={(e) => updateColumn(tableIndex, columnIndex, 'type', e.target.value)}
                                        required
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="text"
                                        value={column.description}
                                        onChange={(e) => updateColumn(tableIndex, columnIndex, 'description', e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <input
                                        type="checkbox"
                                        checked={column.isPrimary}
                                        onChange={(e) => updateColumn(tableIndex, columnIndex, 'isPrimary', e.target.checked)}
                                        className="rounded border-primary text-primary focus:ring-primary"
                                      />
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <input
                                        type="checkbox"
                                        checked={column.isForeign}
                                        onChange={(e) => updateColumn(tableIndex, columnIndex, 'isForeign', e.target.checked)}
                                        className="rounded border-primary text-primary focus:ring-primary"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="text"
                                        value={column.references || ''}
                                        onChange={(e) => updateColumn(tableIndex, columnIndex, 'references', e.target.value)}
                                        disabled={!column.isForeign}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Schema'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {loading && !showForm ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading schemas...</p>
        </div>
      ) : schemas.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Database className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
            <p className="text-muted-foreground">No schemas found. Create one or import from a file to get started.</p>
            <div className="flex justify-center gap-2 mt-4">
              <Button
                onClick={() => setShowImportDialog(true)}
                variant="outline"
                className="gap-1"
              >
                <FileUp className="h-4 w-4" />
                Import Schema
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add New Schema
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemas.map((schema) => (
            <Card key={schema.ID}>
              <CardHeader>
                <CardTitle>{schema.Name}</CardTitle>
                <CardDescription>{schema.Description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created: {new Date(schema.CreatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Updated: {new Date(schema.UpdatedAt).toLocaleDateString()}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
