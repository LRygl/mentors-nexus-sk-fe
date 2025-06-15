<script lang="ts">
 export const reset = true;

 import AntDesignUpSquareFilled from '~icons/ant-design/up-square-filled';
 import AntDesignLogoutOutlined from '~icons/ant-design/logout-outlined';
 import AntDesignUserOutlined from '~icons/ant-design/user-outlined';
 import AntDesignSettingOutlined from '~icons/ant-design/setting-outlined';
 import AntDesignProjectOutlined from '~icons/ant-design/project-outlined';
 import AntDesignUserSwitchOutlined from '~icons/ant-design/user-switch-outlined';
 import AntDesignBulbOutlined from '~icons/ant-design/bulb-outlined';
 import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded';
</script>



<div class="flex flex-row">
	<div class="flex flex-col w-2/13 bg-nexus-primary h-screen">
		<div class="flex flex-col">
			<!-- Head Section with Logo and Tiny Text -->
			<div class="relative flex mt-8 items-center justify-center px-4">
				<!-- Application Logo -->
				<h2 class="text-4xl text-white font-bold">AEVI</h2>
			</div>
		</div>
		<div class="block w-full mt-5 overflow-hidden">

			<!-- Sidebar Item -->
			<div class="flex flex-row items-center gap-x-4 px-5 h-14 mx-auto transition-all duration-300 ease-in-out border-b border-b-nexus-primary bg-nexus-primary-500 hover:bg-nexus-primary-600 relative">
				<!-- Dashboard Icon -->
				<div class="rounded-lg bg-nexus-primary p-2">
					<AntDesignProjectOutlined class="text-white"/>
				</div>
				<a class="text-white text-sm relative z-10" href="/admin/dashboard">Dashboard</a>
			</div>

			<!-- Sidebar Item -->
			<a href="/admin/users" class="text-white text-sm relative z-10">
			<div class="flex flex-row items-center gap-x-4 px-5 h-14 mx-auto transition-all duration-300 ease-in-out border-b border-b-nexus-primary bg-nexus-primary-500 hover:bg-nexus-primary-600 relative">
				<!-- Users Icon -->
				<div class="rounded-lg bg-nexus-primary p-2">
					<AntDesignUserSwitchOutlined class="text-white"/>
				</div>
				Users
			</div>
			</a>
			<!-- Sidebar Item -->
			<a href="/admin/category" class="text-white text-sm relative z-10">
				<div class="flex flex-row items-center gap-x-4 px-5 h-14 mx-auto transition-all duration-300 ease-in-out border-b border-b-nexus-primary bg-nexus-primary-500 hover:bg-nexus-primary-600 relative">
					<!-- Users Icon -->
					<div class="rounded-lg bg-nexus-primary p-2">
						<AntDesignUserSwitchOutlined class="text-white"/>
					</div>
					Category
				</div>
			</a>
			<!-- Sidebar Item -->
			<div class="flex flex-row items-center gap-x-4 px-5 h-14 mx-auto transition-all duration-300 ease-in-out border-b border-b-nexus-primary bg-nexus-primary-500 hover:bg-nexus-primary-600 relative">
				<!-- SVG Home Icon -->
				<div class="rounded-lg bg-nexus-primary p-2">
					<AntDesignBulbOutlined class="text-white"/>
				</div>
				<a href="/admin/ideas" class="text-white text-sm relative z-10">Ideas</a>
			</div>

		</div>


		<div class="mt-auto flex flex-row p-4 gap-6 text-white inline-block text-center">
			<div class="grid grid-cols-3">


				<div>a</div>
				<div>b</div>
				<div>c</div>
				<div class="col-span-3 border p-2 rounded mt-3 flex items-center justify-center gap-2">
					<MaterialSymbolsLogoutRounded class="w-5 h-5" />
					<span>Logout</span>
				</div>


			</div>
		</div>


	</div>
	<div class="w-11/13 pt-15 p-8 bg-gray-200">
		<slot />

	</div>
</div>
