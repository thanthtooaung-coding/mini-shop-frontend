import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import type { ProductDto, CategoryDto } from '@/types/api' //
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Eye, Edit, Trash2 } from 'lucide-vue-next'
import DropdownAction, { type ActionItem } from '@/components/DropdownAction.vue'
import { useQueryClient } from '@tanstack/vue-query'
import { deleteProduct } from '@/services/productService' //
import { toast } from '@/components/ui/toast'

const renderSortableHeader = (label: string, column: any, className = '') =>
  h(
    Button,
    {
      variant: 'ghost',
      class: className,
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    },
    () => [label, h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
  )

export const createColumns = (categories: CategoryDto[]): ColumnDef<ProductDto>[] => {
  const queryClient = useQueryClient()
  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      toast({ title: 'Error', description: 'Product ID is missing.', variant: 'destructive' })
      return
    }
    try {
      await deleteProduct(id)
      toast({ title: 'Success', description: 'Product deleted successfully.' })
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product.',
        variant: 'destructive',
      })
    }
  }

  return [
    {
      accessorKey: 'id',
      header: ({ column }) => renderSortableHeader('ID', column, 'pl-0'),
      cell: ({ row }) => h('div', { class: 'w-[50px]' }, row.getValue('id')),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => renderSortableHeader('Name', column),
      cell: ({ row }) => h('div', { class: 'min-w-[150px]' }, row.getValue('name')),
    },
    {
      accessorKey: 'sku',
      header: ({ column }) => renderSortableHeader('SKU', column),
      cell: ({ row }) => h('div', {}, row.getValue('sku')),
    },
    {
      accessorKey: 'sellingPrice',
      header: ({ column }) => renderSortableHeader('Price', column, 'justify-end'),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue('sellingPrice'))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'MMK',
        }).format(amount)
        return h('div', { class: 'text-right font-medium' }, formatted)
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => renderSortableHeader('Quantity', column, 'justify-end'),
      cell: ({ row }) => h('div', { class: 'text-right' }, row.getValue('quantity')),
    },
    {
      accessorKey: 'categoryId',
      header: ({ column }) => renderSortableHeader('Category', column),
      cell: ({ row }) => {
        const categoryId = row.getValue('categoryId') as number
        const category = categories.find((cat) => cat.id === categoryId)
        const categoryName = category ? category.name : 'Unknown' //
        return h('div', {}, categoryName)
      },
    },
    // ----------------------------
    {
      id: 'actions',
      header: () => h('div', { class: 'text-right pr-2' }, 'Actions'),
      cell: ({ row }) => {
        const product = row.original
        const actions: ActionItem[] = [
          {
            icon: Eye,
            label: 'View',
            to: `/app/products/${product.id}`, //
            visible: true,
          },
          {
            icon: Edit,
            label: 'Edit',
            to: `/app/products/edit/${product.id}`, //
            visible: true,
          },
          {
            icon: Trash2,
            label: 'Delete',
            visible: true,
            deleteDialog: {
              itemName: product.name || `Product ${product.id}`, //
              title: 'Delete Product',
              description:
                'Are you sure you want to delete this product? This action cannot be undone.',
              onDelete: () => handleDelete(product.id), //
            },
          },
        ]

        return h(
          'div',
          {
            class: 'relative flex justify-end items-center',
            onClick: (e: Event) => e.stopPropagation(),
          },
          [h(DropdownAction, { actions })], //
        )
      },
      enableSorting: false,
    },
  ]
}
