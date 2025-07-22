import { Code, Palette, TrendingUp, Camera } from 'lucide-svelte';

export const categories = [
	{
		icon: Code,
		name: "Fuel Stations",
		courses: 127,
		color: "from-blue-500 to-purple-600"
	},
	{
		icon: Palette,
		name: "EV Charging",
		courses: 89,
		color: "from-pink-500 to-orange-500"
	},
	{
		icon: TrendingUp,
		name: "Analytics",
		courses: 156,
		color: "from-green-500 to-teal-500"
	},
	{
		icon: Camera,
		name: "Amenities",
		courses: 73,
		color: "from-yellow-500 to-red-500"
	}
];