// NASA API Constants

export const MARS_ROVERS = {
	CURIOSITY: 'curiosity',
	OPPORTUNITY: 'opportunity',
	SPIRIT: 'spirit',
} as const;

export const MARS_ROVER_CAMERAS = {
	FHAZ: 'fhaz', // Front Hazard Avoidance Camera
	RHAZ: 'rhaz', // Rear Hazard Avoidance Camera
	MAST: 'mast', // Mast Camera
	CHEMCAM: 'chemcam', // Chemistry and Camera Complex
	MAHLI: 'mahli', // Mars Hand Lens Imager
	MARDI: 'mardi', // Mars Descent Imager
	NAVCAM: 'navcam', // Navigation Camera
	PANCAM: 'pancam', // Panoramic Camera
	MINITES: 'minites', // Miniature Thermal Emission Spectrometer
} as const;

export const CAMERA_DESCRIPTIONS = {
	[MARS_ROVER_CAMERAS.FHAZ]: 'Front Hazard Avoidance Camera',
	[MARS_ROVER_CAMERAS.RHAZ]: 'Rear Hazard Avoidance Camera',
	[MARS_ROVER_CAMERAS.MAST]: 'Mast Camera',
	[MARS_ROVER_CAMERAS.CHEMCAM]: 'Chemistry and Camera Complex',
	[MARS_ROVER_CAMERAS.MAHLI]: 'Mars Hand Lens Imager',
	[MARS_ROVER_CAMERAS.MARDI]: 'Mars Descent Imager',
	[MARS_ROVER_CAMERAS.NAVCAM]: 'Navigation Camera',
	[MARS_ROVER_CAMERAS.PANCAM]: 'Panoramic Camera',
	[MARS_ROVER_CAMERAS.MINITES]: 'Miniature Thermal Emission Spectrometer',
} as const;

export const ROVER_INFO = {
	[MARS_ROVERS.CURIOSITY]: {
		name: 'Curiosity',
		launchDate: '2011-11-26',
		landingDate: '2012-08-05',
		status: 'Active',
		description: 'Nuclear-powered rover exploring Gale Crater on Mars',
	},
	[MARS_ROVERS.OPPORTUNITY]: {
		name: 'Opportunity',
		launchDate: '2003-07-07',
		landingDate: '2004-01-25',
		status: 'Complete',
		description: 'Solar-powered rover that operated for nearly 15 years',
	},
	[MARS_ROVERS.SPIRIT]: {
		name: 'Spirit',
		launchDate: '2003-06-10',
		landingDate: '2004-01-04',
		status: 'Complete',
		description: 'Twin rover to Opportunity, operated for over 6 years',
	},
} as const;

export const SPACE_AGENCIES = ['NASA', 'ESA', 'SpaceX', 'Blue Origin', 'Roscosmos', 'CNSA', 'ISRO', 'JAXA'] as const;

export const PLANET_NAMES = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const;

export const APP_CONFIG = {
	name: 'NASA Space Explorer',
	description: "Explore the cosmos with NASA's amazing space data and imagery",
	author: 'NASA Explorer Team',
	github: 'mikicvi/nasa-space-explorer',
	social: {
		twitter: 'nasa',
	},
} as const;

export const API_ENDPOINTS = {
	NASA_APOD: '/planetary/apod',
	NASA_MARS_PHOTOS: '/mars-photos/api/v1/rovers',
	NASA_NEO: '/neo/rest/v1/feed',
	NASA_EARTH: '/planetary/earth/imagery',
	ISS_LOCATION: 'http://api.open-notify.org/iss-now.json',
	SPACEX_LAUNCHES: 'https://api.spacexdata.com/v4/launches',
	SPACE_NEWS: 'https://api.spaceflightnewsapi.net/v4/articles',
	NASA_IMAGES: 'https://images-api.nasa.gov/search',
} as const;
