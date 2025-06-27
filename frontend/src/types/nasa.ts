// NASA API Types

export interface ApodData {
	copyright?: string;
	date: string;
	explanation: string;
	hdurl?: string;
	media_type: 'image' | 'video';
	service_version: string;
	title: string;
	url: string;
}

export interface MarsRoverPhoto {
	id: number;
	sol: number;
	camera: {
		id: number;
		name: string;
		rover_id: number;
		full_name: string;
	};
	img_src: string;
	earth_date: string;
	rover: {
		id: number;
		name: string;
		landing_date: string;
		launch_date: string;
		status: string;
	};
}

export interface NeoData {
	id: string;
	neo_reference_id: string;
	name: string;
	nasa_jpl_url: string;
	absolute_magnitude_h: number;
	estimated_diameter: {
		kilometers: {
			estimated_diameter_min: number;
			estimated_diameter_max: number;
		};
		meters: {
			estimated_diameter_min: number;
			estimated_diameter_max: number;
		};
	};
	is_potentially_hazardous_asteroid: boolean;
	close_approach_data: Array<{
		close_approach_date: string;
		close_approach_date_full: string;
		epoch_date_close_approach: number;
		relative_velocity: {
			kilometers_per_second: string;
			kilometers_per_hour: string;
			miles_per_hour: string;
		};
		miss_distance: {
			astronomical: string;
			lunar: string;
			kilometers: string;
			miles: string;
		};
		orbiting_body: string;
	}>;
}

export interface ISSPosition {
	iss_position: {
		latitude: string;
		longitude: string;
	};
	message: string;
	timestamp: number;
}

export interface NasaImage {
	data: Array<{
		title: string;
		description: string;
		nasa_id: string;
		media_type: string;
		date_created: string;
		center: string;
		keywords?: string[];
	}>;
	links?: Array<{
		href: string;
		rel: string;
		render?: string;
	}>;
}

export interface MarsWeather {
	sol: number;
	season: string;
	min_temp?: number;
	max_temp?: number;
	pressure?: number;
	pressure_string?: string;
	atmo_opacity?: string;
	ls: number;
	terrestrial_date: string;
	unitOfMeasure: string;
}

export interface Launch {
	id: string;
	name: string;
	date_utc: string;
	date_unix: number;
	date_local: string;
	date_precision: string;
	upcoming: boolean;
	details?: string;
	flight_number?: number;
	rocket: string;
	success?: boolean;
	links: {
		patch?: {
			small?: string;
			large?: string;
		};
		reddit?: {
			campaign?: string;
			launch?: string;
			media?: string;
			recovery?: string;
		};
		flickr?: {
			small?: string[];
			original?: string[];
		};
		presskit?: string;
		webcast?: string;
		youtube_id?: string;
		article?: string;
		wikipedia?: string;
	};
}

export interface Astronaut {
	id: number;
	name: string;
	status: string;
	species: string;
	date_of_birth: string;
	date_of_death?: string;
	nationality: string;
	bio: string;
	twitter?: string;
	instagram?: string;
	wiki?: string;
	profile_image: string;
	profile_image_thumbnail: string;
	flights: number;
	landings: number;
	spacewalks: number;
	last_flight?: string;
	first_flight?: string;
}

export interface SpaceNews {
	id: number;
	title: string;
	url: string;
	image_url: string;
	news_site: string;
	summary: string;
	published_at: string;
	updated_at: string;
	featured: boolean;
	launches: Array<{
		launch_id: string;
		provider: string;
	}>;
	events: Array<{
		event_id: number;
		provider: string;
	}>;
}
