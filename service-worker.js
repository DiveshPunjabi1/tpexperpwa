// var staticCacheName = "pwa";

// self.addEventListener("install", function (e) {
// e.waitUntil(
// 	caches.open(staticCacheName).then(function (cache) {
// 	return cache.addAll(["/"]);
// 	})
// );
// });

// self.addEventListener("fetch", function (event) {
// console.log(event.request.url);

// event.respondWith(
// 	caches.match(event.request).then(function (response) {
// 	return response || fetch(event.request);
// 	})
// );
// });
// service-worker.js

// serviceworker
// self.addEventListener("install", function (event) {
// 	event.waitUntil(preLoad());
// 	});
// 	self.addEventListener("fetch", function (event) {
// 	event.respondWith(
// 	checkResponse(event.request).catch(function () {
// 	console.log("Fetch from cache successful!");
// 	return returnFromCache(event.request);
// 	})
// 	);
// 	console.log("Fetch successful!");
// 	event.waitUntil(addToCache(event.requesst));
// 	});
// 	self.addEventListener("sync", (event) => {
// 	if (event.tag === "syncMessage") {
// 	console.log("Sync successful!");
// 	}
// 	});
// 	self.addEventListener("push", function (event) {
// 	if (event && event.data) {
// 	try {
// 	var data = event.data.json();
// 	if (data && data.method === "pushMessage") {
// 	console.log("Push notification sent");
// 	self.registration.showNotification("Ecommerce website", {
// 	body: data.message,
// 	});
// 	}
// 	} catch (error) {
// 	console.error("Error parsing push data:", error);
// 	}
// 	}
// 	});
// 	var preLoad = function () {
// 	return caches.open("offline").then(function (cache) {
// 	// caching index and important routes
// 	return cache.addAll([
// 	"/",
// 	"/index.html",

// 	"manifest.json",
// 	"script.js",
// 	"/css/main.css",
// 	]);
// 	});
// 	};
// 	var checkResponse = function (request) {
// 	return new Promise(function (fulfill, reject) {
// 	fetch(request)
// 	.then(function (response) {
// 	if (response.status !== 404) {
// 	fulfill(response);
// 	} else {
// 	reject(new Error("Response not found"));
// 	}
// 	})
// 	.catch(function (error) {
// 	reject(error);
// 	});
// 	});
// 	};
// 	var returnFromCache = function (request) {
// 	return caches.open("offline").then(function (cache) {
// 	return cache.match(request).then(function (matching) {
// 	if (!matching || matching.status == 404) {
// 	return cache.match("offline.html");
// 	} else {
// 	return matching;
// 	}
// 	});
// 	});
// 	};
// 	var addToCache = function (request) {
// 	return caches.open("offline").then(function (cache) {
// 	return fetch(request).then(function (response) {
// 	return cache.put(request, response.clone()).then(function () {
// 	return response;
// 	});
// 	});
// 	});
// 	};
const CACHE_NAME = 'my-ecommerce-app-cache-v1';
const urlsToCache = [
	'/',
	'index.html',
	'script.js',
	'assets/css/style.css',
	'service-worker.js',
	'manifest.json',
	'offline.html'
	// Add more files to cache as needed
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache)
					.catch(function (error) {
						console.error('Cache.addAll error:', error);
					});
			})
	);
});

self.addEventListener('activate', function (event) {
	// Perform activation steps
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Fetch event listener
self.addEventListener("fetch", function (event) {
	event.respondWith(checkResponse(event.request).catch(function () {
		console.log("Fetch from cache successful!");
		return returnFromCache(event.request);
	}));
	console.log("Fetch successful!");
	event.waitUntil(addToCache(event.request));
});

// Sync event listener
self.addEventListener('sync', function (event) {
	if (event.tag === 'syncMessage') {
		console.log("Sync successful!");
	}
});

// Push event listener
self.addEventListener("push", function (event) {
	if (event && event.data) {
		try {
			var data = event.data.json();
			if (data && data.method === "pushMessage") {
				console.log("Push notification sent");
				self.registration.showNotification("Ecommerce website", { body: data.message });
			}
		} catch (error) {
			console.error("Error parsing push data:", error);
		}
	}
});

self.addEventListener('activate', async () => {
	if (Notification.permission !== 'granted') {
		try {
			const permission = await Notification.requestPermission();
			if (permission === 'granted') {
				console.log('Notification permission granted.');
			} else {
				console.warn('Notification permission denied.');
			}
		} catch (error) {
			console.error('Failed to request notification permission:', error);
		}
	}
});

var checkResponse = function (request) {
	return new Promise(function (fulfill, reject) {
		fetch(request)
			.then(function (response) {
				if (response.status !== 404) {
					fulfill(response);
				} else {
					reject(new Error("Response not found"));
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
};

var returnFromCache = function (request) {
	return caches.open("offline").then(function (cache) {
		return cache.match(request).then(function (matching) {
			if (!matching || matching.status == 404) {
				return cache.match("offline.html");
			} else {
				return matching;
			}
		});
	});
};

var addToCache = function (request) {
	return caches.open("offline").then(function (cache) {
		return fetch(request).then(function (response) {
			return cache.put(request, response.clone()).then(function () {
				return response;
			});
		});
	});
};