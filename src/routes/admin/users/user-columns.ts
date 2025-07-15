import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/DataTable/DataTableActions/data-table-actions.svelte'
import type { User } from '$lib/types/user';
import DataTableBadge from '$lib/components/data-table-badge.svelte';
import { Checkbox } from '$lib/components/ui/checkbox';
import { goto } from '$app/navigation';
import { deleteUser } from '$lib/api/user-api';
import { translation } from '$lib/stores/internalization-store';
import { derived, get } from 'svelte/store';
import { createRawSnippet } from 'svelte';

/// Create a derived store for reactive userColumns
export const userColumns = derived(
	translation,
	($translation) => [
		{
			id: "select",
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate:
						table.getIsSomePageRowsSelected() &&
						!table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
					"aria-label": "Select all",
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(!!value),
					"aria-label": "Select row",
				}),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "id",
			header: $translation.column.user.id,
		},
		{
			accessorKey: "user", // Combined user cell
			header: $translation.column.user.user || "User",
			cell: ({ row }) => {
				const userData = row.original as User;

				const userCellSnippet = createRawSnippet<[User]>((getUser) => {
					const user = getUser();

					if (!user) {
						return {
							render: () => `<div class="text-gray-500">No user data</div>`
						};
					}

					// Extract user data
					const { id, firstName, lastName, email, userProfileImageUrl } = user;

					// Generate initials for avatar fallback
					const initials = firstName && lastName
						? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
						: (firstName || email || 'U').charAt(0).toUpperCase();

					// Create profile image or avatar
					const avatarHtml = userProfileImageUrl
						? `<img src="${userProfileImageUrl}" alt="${firstName} ${lastName}" class="w-10 h-10 rounded-full object-cover border-2 border-gray-200" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`
						: '';

					const fallbackAvatarHtml = `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold shadow-md ${userProfileImageUrl ? 'hidden' : ''}">${initials}</div>`;

					return {
						render: () => `
          <button 
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left w-full group border border-transparent hover:border-gray-200"
            onclick="window.location.href='/admin/users/${id}'"
          >
            <div class="relative">
              ${avatarHtml}
              ${fallbackAvatarHtml}
              <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white ${user.isAccountNonLocked ? '' : 'bg-gray-400'}"></div>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <div class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                ${firstName || ''} ${lastName || ''}
              </div>
              <div class="text-sm text-gray-500 truncate">
                ${email || ''}
              </div>
            </div>
          </button>
        `
					};
				});

				return renderSnippet(userCellSnippet, userData);
			}
		},
		{
			accessorKey: "telephoneNumber",
			header: $translation.column.user.telephone,
		},
		{
			accessorKey: "uuid",
			header: $translation.column.user.uuid,
		},
		{
			accessorKey: "lastLoginDate",
			header: $translation.column.user.lastLoginDate,
		},
		{
			accessorKey: "role",
			header: $translation.column.user.role,
			cell: ({ row }) => {
				return renderComponent(DataTableBadge, {
					variant: "default",
					value: row.getValue("role") as string
				})
			}
		},
		{
			id: "actions",
			cell: ({ row }) => {
				return renderComponent(DataTableActions, {
					id: row.original.id.toString(),
					entityType: 'user',
					deleteFunction: deleteUser,
					onDeleted: (deletedId: string) => {
						// Handle user deletion
						console.log(`User ${deletedId} was deleted`);
					},
					onView: (id: string) => {
						goto(`/users/${id}`);
					},
					onDetails: (id: string) => {
						goto(`/users/${id}/profile`);
					}
				});
			}
		}
	] as ColumnDef<User>[]
);