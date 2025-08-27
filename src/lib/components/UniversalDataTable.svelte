<script lang="ts">




	// Generic props for any data type T
	interface Props<T> {
		// Data and state
		data: T[];
		loading?: boolean;
		error?: string | null;

		// Table configuration
		config: TableConfig<T>;
		columns: TableColumn<T>[];

		// Optional features
		searchable?: boolean;
		filterable?: boolean;
		selectable?: boolean;
		exportable?: boolean;

		// Callbacks
		callbacks?: TableCallbacks<T>;

		// Selection state (external control)
		selectedItems?: Set<string>;

		// Action configurations
		getActions?: (item: T) => TableAction[];

		// Empty state customization
		emptyTitle?: string;
		emptyDescription?: string;
		emptyIcon?: any;
		emptyActionLabel?: string;

		// Search placeholder
		searchPlaceholder?: string;

		// Additional classes
		className?: string;
		tableClassName?: string;
	}

	let {
		data = $bindable(),
		loading = false,
		error = null,
		config,
		columns,
		searchable = true,
		filterable = false,
		selectable = true,
		exportable = false,
		callbacks = {},
		selectedItems = $bindable(new Set<string>()),
		getActions,
		emptyTitle = "No Data Available",
		emptyDescription = "Get started by creating your first item.",
		emptyIcon = FileText,
		emptyActionLabel = "Create Item",
		searchPlaceholder = "Search items...",
		className = "",
		tableClassName = ""
	}: Props<T> = $props();

	// Internal state
	let searchQuery = $state('');
	let openDropdownId = $state<string | null>(null);
	let actionLoading = $state<Record<string, boolean>>({});

	// Filtered data based on search


</script>